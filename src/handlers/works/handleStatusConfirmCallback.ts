import type TelegramBot from "node-telegram-bot-api"
import type { CallbackQuery } from "node-telegram-bot-api"
import Session from "../../models/Session"
import { acceptWork, finishWork, startWork } from "../../utils/api"

export const handleStatusConfirmCallback = async (bot: TelegramBot, msg: CallbackQuery) => {
    const data = msg.data
    const chatId = msg.message?.chat.id

    if (chatId && data) {
        try {
            const { toStatus } = JSON.parse(data)
            const messageId = msg.message?.message_id
            messageId && await bot.deleteMessage(chatId, messageId)
        
            const session = await Session.findOne({ where: { chatId }})
           
            if (session) {
                const currentWork = session.getDataValue('currentWork')
                const workDate = session.getDataValue('workDate')

                if (currentWork) {
                    const { id, status, workTitle } = currentWork

                    const sendFeedback = async (ok: boolean, toStatus: string) => {
                        if (ok) {
                            await bot.sendMessage(chatId, `Статус работы *${workTitle}* изменен на *${toStatus}*`, { parse_mode: 'Markdown' })
                        } else {
                            await bot.sendMessage(chatId, 'Что-то пошло не так при изменении статуса')
                        }
                    }
                    
                    if (status === 'notStarted') {
                        const ok = await startWork(chatId, id, workDate) 
                        await sendFeedback(ok, 'Начато')
                        return session.update({ workDate: '' })
                    }

                    if (status === 'started') {
                        const ok = await finishWork(chatId, id, workDate) 
                        await sendFeedback(ok, 'Завершено')
                        return session.update({ workDate: '' })
                    }

                    if (status === 'finished') {
                        const ok = await acceptWork(chatId, id)
                        return sendFeedback(ok, toStatus === 'accepted' ? 'Принято' : 'Отклонено')
                    }
                }
                
            }
        } catch {
            await bot.sendMessage(chatId, 'Что-то пошло не так при старте ввода комментария')
        }
    }
}