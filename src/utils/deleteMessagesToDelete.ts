import type TelegramBot from "node-telegram-bot-api"
import type { IModelSession } from "../interfaces/session.interface"

export const deleteMessagesToDelete = async (bot: TelegramBot, session: IModelSession | null, chatId: number) => {
    if (session) {
        const messagesToDelete = session.getDataValue('messagesToDelete')
        
        if (messagesToDelete) {
            for (const messageId of messagesToDelete) {
                try {
                    bot.deleteMessage(chatId, messageId)
                } catch (e) { console.log(e) }
            }
            await session.update({ messagesToDelete: [] })
        }
    }
}