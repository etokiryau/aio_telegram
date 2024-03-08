import type TelegramBot from "node-telegram-bot-api"
import { logonOptions, logoutOptions } from "../utils/options"
import User from "../models/User"
import Session from "../models/Session"
import { checkCurrentAction } from "../utils/checkCurrentAction"

export const onStop = (bot: TelegramBot) => {
    bot.onText(/\/stop/, async (msg) => {
        const chatId = msg.chat.id

        
        try {
            const session = await Session.findOne({ where: { chatId }})

            if (await checkCurrentAction(bot, session, chatId)) return

            const user = await User.findOne({ where: { chatId }})
            
            if (user) {
                await bot.sendMessage(
                    chatId, 
                    'При выходе из аккаунта Ваши данные, сохраненные в телеграм боте, будут удалены', 
                    logoutOptions
                )
            } else {
                return bot.sendMessage(
                    chatId, 
                    'Вы еще не авторизованы в системе',
                    logonOptions
                )
            }
        } catch(error) {
            bot.sendMessage(chatId, 'Что-то пошло не так при выходе из системы')
        }
    })
}