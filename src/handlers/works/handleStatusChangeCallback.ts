import type TelegramBot from "node-telegram-bot-api"
import type { CallbackQuery } from "node-telegram-bot-api"
import Session from "../../models/Session"
import { confirmOptions, statusDatesOptions } from "../../utils/options"
import { deleteMessagesToDelete } from "../../utils/deleteMessagesToDelete"

export const handleStatusChangeCallback = async (bot: TelegramBot, msg: CallbackQuery) => {
    const chatId = msg.message?.chat.id

    if (chatId) {
        try {
            const session = await Session.findOne({ where: { chatId }})

            if (session) {
                const currentWork = session.getDataValue('currentWork')

                if (currentWork) {
                    const { status } = currentWork
                    deleteMessagesToDelete(bot, session, chatId)
                    
                    if (status === 'notStarted' || status === 'started') {
                        await bot.sendMessage(chatId, `Выберите дату ${status === 'started' ? 'завершения' : 'начала'} работы:`, statusDatesOptions)
                    } else {
                        await bot.sendMessage(chatId, `Подтвердите действие:`, confirmOptions)
                    }
                } else bot.sendMessage(chatId, 'Что-то пошло не так при переходе в статус работы')
            } else bot.sendMessage(chatId, 'Что-то пошло не так при переходе в статус работы')
        } catch (e) {
            console.log(e)
            await bot.sendMessage(chatId, 'Что-то пошло не так при переходе в статус работы')
        }
    }
}