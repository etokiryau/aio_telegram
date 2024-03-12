import type TelegramBot from "node-telegram-bot-api"
import type { CallbackQuery } from "node-telegram-bot-api"
import Session from "../../models/Session"

export const handleAuthCallback = async (bot: TelegramBot, msg: CallbackQuery) => {
    const { data } = msg
    const chatId = msg.message?.chat.id

    if (data && chatId) {
        const messageId = msg.message?.message_id

        try {
            await Session.create({ chatId })
            await bot.editMessageReplyMarkup({ inline_keyboard: [] }, {
                chat_id: chatId,
                message_id: messageId
            })
            await bot.sendMessage(chatId, 'Введите, пожалуйста, почту')
        } catch {
            messageId && await bot.deleteMessage(chatId, messageId)
            await bot.sendMessage(chatId, 'Введите, пожалуйста, почту')
        }
    }
}