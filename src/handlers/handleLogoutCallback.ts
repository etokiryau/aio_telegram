import type TelegramBot from "node-telegram-bot-api"
import type { CallbackQuery } from "node-telegram-bot-api"
import Session from "../models/Session"
import User from "../models/User"

export const handleLogoutCallback = async (bot: TelegramBot, msg: CallbackQuery) => {
    const { data } = msg
    const chatId = msg.message?.chat.id

    if (data && chatId) {
        try {
            await Session.destroy({ where: { chatId } })
            await User.destroy({ where: { chatId } })

            const messageId = msg.message?.message_id
            messageId && await bot.deleteMessage(chatId, messageId)
            
            await bot.sendMessage(chatId, 'Вы вышли из системы. Ваши данные удалены')
        } catch {
            await bot.sendMessage(chatId, 'Что-то пошло не так при выходе из системы')
        }
    }
}