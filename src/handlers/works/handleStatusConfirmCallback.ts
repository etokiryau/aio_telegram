import type TelegramBot from "node-telegram-bot-api"
import type { CallbackQuery } from "node-telegram-bot-api"
import Session from "../../models/Session"
import { acceptWork, finishWork, startWork } from "../../utils/api"
import { sendTechnologyStep } from "../../utils/sendTechnologyStep"

export const handleStatusConfirmCallback = async (bot: TelegramBot, msg: CallbackQuery) => {
    const data = msg.data
    const chatId = msg.message?.chat.id

    if (chatId && data) {
        try {
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
                        await session.update({ workDate: '' })

                        const technologySteps = session.getDataValue('technologySteps')

                        if (technologySteps && technologySteps.length > 0) {
                            await session.update({ action: 'photo', currentStepToLoad: 0 })
                            await bot.sendMessage(chatId, 'Ожидаем список технологических подсказок...')
                            await sendTechnologyStep(bot, chatId, session)
                        }
                        return
                    }

                    if (status === 'finished') {
                        const ok = await acceptWork(chatId, id)
                        return sendFeedback(ok, 'Принято')
                    }
                }
            }
        } catch {
            await bot.sendMessage(chatId, 'Что-то пошло не так при старте ввода комментария')
        }
    }
}