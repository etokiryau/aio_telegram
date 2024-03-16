import type TelegramBot from "node-telegram-bot-api"
import type { CallbackQuery } from "node-telegram-bot-api"
import Session from "../../models/Session"
import { acceptWork, finishWork, startWork } from "../../utils/api"
import { stopProcessOptions } from "../../utils/options"

export const handleStatusConfirmCallback = async (bot: TelegramBot, msg: CallbackQuery) => {
    const data = msg.data
    const chatId = msg.message?.chat.id

    if (chatId && data) {
        try {
            const session = await Session.findOne({ where: { chatId }})
           
            if (session) {
                const currentWork = session.getDataValue('currentWork')
                const workDate = session.getDataValue('workDate')

                if (currentWork) {
                    const { id, status, workTitle } = currentWork
                    const messageId = msg.message?.message_id

                    const sendFeedback = async (ok: boolean, toStatus: string) => {
                        if (ok) {
                            await bot.sendMessage(chatId, `Статус работы *${workTitle}* изменен на *${toStatus}*`, { parse_mode: 'Markdown' })
                        } else {
                            await bot.sendMessage(chatId, 'Что-то пошло не так при изменении статуса')
                        }
                    }

                    const mes1 = await bot.sendMessage(chatId, 'Изменяем статус работы...')
                    
                    if (status === 'notStarted') {
                        const ok = await startWork(chatId, id, workDate) 
                        messageId && await bot.deleteMessage(chatId, messageId)
                        await bot.deleteMessage(chatId, mes1.message_id)
                        await sendFeedback(ok, 'Начато')
                        return session.update({ workDate: '' })
                    }

                    if (status === 'started') {
                        const ok = await finishWork(chatId, id, workDate) 
                        messageId && await bot.deleteMessage(chatId, messageId)
                        await bot.deleteMessage(chatId, mes1.message_id)
                        await sendFeedback(ok, 'Завершено')
                        
                        if (ok) {
                            await session.update({ workDate: '', action: 'photo' })
                            return bot.sendMessage(chatId, 'Прикрепите от 3 фото выполненной работы (крупный план, общий план, сбоку) или отмените процесс загрузки фото:', stopProcessOptions)
                        }
                    }

                    if (status === 'finished') {
                        const ok = await acceptWork(chatId, id)
                        messageId && await bot.deleteMessage(chatId, messageId)
                        await bot.deleteMessage(chatId, mes1.message_id)
                        return sendFeedback(ok, 'Принято')
                    }
                }
            }
        } catch {
            await bot.sendMessage(chatId, 'Что-то пошло не так при старте ввода комментария')
        }
    }
}