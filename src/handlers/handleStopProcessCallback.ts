import type TelegramBot from "node-telegram-bot-api"
import type { CallbackQuery } from "node-telegram-bot-api"
import Session from "../models/Session"

export const handleStopProcessCallback = async (bot: TelegramBot, msg: CallbackQuery) => {
    const chatId = msg.message?.chat.id

    if (chatId) {
        try {
            const messageId = msg.message?.message_id
            const session = await Session.findOne({ where: { chatId } })
            const sessionAction = session?.getDataValue('action')
    
            if (sessionAction?.includes('auth')) {
                await session?.destroy()
            } else {
                session?.update({ action: 'idle' })
            }
    
            if (sessionAction !== 'idle') await bot.sendMessage(chatId, 'Процесс завершен')
    
            messageId && await bot.deleteMessage(chatId, messageId)
        } catch {
            await bot.sendMessage(chatId, 'Что-то пошло не так при завершении процесса')
        }
    }
}