import type TelegramBot from "node-telegram-bot-api"
import Session from "../models/Session"
import sequelize from "../../db"

export const onPhoto = (bot: TelegramBot) => {
    bot.on('photo', async (msg) => {
        const { photo, chat: { id: chatId }} = msg

        const session = await Session.findOne({ where: { chatId }})
        
        if (session) {
            const action = session.getDataValue('action')
            const photos = session.getDataValue('photos')

            if (action === 'photo' && photo && photo.length > 0 && photos) {
                const newPhoto = photo.pop();

                if (newPhoto) {
                    await session.update({
                        photos: sequelize.literal(`array_append(photos, '${newPhoto.file_id}')`)
                    })
                }
            }
        }
    })
}