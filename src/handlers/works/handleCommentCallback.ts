import type TelegramBot from "node-telegram-bot-api"
import type { CallbackQuery } from "node-telegram-bot-api"
import Session from "../../models/Session"
import { commentPhotosOptions } from "../../utils/options"
import { deleteMessagesToDelete } from "../../utils/deleteMessagesToDelete"

export const handleCommentCallback = async (bot: TelegramBot, msg: CallbackQuery) => {
    const chatId = msg.message?.chat.id

    if (chatId) {
        try {
            const session = await Session.findOne({ where: { chatId }})

            if (session) {
                await session.update({ action: 'work_comment' })
                deleteMessagesToDelete(bot, session, chatId)

                const mes1 = await bot.sendMessage(chatId, 'Введите комментарий или прикрепите изображение к чату (После загрузки изображений в чат нажмите кнопку *Отправить*).\nИли завершите процесс ввода данных:', { parse_mode: 'Markdown', ...commentPhotosOptions })
                const messagesToDelete = session.getDataValue('messagesToDelete')
                messagesToDelete && await session.update({ photos: [], commentWithPhotos: '', messagesToDelete: [...messagesToDelete, mes1.message_id]})
            } else bot.sendMessage(chatId, 'Что-то пошло не так при старте ввода комментария')
        } catch {
            await bot.sendMessage(chatId, 'Что-то пошло не так при старте ввода комментария')
        }
    }
}