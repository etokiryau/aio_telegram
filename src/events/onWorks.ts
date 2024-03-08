import type TelegramBot from "node-telegram-bot-api"
import { logonOptions, worksPeriodOptions } from "../utils/options"
import User from "../models/User"
import Session from "../models/Session"
import { checkCurrentAction } from "../utils/checkCurrentAction"

export const onWorks = (bot: TelegramBot) => {
    bot.onText(/\/works/, async (msg) => {
        const chatId = msg.chat.id

        try {
            const session = await Session.findOne({ where: { chatId }})

            if (await checkCurrentAction(bot, session, chatId)) return

            const user = await User.findOne({ where: { chatId }})
            
            if (user) {
                await bot.sendMessage(chatId, 'Выберите период, за который вывести список работ', worksPeriodOptions)
            } else {
                return bot.sendMessage(
                    chatId, 
                    'Вы еще не авторизованы в системе',
                    logonOptions
                )
            }
        } catch(error) {
            console.error('Error:', error);
            bot.sendMessage(chatId, 'Что-то пошло не так')
        }
    })
}