import type TelegramBot from "node-telegram-bot-api"
import type { CallbackQuery } from "node-telegram-bot-api"
import Session from "../models/Session"

export const handleProjectCallback = async (bot: TelegramBot, msg: CallbackQuery) => {
    const { data } = msg
    const chatId = msg.message?.chat.id

    if (data && chatId) {
        try {
            const { payload } = JSON.parse(data)
            const messageId = msg.message?.message_id
            const session = await Session.findOne({ where: { chatId }})

            if (session) {
                await session.update({ projectName: payload?.name ?? null, projectId: payload?.id ?? null })
                messageId && await bot.deleteMessage(chatId, messageId)
                await bot.sendMessage(chatId, `Проект ${payload?.name} выбран активным`)
                await bot.sendMessage(chatId, 'Список действий с проектом:\n\n/works - получить список работ по данному проекту\n/materials - получить список материалов по данному проекту')
            } 
        } catch {
            bot.sendMessage(chatId, 'Что-то пошло не так при выборе активного проекта')
        }
    }
}