import type TelegramBot from "node-telegram-bot-api"
import Session from "../models/Session"

import { handleAuthPasswordMessage } from "../handlers/handleAuthPasswordMessage"
import { handleAuthEmailMessage } from "../handlers/handleAuthEmailMessage"
import { handleCommentMessage } from "../handlers/handlecommentMessage"

export const onMessage = (bot: TelegramBot) => {
    bot.on('message', async (msg) => {
        const { text, chat: { id: chatId }} = msg

        if (text && text.startsWith('/')) return

        try {
            const session = await Session.findOne({ where: { chatId }})
        
            if (session) {
                const action = session.getDataValue('action')

                if (action === 'auth_email') handleAuthEmailMessage(bot, session, msg)

                if (action === 'auth_password') handleAuthPasswordMessage(bot, session, msg)

                if (action === 'comment') handleCommentMessage(bot, session, msg)
            }
        } catch {
            bot.sendMessage(chatId, 'Что-то пошло не так')
        }
    })
}