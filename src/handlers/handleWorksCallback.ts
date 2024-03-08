import type TelegramBot from "node-telegram-bot-api"
import type { CallbackQuery } from "node-telegram-bot-api"
import Session from "../models/Session"
import { getWorks } from "../utils/api"
import { statusMap } from "../utils/statusMap"
import { getWorksOptions } from "../utils/options"
import type { TWorkStatus } from "../interfaces/work.interface"

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

                if (projectId) {
                    const resp = await getWorks(chatId, projectId, payload)

                    if (resp.ok) {
                        messageId && await bot.deleteMessage(chatId, messageId)
                        const works = resp.data
                        
                        if (works.length > 0) {
                            const worksList: {name: string, status: TWorkStatus}[] = []

                            const response = works.reduce((sum, work, i) => {
                                const name = `${i + 1}|"${work.workTitle}"|"${work.actualStart} - ${work.actualEnd}"|"${statusMap[work.status]}"|\n\n`
                                worksList.push({ name, status: work.status })
                                return sum += name
                            }, '')
                            
                            await session.update({ worksList })
                            
                            await bot.sendMessage(chatId, `Список работ на следующий(-ие) ${payload} день(-ня, -ней):\n\n<pre language="copy">${response}</pre>\nВыберите работу для дальнейшего взаимодeйствия с ней:`, getWorksOptions(works))
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