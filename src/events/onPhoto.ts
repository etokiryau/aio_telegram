import type TelegramBot from "node-telegram-bot-api"
import { Blob } from "buffer"
import Session from "../models/Session"
import { getImageArrayBuffer } from "../utils/getImageArrayBuffer"
import { loadTempTechStepImage } from "../utils/api"

export const onPhoto = (bot: TelegramBot) => {
    bot.on('photo', async (msg) => {
        const { photo, chat: { id: chatId }} = msg

        const session = await Session.findOne({ where: { chatId }})
        
        if (session) {
            const action = session.getDataValue('action')
            if (action !== 'photo') return
        }
        console.log(session, photo)
        if (session && photo && photo.length > 0) {
            try {
                const maxQualityImage = photo.pop()
                console.log('maxQualityImage', maxQualityImage)
                if (maxQualityImage) {
                    const file = await bot.getFile(maxQualityImage.file_id)
                    const filePath = `https://api.telegram.org/file/bot${process.env.TELEGRAM_TOKEN}/${file.file_path}`;
                    console.log('filePath', filePath)
                    const imageBuffer = await getImageArrayBuffer(filePath)
                    console.log('buffer', imageBuffer)
                    const formData = new FormData()
                    const blob = new globalThis.Blob([imageBuffer])
                    console.log('blob', blob)
                    formData.append('image', blob)

                    const projectId = session.getDataValue('projectId')

                    // if (typeof projectId !== 'undefined') {
                    //     const ok = await loadTempTechStepImage(chatId, projectId, formData)
                    //     console.log('ok', ok)
                    //     if (ok) {
                    //         await bot.sendMessage(chatId, 'Загрузка файлов по всем технологическим подсказкам завершена')
                    //     } else {
                    //         await bot.sendMessage(chatId, 'Что-то пошло не так при загрузке файла')
                    //     }
                    // } else await bot.sendMessage(chatId, 'Что-то пошло не так при загрузке файла')
                }
            } catch (e) {
                console.log(e)
                bot.sendMessage(chatId, 'Что-то пошло не так при загрузке файла')
            }
        }
    })
}