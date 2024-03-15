import type TelegramBot from "node-telegram-bot-api"
import type { CallbackQuery } from "node-telegram-bot-api"
import Session from "../../models/Session"
import { getWorks } from "../../utils/api"
import { statusMap } from "../../utils/statusMap"
import { getWorksOptions } from "../../utils/options"
import type { TWorkStatus } from "../../interfaces/work.interface"

export const handleWorksCallback = async (bot: TelegramBot, msg: CallbackQuery) => {
    const { data } = msg
    const chatId = msg.message?.chat.id
   
    if (data && chatId) {
        try {
            const { payload } = JSON.parse(data)
            const messageId = msg.message?.message_id
            const session = await Session.findOne({ where: { chatId }})

            if (session) {
                const projectId = session.getDataValue('projectId')
                const periodDuration = session.getDataValue('periodDuration')

                if (payload) {
                    await session.update({ periodDuration: payload })
                    messageId && await bot.deleteMessage(chatId, messageId)
                }

                if (projectId && periodDuration) {
                    const duration = payload ?? periodDuration
                    const resp = await getWorks(chatId, projectId, duration)

                    if (resp.ok) {
                        const works = resp.data
                        
                        if (works.length > 0) {
                            const worksList: {name: string, workTitle: string, status: TWorkStatus, id: number}[] = []

                            const response = works.reduce((sum, work, i) => {
                                const name = `${i + 1}| ${statusMap[work.status].emoji}${work.workTitle} | ${work.actualStart} - ${work.actualEnd} | ${statusMap[work.status].name}${statusMap[work.status].emoji} |\n\n`
                                worksList.push({ name, workTitle: work.workTitle, status: work.status, id: work.id })
                                return sum += name
                            }, '')
                            
                            await session.update({ worksList })
                            
                            await bot.sendMessage(
                                chatId, 
                                `Список работ на следующий(-ие) ${duration} день(-ня, -ней):\n\n<pre language="copy">${response}</pre>\nВыберите работу для дальнейшего взаимодeйствия с ней:`, 
                                getWorksOptions(works)
                            )
                        } else {
                            await bot.sendMessage(chatId, `Список работ пустой на следующий(-ие) ${payload} день(-ня, -ней)`)
                        }
                    } else bot.sendMessage(chatId, 'Что-то пошло не так при получении списка работ')
                } else bot.sendMessage(chatId, 'Что-то пошло не так при получении списка работ')
            }  else bot.sendMessage(chatId, 'Что-то пошло не так при получении списка работ')
        } catch (e) {
            console.log(e)
            bot.sendMessage(chatId, 'Что-то пошло не так при получении списка работ')
        }
    }
}