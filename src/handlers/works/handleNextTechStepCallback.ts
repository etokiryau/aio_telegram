import type TelegramBot from "node-telegram-bot-api"
import type { CallbackQuery } from "node-telegram-bot-api"
import Session from "../../models/Session"
import { sendTechnologyStep } from "../../utils/sendTechnologyStep"

export const handleNextTechStepCallback = async (bot: TelegramBot, msg: CallbackQuery) => {
    const chatId = msg.message?.chat.id

    if (chatId) {
        try {
            const messageId = msg.message?.message_id
            messageId && await bot.editMessageReplyMarkup({ inline_keyboard: [] }, {
                chat_id: chatId,
                message_id: messageId
            })
        
            const session = await Session.findOne({ where: { chatId }})

            if (session) {
                const technologySteps = session.getDataValue('technologySteps')
                const currentStep = session.getDataValue('currentStepToLoad')

                if (technologySteps && typeof currentStep !== 'undefined') {
                    if (currentStep === (technologySteps.length - 1)) {
                        await session.update({ action: 'idle', currentStepToLoad: 0 })
                        await bot.sendMessage(chatId, 'Загрузка файлов по всем технологическим подсказкам завершена')
                    } else {
                        await session.update({ currentStepToLoad: currentStep + 1 })
                        await sendTechnologyStep(bot, chatId, session)
                    }
                } else await bot.sendMessage(chatId, 'Что-то пошло не так при отправке эталонной фотографии выполненной работы')
            } else await bot.sendMessage(chatId, 'Что-то пошло не так при отправке эталонной фотографии выполненной работы')
        } catch {
            await bot.sendMessage(chatId, 'Что-то пошло не так при отправке эталонной фотографии выполненной работы')
        }
    }
}