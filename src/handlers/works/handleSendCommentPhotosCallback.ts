import type TelegramBot from "node-telegram-bot-api"
import type { CallbackQuery } from "node-telegram-bot-api"
import Session from "../../models/Session"
import { deleteMessagesToDelete } from "../../utils/deleteMessagesToDelete"
import { getFormData } from "../../utils/getFormData"
import { addWorkComment } from "../../utils/api"
import { addMessagesToDelete } from "../../utils/addMessagesToDelete"

export const handleSendCommentPhotosCallback = async (bot: TelegramBot, msg: CallbackQuery) => {
    const chatId = msg.message?.chat.id
    const messageId = msg.message?.message_id

    if (chatId) {
        try {
            const session = await Session.findOne({ where: { chatId }})

            if (session) {
                const currentWork = session.getDataValue('currentWork')
                const commentWithPhotos = session.getDataValue('commentWithPhotos')
                const photos = session.getDataValue('photos')

                if (photos && currentWork && commentWithPhotos) {
                    messageId && await bot.deleteMessage(chatId, messageId)
                    deleteMessagesToDelete(bot, session, chatId)

                    const mes1 = await bot.sendMessage(chatId, 'Добавляем изображения к чату...')
    
                    const formData = await getFormData(bot, photos)

                    const ok = await addWorkComment(chatId, currentWork.id, commentWithPhotos, formData)

                    if (ok) {
                        await bot.deleteMessage(chatId, mes1.message_id)
                        const mes2 = await bot.sendMessage(chatId, 'Комментарий с изображениями добавлены в чат')
                        addMessagesToDelete(session, [mes2.message_id])
                    } else {
                        await bot.sendMessage(chatId, 'Что-то пошло не так при отправке комменатрия')
                    } 
                
                    await session.update({ action: 'idle', photos: [], commentWithPhotos: '' })
                    deleteMessagesToDelete(bot, session, mes1.message_id)
                } else bot.sendMessage(chatId, 'Что-то пошло не так при отправке комменатрия')
            } else bot.sendMessage(chatId, 'Что-то пошло не так при отправке комменатрия')
        } catch {
            await bot.sendMessage(chatId, 'Что-то пошло не так при отправке комменатрия')
        }
    }
}