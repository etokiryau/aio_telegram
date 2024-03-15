import type TelegramBot from "node-telegram-bot-api"
import type { CallbackQuery } from "node-telegram-bot-api"

export const handleCancelCallback = async (bot: TelegramBot, msg: CallbackQuery) => {
    const chatId = msg.message?.chat.id

    if (chatId) {
        try {
            const messageId = msg.message?.message_id
            messageId && await bot.deleteMessage(chatId, messageId)
        } catch (e) {
            console.log(e)
            await bot.sendMessage(chatId, 'Что-то пошло не так')
        }
    }
}