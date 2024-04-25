import type TelegramBot from "node-telegram-bot-api"
import type { CallbackQuery } from "node-telegram-bot-api"
import Session from "../../models/Session"
import { deleteMessagesToDelete } from "../../utils/deleteMessagesToDelete"
import { getFormData } from "../../utils/getFormData"
import { loadTechImages } from "../../utils/api"
import { addMessagesToDelete } from "../../utils/addMessagesToDelete"

export const handleSendWorkPhotosCallback = async (bot: TelegramBot, msg: CallbackQuery) => {
    const chatId = msg.message?.chat.id
    const messageId = msg.message?.message_id

    if (chatId) {
        try {
            const session = await Session.findOne({ where: { chatId }})

            if (session) {
                const currentWork = session.getDataValue('currentWork')
                const projectId = session.getDataValue('projectId')
                const photos = session.getDataValue('photos')

                if (photos && currentWork && projectId) {
                    messageId && await bot.deleteMessage(chatId, messageId)
                    deleteMessagesToDelete(bot, session, chatId)

                    const mes1 = await bot.sendMessage(chatId, 'Добавляем изображения к работе...')
    
                    const formData = await getFormData(bot, photos)

                    const ok = await loadTechImages(chatId, projectId, currentWork.id, formData)

                    if (ok) {
                        await bot.deleteMessage(chatId, mes1.message_id)
                        const mes2 = await bot.sendMessage(chatId, 'Изображения добавлены в работу')
                        addMessagesToDelete(session, [mes2.message_id])
                    } else {
                        await bot.sendMessage(chatId, 'Что-то пошло не так при загрузке изобажения')
                    } 
                
                    await session.update({ action: 'idle', photos: [] })
                    deleteMessagesToDelete(bot, session, mes1.message_id)
                } else bot.sendMessage(chatId, 'Что-то пошло не так при загрузке изобажения')
            } else bot.sendMessage(chatId, 'Что-то пошло не так при загрузке изобажения')
        } catch {
            await bot.sendMessage(chatId, 'Что-то пошло не так при загрузке изобажения')
        }
    }
}