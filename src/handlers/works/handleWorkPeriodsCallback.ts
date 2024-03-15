import type TelegramBot from "node-telegram-bot-api"
import type { CallbackQuery } from "node-telegram-bot-api"
import { logonOptions, worksPeriodOptions } from "../../utils/options"
import User from "../../models/User"

export const handleWorkPeriodsCallback = async (bot: TelegramBot, msg: CallbackQuery) => {
    const chatId = msg.message?.chat.id
    const messageId = msg.message?.message_id

    if (chatId) {
        try {
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
            messageId && bot.deleteMessage(chatId, messageId)
        } catch(error) {
            console.error('Error:', error);
            bot.sendMessage(chatId, 'Что-то пошло не так')
        }
    }
}