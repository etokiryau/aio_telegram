import type TelegramBot from "node-telegram-bot-api"
import type { Message } from "node-telegram-bot-api"
import type { IModelSession } from "../../interfaces/session.interface"
import { declineWork } from "../../utils/api"

export const handleDeclineWorkMessage = async (bot: TelegramBot, session: IModelSession, msg: Message) => {
    const { text, chat: { id: chatId }} = msg
    const currentWork = session.getDataValue('currentWork')

    try {
        if (text && currentWork) {
            const { id, workTitle } = currentWork
            const ok = await declineWork(chatId, id, text)

            if (ok) {
                await bot.sendMessage(chatId, `Статус работы *${workTitle}* изменен на *Отклонено*`, { parse_mode: 'Markdown' })
            } else {
                await bot.sendMessage(chatId, 'Что-то пошло не так при изменении статуса')
            }
            await session.update({ action: 'idle' })
        } else await bot.sendMessage(chatId, 'Что-то пошло не так при изменении статуса')
    } catch {
        await bot.sendMessage(chatId, 'Что-то пошло не так при изменении статуса')
    }
}