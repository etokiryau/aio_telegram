import type TelegramBot from "node-telegram-bot-api"
import { stopProcessOptions } from "./options"
import type{ IModelSession } from "../interfaces/session.interface"

export const checkCurrentAction = async (bot: TelegramBot, session: IModelSession | null, chatId: number) => {

    if (session) {
        const action = session.getDataValue('action')
        if (action !== 'idle') {
            await bot.sendMessage(chatId, 
                'Кажется Вы в процессе ввода данных.\nПопробуйте еще раз ввести корректные данные или можете выйти из процесса, нажав на кнопку ниже', 
                stopProcessOptions
            )
            return true
        } else return false
    } else return false
}
