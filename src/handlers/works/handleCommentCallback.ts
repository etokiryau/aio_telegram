import type TelegramBot from "node-telegram-bot-api"
import type { CallbackQuery } from "node-telegram-bot-api"
import Session from "../../models/Session"
import { stopProcessOptions } from "../../utils/options"

export const handleCommentCallback = async (bot: TelegramBot, msg: CallbackQuery) => {
    const chatId = msg.message?.chat.id

    if (chatId) {
        try {
            // const messageId = msg.message?.message_id
            // messageId && await bot.deleteMessage(chatId, messageId)
        
            const session = await Session.findOne({ where: { chatId }})

            if (session) {
                session.update({ action: 'work_comment' })
                bot.sendMessage(chatId, 'Введите, пожалуйста, комментарий.\nИли завершите процесс ввода данных', stopProcessOptions)
            } else bot.sendMessage(chatId, 'Что-то пошло не так при старте ввода комментария')
        } catch {
            await bot.sendMessage(chatId, 'Что-то пошло не так при старте ввода комментария')
        }
    }
}