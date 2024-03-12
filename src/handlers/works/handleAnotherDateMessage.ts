import type TelegramBot from "node-telegram-bot-api"
import type { Message } from "node-telegram-bot-api"
import type { IModelSession } from "../../interfaces/session.interface"
import { confirmOptions } from "../../utils/options"

export const handleAnotherDateMessage = async (bot: TelegramBot, session: IModelSession, msg: Message) => {
    const { text, chat: { id: chatId }} = msg
    const dateRegexp = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;

    try {
        if (text) {
            if (!dateRegexp.test(text)) {
                return bot.sendMessage(chatId, 'Введен некорректный формат даты.\nПопробуйте еще раз:')
            } else {
                if (session) {
                    await session.update({ action: 'idle', workDate: text })
                    await bot.sendMessage(chatId, `Подтвердите действие:`, confirmOptions)
                } else await bot.sendMessage(chatId, 'Что-то пошло не так при изменении статуса')
            } await bot.sendMessage(chatId, 'Что-то пошло не так при изменении статуса')
        } else await bot.sendMessage(chatId, 'Что-то пошло не так при изменении статуса')
    } catch {
        await bot.sendMessage(chatId, 'Что-то пошло не так при изменении статуса')
    }
}