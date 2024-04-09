import type TelegramBot from "node-telegram-bot-api"
import Session from "../models/Session"

import { handleAuthPasswordMessage } from "../handlers/auth/handleAuthPasswordMessage"
import { handleAuthEmailMessage } from "../handlers/auth/handleAuthEmailMessage"
import { handleCommentMessage } from "../handlers/works/handleCommentMessage"
import { handleAnotherDateMessage } from "../handlers/works/handleAnotherDateMessage"
import { handleDeclineWorkMessage } from "../handlers/works/handleDeclineWorkMessage"

export const onMessage = (bot: TelegramBot) => {
    bot.on('message', async (msg) => {
        const { text, chat: { id: chatId }} = msg
        console.log(msg)
        if (text && text.startsWith('/')) return

        try {
            const session = await Session.findOne({ where: { chatId }})
        
            if (session) {
                const action = session.getDataValue('action')

                if (action === 'auth_email') handleAuthEmailMessage(bot, session, msg)

                if (action === 'auth_password') handleAuthPasswordMessage(bot, session, msg)

                if (action === 'work_comment') handleCommentMessage(bot, session, msg)

                if (action === 'work_date') handleAnotherDateMessage(bot, session, msg)

                if (action === 'work_decline') handleDeclineWorkMessage(bot, session, msg)
            }
        } catch {
            bot.sendMessage(chatId, 'Что-то пошло не так при вводе данных')
        }
    })
}