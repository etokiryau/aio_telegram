import type TelegramBot from "node-telegram-bot-api"
import type { IModelSession } from "../interfaces/session.interface"
import { technologyStepsUploadOptions } from "./options"

export const sendTechnologyStep = async (bot: TelegramBot, chatId: number, session: IModelSession) => {
    const technologySteps = session.getDataValue('technologySteps')
    const currentStep = session.getDataValue('currentStepToLoad')
    console.log('sendTeckStep', technologySteps, currentStep)
    if (technologySteps && typeof currentStep !== 'undefined' && technologySteps[currentStep]) {
        const { templateSrc, description } = technologySteps[currentStep]
        console.log('templateSrc', templateSrc)
        if (templateSrc) {
            try {
                console.log('beforу sending')
                await bot.sendPhoto(chatId, Buffer.from(templateSrc), 
                    { 
                        ...technologyStepsUploadOptions,
                        caption: `Прикрепите фото выполненного шага работы *(${currentStep + 1}/${technologySteps.length})*:\n\n${description}\n\nВо вложении эталонное фото\n\nМожете пропустить загрузку изображения для данного технологического шага или завершить полностью процесс загрузки изображений:`,
                        parse_mode: 'Markdown'
                    }, 
                    { filename: 'step' + currentStep + 1 }
                )
            } catch (e) {
                console.log(e)
                await session.update({ action: 'idle' })
                await bot.sendMessage(chatId, 'Что-то пошло не так при отправке эталонной фотографии выполненной работы')
            } 
        } else {
            await bot.sendMessage(chatId, 
                `Прикрепите фото выполненного шага работы *(${currentStep + 1}/${technologySteps.length})*:\n\n${description}\n\nМожете пропустить загрузку изображения для данного технологического шага или завершить полностью процесс загрузки изображений:`,
                { ...technologyStepsUploadOptions, parse_mode: 'Markdown' }
            )
        }
    } else {
        await session.update({ action: 'idle' })
        await bot.sendMessage(chatId, 'Что-то пошло не так при отправке эталонной фотографии выполненной работы')
    }
}