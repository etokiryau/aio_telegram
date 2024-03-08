import type TelegramBot from "node-telegram-bot-api"
import { logonOptions, materialsPeriodOptions } from "../utils/options"
import User from "../models/User"
import { checkCurrentAction } from "../utils/checkCurrentAction"
import Session from "../models/Session"

export const onMaterials = (bot: TelegramBot) => {
    bot.onText(/\/materials/, async (msg) => {
        const chatId = msg.chat.id
        const session = await Session.findOne({ where: { chatId }})
        
        try {
            if (await checkCurrentAction(bot, session, chatId)) return

            const user = await User.findOne({ where: { chatId }})
            
            if (user) {
                await bot.sendMessage(chatId, 'Выберите период, за который вывести список материлов', materialsPeriodOptions)
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