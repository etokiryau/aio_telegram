import type TelegramBot from "node-telegram-bot-api"
import type { CallbackQuery } from "node-telegram-bot-api"
import Session from "../../models/Session"

export const handleCancelCallback = async (bot: TelegramBot, msg: CallbackQuery) => {
    const chatId = msg.message?.chat.id

    if (chatId) {
        try {
            const messageId = msg.message?.message_id
            messageId && await bot.deleteMessage(chatId, messageId)
            const session = await Session.findOne({ where: { chatId } })
            await session?.update({ action: 'idle' })
        } catch (e) {
            console.log(e)
            await bot.sendMessage(chatId, 'Что-то пошло не так')
        }
    }
}