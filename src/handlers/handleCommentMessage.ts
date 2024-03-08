import type TelegramBot from "node-telegram-bot-api"
import type { Message } from "node-telegram-bot-api"
import type { IModelSession } from "../interfaces/session.interface"

import { addWorkComment } from "../utils/api"

export const handleCommentMessage = async (bot: TelegramBot, session: IModelSession, msg: Message) => {
    const { text, chat: { id: chatId }} = msg
    const currentWork = session.getDataValue('currentWork')

    if (text && currentWork) {
        const ok = await addWorkComment(chatId, currentWork.id, text)

        if (ok) {
            await session.update({ action: 'idle' })
            await bot.sendMessage(chatId, 'Комментарий добавлен в чат')
        } else {
            await bot.sendMessage(chatId, 'Что-то пошло не так при добавлении комментария в чат')
        }
    }
}