import type TelegramBot from "node-telegram-bot-api"
import type { CallbackQuery } from "node-telegram-bot-api"
import Session from "../../models/Session"
import { getWorkTechSteps } from "../../utils/api"
import { getImageBuffer } from "../../utils/getImageBuffer"
import { addMessagesToDelete } from "../../utils/addMessagesToDelete"

export const handleTechnologyCallback = async (bot: TelegramBot, msg: CallbackQuery) => {
    const { data } = msg
    const chatId = msg.message?.chat.id

    if (data && chatId) {
        try {
            const session = await Session.findOne({ where: { chatId }})

            if (session) {
                const currentWork = session.getDataValue('currentWork')

                if (currentWork) {
                    const { id, workTitle } = currentWork
                    const resp = await getWorkTechSteps(chatId, id)

                    if (resp.ok) {
                        const apiUrl = process.env.API_URL_IMAGE ?? ''
                        const steps = resp.data
                        const mesIds: number[] = []

                        if (steps.length > 0) {
                            const mes1 = await bot.sendMessage(chatId, 'Идет загрузка технологических подсказок...')
    
                            for (let i = 0; i < steps.length; i++) {
                                const step = steps[i]
                                if (step.templateSrc) {
                                    try {
                                        const imageBuffer = await getImageBuffer(apiUrl + step.templateSrc)
                                        await bot.sendPhoto(chatId, imageBuffer, { caption: `*Подсказка ${i + 1}*: ${step.description}`, parse_mode: 'Markdown' }, { filename: step.templateSrc })
                                        .then(msg => mesIds.push(msg.message_id))
                                    } catch(e) {
                                        console.log('photoError:', e)
                                    }
                                } else {
                                    await bot.sendMessage(chatId, `*Подсказка ${i + 1}*: ${step.description}`, { parse_mode: 'Markdown' })
                                    .then(msg => mesIds.push(msg.message_id))
                                }
                            }
                            bot.deleteMessage(chatId, mes1.message_id)
                        } else {
                            await bot.sendMessage(
                                chatId, 
                                `В работе - *${workTitle}* - отсутствуют технологические подсказки`,
                                { parse_mode: 'Markdown' }
                            )
                            .then(msg => mesIds.push(msg.message_id))
                        }
                        addMessagesToDelete(session, mesIds)
                    } else bot.sendMessage(chatId, 'Что-то пошло не так при получении технологии работы')
                } else bot.sendMessage(chatId, 'Что-то пошло не так при получении технологии работы')
            }  else bot.sendMessage(chatId, 'Что-то пошло не так при получении технологии работы')
        } catch (e) {
            console.log(e)
            bot.sendMessage(chatId, 'Что-то пошло не так при получении технологии работы')
        }
    }
}