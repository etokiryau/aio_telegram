import type TelegramBot from "node-telegram-bot-api"
import type { CallbackQuery } from "node-telegram-bot-api"
import { homeOptions } from "../../utils/options"

export const handleHomeCallback = async (bot: TelegramBot, msg: CallbackQuery) => {
    const chatId = msg.message?.chat.id
    const messageId = msg.message?.message_id

    if (chatId) {
        try {
            messageId && await bot.deleteMessage(chatId, messageId)
            await bot.sendMessage(chatId, 'Список действий с проектом:', homeOptions)
        } catch {
            bot.sendMessage(chatId, 'Что-то пошло не так')
        }
    }
}