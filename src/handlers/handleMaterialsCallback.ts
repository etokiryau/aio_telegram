import type TelegramBot from "node-telegram-bot-api"
import type { CallbackQuery } from "node-telegram-bot-api"
import Session from "../models/Session"
import { getMaterials } from "../utils/api"

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

                if (projectId) {
                    const resp = await getMaterials(chatId, projectId)

                    if (resp.ok) {
                        messageId && await bot.deleteMessage(chatId, messageId)
                        const materials = resp.data

                        if (materials.length > 0) {
                            const response = materials.reduce((sum, material) => {
                                return sum += `|${material.description}|${material.inProject.value} ${unitsMap[material.units] + (material.dimension === 1 ? '' : material.dimension)}|\n\n`
                            }, '')
    
                            await bot.sendMessage(chatId, `Список материалов на следующий(-ие) ${payload} день(-ня):\n\n<pre language="copy">${response}</pre>`, { parse_mode: 'HTML' })
                        } else  {
                            await bot.sendMessage(chatId, `Список материалов пустой на следующий(-ие) ${payload} день(-ня)`)
                        }
                        
                    } else bot.sendMessage(chatId, 'Что-то пошло не так при получении списка материалов')
                } else bot.sendMessage(chatId, 'Что-то пошло не так при получении списка материалов')
            }  else bot.sendMessage(chatId, 'Что-то пошло не так при получении списка материалов')
        } catch {
            bot.sendMessage(chatId, 'Что-то пошло не так при получении списка материалов')
        }
    }
}