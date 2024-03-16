import type TelegramBot from "node-telegram-bot-api"
import type { CallbackQuery } from "node-telegram-bot-api"
import Session from "../../models/Session"
import { stopProcessOptions } from "../../utils/options"
import { addMessagesToDelete } from "../../utils/addMessagesToDelete"

export const handleDeclineWorkCallback = async (bot: TelegramBot, msg: CallbackQuery) => {
    const chatId = msg.message?.chat.id

    if (chatId) {
        try {
            // const messageId = msg.message?.message_id
            // messageId && await bot.deleteMessage(chatId, messageId)
        
            const session = await Session.findOne({ where: { chatId }})

            if (session) {
                await session.update({ action: 'work_decline' })
                const mes1 = await bot.sendMessage(chatId, 'Введите, пожалуйста, комментарий к отклоняемой работе.\nИли завершите процесс ввода данных', stopProcessOptions)
                addMessagesToDelete(session, [mes1.message_id])
            } else bot.sendMessage(chatId, 'Что-то пошло не так при старте ввода комментария')
        } catch {
            await bot.sendMessage(chatId, 'Что-то пошло не так при старте ввода комментария')
        }
    }
}