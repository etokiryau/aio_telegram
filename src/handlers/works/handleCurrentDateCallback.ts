import type TelegramBot from "node-telegram-bot-api"
import type { CallbackQuery } from "node-telegram-bot-api"
import { confirmOptions } from "../../utils/options"

export const handleCurrentDateCallback = async (bot: TelegramBot, msg: CallbackQuery) => {
    const chatId = msg.message?.chat.id

    if (chatId) {
        try {
            const messageId = msg.message?.message_id
            messageId && await bot.deleteMessage(chatId, messageId)
        
            await bot.sendMessage(chatId, `Подтвердите действие:`, confirmOptions)
        } catch {
            await bot.sendMessage(chatId, 'Что-то пошло не так при старте ввода даты')
        }
    }
}