import type TelegramBot from "node-telegram-bot-api"
import type { CallbackQuery } from "node-telegram-bot-api"
import Session from "../../models/Session"
import { getMaterials } from "../../utils/api"
import { addMessagesToDelete } from "../../utils/addMessagesToDelete"

export const handleMaterialsCallback = async (bot: TelegramBot, msg: CallbackQuery) => {
    const { data } = msg
    const chatId = msg.message?.chat.id

    const unitsMap: Record<string, string> = {
        'pcs': 'шт',
        'm': 'м'
    }

    if (data && chatId) {
        try {
            const { payload } = JSON.parse(data)
            const messageId = msg.message?.message_id
            const session = await Session.findOne({ where: { chatId }})

            if (session) {
                const projectId = session.getDataValue('projectId')
                const mesIds: number[] = []

                if (projectId) {
                    const resp = await getMaterials(chatId, projectId, payload)

                    if (resp.ok) {
                        messageId && await bot.deleteMessage(chatId, messageId)
                        const materials = resp.data

                        if (materials.length > 0) {
                            const response = materials.reduce((sum, material) => {
                                return sum += `|${material.name}|${material.value} ${unitsMap[material.units] + (material.dimension === 1 ? '' : material.dimension)}|\n\n`
                            }, '')
    
                            await bot.sendMessage(chatId, `Список материалов на следующий(-ие) ${payload} день(-ня):\n\n<pre language="copy">${response}</pre>`, { parse_mode: 'HTML' })
                            .then(msg => mesIds.push(msg.message_id))
                        } else  {
                            await bot.sendMessage(chatId, `Список материалов пустой на следующий(-ие) ${payload} день(-ня)`)
                            .then(msg => mesIds.push(msg.message_id))
                        }
                    } else bot.sendMessage(chatId, 'Что-то пошло не так при получении списка материалов')
                    addMessagesToDelete(session, mesIds)
                } else bot.sendMessage(chatId, 'Что-то пошло не так при получении списка материалов')
            }  else bot.sendMessage(chatId, 'Что-то пошло не так при получении списка материалов')
        } catch {
            bot.sendMessage(chatId, 'Что-то пошло не так при получении списка материалов')
        }
    }
}