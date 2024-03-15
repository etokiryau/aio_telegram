import type TelegramBot from "node-telegram-bot-api"
import type { CallbackQuery } from "node-telegram-bot-api"
import Session from "../../models/Session"
import { stopProcessOptions } from "../../utils/options"

export const handleAnotherDateCallback = async (bot: TelegramBot, msg: CallbackQuery) => {
    const chatId = msg.message?.chat.id

    if (chatId) {
        try {
            const messageId = msg.message?.message_id
            messageId && await bot.deleteMessage(chatId, messageId)
        
            const session = await Session.findOne({ where: { chatId }})

            if (session) {
                await session.update({ action: 'work_date' })
                
                await bot.sendMessage(chatId, 'Введите фактическую дату в формате *ГГГГ-ММ-ДД*\nИли завершите процесс ввода данных', { ...stopProcessOptions, parse_mode: 'Markdown' })
                .then(msg => session.update({ messagesToDelete: [msg.message_id] }))
            } else bot.sendMessage(chatId, 'Что-то пошло не так при старте ввода даты')
        } catch {
            await bot.sendMessage(chatId, 'Что-то пошло не так при старте ввода даты')
        }
    }
}