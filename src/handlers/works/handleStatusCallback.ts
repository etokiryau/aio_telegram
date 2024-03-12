import type TelegramBot from "node-telegram-bot-api"
import type { CallbackQuery } from "node-telegram-bot-api"
import Session from "../../models/Session"
import { getWorkStatusChangeOptions } from "../../utils/options"
import type { TWorkStatus } from "../../interfaces/work.interface"
import { statusMap } from "../../utils/statusMap"

export const handleStatusCallback = async (bot: TelegramBot, msg: CallbackQuery) => {
    const chatId = msg.message?.chat.id

    if (chatId) {
        try {
            // const { payload } = JSON.parse(data)
            const messageId = msg.message?.message_id
            // messageId && await bot.deleteMessage(chatId, messageId)
            const buttonsMap: Record<TWorkStatus, {toStatus: TWorkStatus, title: string}[]> = {
                'notStarted': [{ title: 'Начать', toStatus: 'started'}],
                'started': [{ title: 'Завершить', toStatus: 'finished'}],
                'finished': [{ title: 'Принять', toStatus: 'accepted'}, { title: 'Отклонить', toStatus: 'declined'}],
                'accepted': [],
                'declined': [{ title: 'Начать', toStatus: 'started'}],
            }
        
            const session = await Session.findOne({ where: { chatId }})

            if (session) {
                const currentWork = session.getDataValue('currentWork')
                const userRoles = session.getDataValue('userRoles')

                if (currentWork && userRoles) {
                    const { status } = currentWork
                    const isOwner = userRoles.includes('owner')
                    const isConstructor = userRoles.includes('constructor')

                    if ((status === 'notStarted' || status === 'started') && isConstructor) {
                        return await bot.sendMessage(chatId, `Текущий статус работы - ${statusMap[status].emoji} ${statusMap[status].name}\nИзменить статус:`, getWorkStatusChangeOptions(buttonsMap[status]))
                    }

                    if ((status === 'notStarted' || status === 'started') && !isConstructor) {
                        return await bot.sendMessage(chatId, `Текущий статус работы - ${statusMap[status].emoji} ${statusMap[status].name}\nОжидаем ${status === 'notStarted' ? 'начала' : 'завершения'} работы от строителей`)
                    }

                    if (status === 'finished' && isOwner) {
                        return await bot.sendMessage(chatId, `Текущий статус работы - ${statusMap[status].emoji} ${statusMap[status].name}\nИзменить статус:`, getWorkStatusChangeOptions(buttonsMap[status]))
                    }

                    if (status === 'finished' && !isOwner) {
                        return await bot.sendMessage(chatId, `Текущий статус работы - ${statusMap[status].emoji} ${statusMap[status].name}\nОжидаем решения по выполненной работе`)
                    }

                    if (status === 'accepted') {
                        return await bot.sendMessage(chatId, `Текущий статус работы - ${statusMap[status].emoji} ${statusMap[status].name}`)
                    }

                    if (status === 'declined' && !isConstructor) {
                        return await bot.sendMessage(chatId, `Текущий статус работы - ${statusMap[status].emoji} ${statusMap[status].name}\nОжидаем корректировки замечаний со стороны строителей`)
                    }

                    if (status === 'declined' && isConstructor) {
                        return await bot.sendMessage(chatId, `Текущий статус работы - ${statusMap[status].emoji} ${statusMap[status].name}\nИзменить статус:`, getWorkStatusChangeOptions(buttonsMap[status]))
                    }
                } else bot.sendMessage(chatId, 'Что-то пошло не так при переходе в статус работы')
            } else bot.sendMessage(chatId, 'Что-то пошло не так при переходе в статус работы')
        } catch (e){
            console.log(e)
            await bot.sendMessage(chatId, 'Что-то пошло не так при переходе в статус работы')
        }
    }
}