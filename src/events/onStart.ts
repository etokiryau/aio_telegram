import type TelegramBot from "node-telegram-bot-api"
import { logonOptions } from "../utils/options"
import User from "../models/User"
import Session from "../models/Session"
import { checkCurrentAction } from "../utils/checkCurrentAction"

export const onStart = (bot: TelegramBot) => {
    bot.onText(/\/start/, async (msg) => {
        const chatId = msg.chat.id

        try {
            const session = await Session.findOne({ where: { chatId }})

            if (await checkCurrentAction(bot, session, chatId)) return
            const user = await User.findOne({ where: { chatId }})
   
            if (user) {
                const email = user.getDataValue('email')
                await bot.sendMessage(chatId, `Вы авторизованы как ${email}`)
            } else {
                return bot.sendMessage(
                    chatId, 
                    'Добро пожаловать в телеграм бот экосистемы АИО.\nДля дальнейшего использования авторизуйтесь в системе',
                    logonOptions
                )
            }
        } catch(error) {
            console.error('Error:', error);
            bot.sendMessage(chatId, 'Что-то пошло не так')
        }
    })
}