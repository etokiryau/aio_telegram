import type TelegramBot from "node-telegram-bot-api"
import type { CallbackQuery } from "node-telegram-bot-api"
import Session from "../../models/Session"
import { getWorkOptions } from "../../utils/options"
import type { TWorkStatus } from "../../interfaces/work.interface"

export const handleWorkOptionsCallback = async (bot: TelegramBot, msg: CallbackQuery) => {
    const { data } = msg
    const chatId = msg.message?.chat.id
    const messageId = msg.message?.message_id

    if (data && chatId) {
        try {
            const { payload: order } = JSON.parse(data)
            const session = await Session.findOne({ where: { chatId }})

            messageId && await bot.deleteMessage(chatId, messageId)

            if (session) {
                const worksList = session.getDataValue('worksList')
                const userRoles = session.getDataValue('userRoles')

                const buttonsMap: Record<TWorkStatus, {toStatus: TWorkStatus, title: string}[]> = {
                    'notStarted': [{ title: 'Начать', toStatus: 'started'}],
                    'started': [{ title: 'Завершить', toStatus: 'finished'}],
                    'finished': [{ title: 'Принять', toStatus: 'accepted'}, { title: 'Отклонить', toStatus: 'declined'}],
                    'accepted': [],
                    'declined': [{ title: 'Начать', toStatus: 'started'}],
                }

                if (worksList && userRoles) {
                    const { name, status, id, workTitle } = worksList[order]
                    const isOwner = userRoles.includes('owner')
                    const isConstructor = userRoles.includes('constructor')

                    await session.update({ currentWork: { id, status, workTitle }})

                    if ((status === 'notStarted' || status === 'started') && isConstructor) {
                        return await bot.sendMessage(chatId, `${name}Возможные действия с работой:`, getWorkOptions(id, buttonsMap[status]))
                    }

                    if ((status === 'notStarted' || status === 'started') && !isConstructor) {
                        return await bot.sendMessage(chatId, `${name}\n\nВозможные действия с работой:`, getWorkOptions(id))
                    }

                    if (status === 'finished' && isOwner) {
                        return await bot.sendMessage(chatId, `${name}\n\nВозможные действия с работой:`, getWorkOptions(id, buttonsMap[status]))
                    }

                    if (status === 'finished' && !isOwner) {
                        return await bot.sendMessage(chatId, `${name}\n\nВозможные действия с работой:`, getWorkOptions(id))
                    }

                    if (status === 'accepted') {
                        return await bot.sendMessage(chatId, `${name}\n\nВозможные действия с работой:`, getWorkOptions(id))
                    }

                    if (status === 'declined' && !isConstructor) {
                        return await bot.sendMessage(chatId, `${name}\n\nВозможные действия с работой:`, getWorkOptions(id))
                    }

                    if (status === 'declined' && isConstructor) {
                        return await bot.sendMessage(chatId, `${name}\n\nВозможные действия с работой:`, getWorkOptions(id, buttonsMap[status]))
                    }
                } else bot.sendMessage(chatId, 'Что-то пошло не так при переходе в статус работы')                
            }  else bot.sendMessage(chatId, 'Что-то пошло не так при получении данных по работе')
        } catch (e) {
            console.log(e)
            bot.sendMessage(chatId, 'Что-то пошло не так при получении данных по работе')
        }
    }
}