import type TelegramBot from "node-telegram-bot-api"
import { Blob } from "buffer"
import Session from "../models/Session"
import { getImageArrayBuffer } from "../utils/getImageArrayBuffer"
import { loadTempTechStepImage } from "../utils/api"
import { sendTechnologyStep } from "../utils/sendTechnologyStep"

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
                    const blob = new Blob([imageBuffer])
                    console.log('blob', blob)
                    // @ts-ignore
                    formData.append('image', blob, { filename: file.file_path })

                    const projectId = session.getDataValue('projectId')
                    const currentStep = session.getDataValue('currentStepToLoad')
                    const technologySteps = session.getDataValue('technologySteps')

                    if (typeof projectId !== 'undefined' && typeof currentStep !== 'undefined' && technologySteps && technologySteps[currentStep]) {
                        const ok = await loadTempTechStepImage(chatId, projectId, technologySteps[currentStep].id, formData)
                        console.log('ok', ok)
                        if (ok) {
                            if (currentStep === (technologySteps.length - 1)) {
                                await session.update({ action: 'idle', currentStepToLoad: 0 })
                                await bot.sendMessage(chatId, 'Загрузка файлов по всем технологическим подсказкам завершена')
                            } else {
                                await session.update({ currentStepToLoad: currentStep + 1 })
                                await sendTechnologyStep(bot, chatId, session)
                            }
                        } else {
                            await bot.sendMessage(chatId, 'Что-то пошло не так при загрузке файла')
                        }
                    } else await bot.sendMessage(chatId, 'Что-то пошло не так при загрузке файла')
                }
            } catch (e) {
                console.log(e)
                bot.sendMessage(chatId, 'Что-то пошло не так при загрузке файла')
            }
        }
    })
}