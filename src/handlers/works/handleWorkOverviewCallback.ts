import type TelegramBot from "node-telegram-bot-api"
import type { CallbackQuery } from "node-telegram-bot-api"
import Session from "../../models/Session"
import { getWorkTechSteps } from "../../utils/api"
import { getWorkChangeOptions } from "../../utils/options"
import { getImageBuffer } from "../../utils/getImageBuffer"

export const handleWorkOverviewCallback = async (bot: TelegramBot, msg: CallbackQuery) => {
    const { data } = msg
    const chatId = msg.message?.chat.id

    if (data && chatId) {
        try {
            const { payload: { id, order} } = JSON.parse(data)
            const messageId = msg.message?.message_id
            const session = await Session.findOne({ where: { chatId }})

            if (session) {
                const worksList = session.getDataValue('worksList')

                if (worksList) {
                    const resp = await getWorkTechSteps(chatId, id)

                    if (resp.ok) {
                        const apiUrl = process.env.API_URL_IMAGE ?? ''
                        const steps = resp.data

                        if (steps.length > 0) {
                            await bot.sendMessage(
                                chatId, 
                                `${worksList[order].name}\nИдет загрузка технологических подсказок...`
                            )
    
                            for (let i = 0; i < steps.length; i++) {
                                const step = steps[i]
                                if (step.templateSrc) {
                                    try {
                                        const photoBuffer = await getImageBuffer(apiUrl + step.templateSrc)
                                        await bot.sendPhoto(chatId, photoBuffer, { caption: `*Подсказка ${i + 1}*: ${step.description}`, parse_mode: 'Markdown' }, { filename: step.templateSrc})
                                    } catch(e) {
                                        // console.log('photoError:', e)
                                    }
                                } else {
                                    await bot.sendMessage(chatId, `*Подсказка ${i + 1}*: ${step.description}`, { parse_mode: 'Markdown' })
                                }
                            }
                        } else {
                            await bot.sendMessage(
                                chatId, 
                                `${worksList[order].name.replace('\n', '')}`
                            )
                        }

                        await session.update({ currentWork: {id, workTitle: worksList[order].workTitle, status: worksList[order].status } })
                        await bot.sendMessage(chatId, 'Выберите опцию для дальнейшего взаимодeйствия с работой:', getWorkChangeOptions(id))
                    } else bot.sendMessage(chatId, 'Что-то пошло не так при получении данных по работе')
                } else bot.sendMessage(chatId, 'Что-то пошло не так при получении данных по работе')
            }  else bot.sendMessage(chatId, 'Что-то пошло не так при получении данных по работе')
        } catch (e) {
            console.log(e)
            bot.sendMessage(chatId, 'Что-то пошло не так при получении данных по работе')
        }
    }
}