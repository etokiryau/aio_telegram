import type TelegramBot from "node-telegram-bot-api"
import type { Message } from "node-telegram-bot-api"
import type { IModelSession } from "../interfaces/session.interface"

export const handleAuthEmailMessage = async (bot: TelegramBot, session: IModelSession, msg: Message) => {
    const { text, chat: { id: chatId }} = msg

    if (text) {
        await session.update({ email: text, action: 'auth_password' })
        await bot.sendMessage(chatId, 'Введите, пожалуйста, пароль')
    }
}