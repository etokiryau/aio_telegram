import type TelegramBot from "node-telegram-bot-api"
import type { Message } from "node-telegram-bot-api"
import type { IModelSession } from "../../interfaces/session.interface"
import { addWorkComment } from "../../utils/api"
import { commentBackOptions } from "../../utils/options"
import { deleteMessagesToDelete } from "../../utils/deleteMessagesToDelete"
import { addMessagesToDelete } from "../../utils/addMessagesToDelete"
import { getFormData } from "../../utils/getFormData"

export const handleCommentMessage = async (bot: TelegramBot, session: IModelSession, msg: Message) => {
    const { text, caption, photo, chat: { id: chatId }} = msg
    const currentWork = session.getDataValue('currentWork')

    try {
        if (text && currentWork) {
            const mes1 = await bot.sendMessage(chatId, 'Идет процесс добавления комментария...')
            const ok = await addWorkComment(chatId, currentWork.id, text, null)
            await deleteMessagesToDelete(bot, session, chatId)

            if (ok) {
                await bot.deleteMessage(chatId, mes1.message_id)
                const mes2 = await bot.sendMessage(chatId, 'Комментарий добавлен в чат.\nОставьте еще комментарий или выйдите из данного процесса:', commentBackOptions)
                addMessagesToDelete(session, [mes2.message_id])
            } else {
                await bot.sendMessage(chatId, 'Что-то пошло не так при добавлении комментария в чат')
            }
        } else if (photo && currentWork) {
            const mes1 = await bot.sendMessage(chatId, 'Идет процесс добавления изображения...')
            const formData = await getFormData(bot, photo)
            const ok = await addWorkComment(chatId, currentWork.id, caption ?? '', formData)
            await deleteMessagesToDelete(bot, session, chatId)

            if (ok) {
                await bot.deleteMessage(chatId, mes1.message_id)
                const mes2 = await bot.sendMessage(chatId, 'Фото добавлено в чат.\nПрикрепите еще изображения или выйдите из данного процесса:', commentBackOptions)
                addMessagesToDelete(session, [mes2.message_id])
            } else {
                await bot.sendMessage(chatId, 'Что-то пошло не так при добавлении изображений в чат')
            }
        } else await bot.sendMessage(chatId, 'Что-то пошло не так при добавлении комментария в чат')
    } catch {
        await bot.sendMessage(chatId, 'Что-то пошло не так при добавлении комментария в чат')
    }
}