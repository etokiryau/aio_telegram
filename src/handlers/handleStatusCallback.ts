import type TelegramBot from "node-telegram-bot-api"
import type { CallbackQuery } from "node-telegram-bot-api"
import Session from "../models/Session"
import { getWorkStatusChangeOptions } from "../utils/options"
import type { TWorkStatus } from "../interfaces/work.interface"

export const handleStatusCallback = async (bot: TelegramBot, msg: CallbackQuery) => {
    const { data } = msg
    const chatId = msg.message?.chat.id

    if (data && chatId) {
        try {
            const { payload } = JSON.parse(data)
            const messageId = msg.message?.message_id
            // messageId && await bot.deleteMessage(chatId, messageId)
            const buttonsMap: Record<TWorkStatus, string[]> = {
                'notStarted': ['Начать'],
                'started': ['Завершить'],
                'finished': ['Принять', 'Отклонить'],
                'accepted': [],
                'declined': ['Начать'],
            };
        
            const session = await Session.findOne({ where: { chatId }})

            if (session) {
                const currentWork = session.getDataValue('currentWork')

                if (currentWork) {
                    const { status } = currentWork
                    await bot.sendMessage(chatId, 'Изменить статус работы:', getWorkStatusChangeOptions(buttonsMap[status]))
                } else bot.sendMessage(chatId, 'Что-то пошло не так при переходе в статус работы')
            } else bot.sendMessage(chatId, 'Что-то пошло не так при переходе в статус работы')
        } catch (e){
            console.log(e)
            await bot.sendMessage(chatId, 'Что-то пошло не так при переходе в статус работы')
        }
    }
}