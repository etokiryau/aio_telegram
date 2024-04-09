import type TelegramBot from "node-telegram-bot-api"
import Session from "../models/Session"
import { loadTempTechStepImage } from "../utils/api"
import { getFormData } from "../utils/getFormData"

export const onPhoto = (bot: TelegramBot) => {
    bot.on('photo', async (msg) => {
        const { photo, chat: { id: chatId }} = msg
        // console.log(msg)
        const session = await Session.findOne({ where: { chatId }})
        
        if (session) {
            const action = session.getDataValue('action')

            if (action === 'photo' && photo && photo.length > 0) {
                try {
                    const formData = await getFormData(bot, photo)
    
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
                
                } catch (e) {
                    console.log(e)
                    bot.sendMessage(chatId, 'Что-то пошло не так при загрузке файла')
                }
            }
        }
    })
}