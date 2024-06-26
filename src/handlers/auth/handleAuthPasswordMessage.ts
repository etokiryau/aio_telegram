import type TelegramBot from "node-telegram-bot-api"
import type { Message } from "node-telegram-bot-api"
import type { IModelSession } from "../../interfaces/session.interface"

import { getProjectOptions, homeOptions, logonAgainOptions } from "../../utils/options"
import { getProjects, getUserRoles, handleLogin } from "../../utils/api"

export const handleAuthPasswordMessage = async (bot: TelegramBot, session: IModelSession, msg: Message) => {
    const { text, chat: { id: chatId }} = msg
    const mes1 = await bot.sendMessage(chatId, 'Идет проверка данных...')
    const email = session.getDataValue('email')

    if (email && text) {
        const data = { email, password: text, chatId }
        const respLogin = await handleLogin(data)

        await bot.deleteMessage(chatId, mes1.message_id)

        if (respLogin.ok) {
            const token = respLogin.data
            await session.update({ action: 'idle' })
            await bot.sendMessage(chatId, 'Вы авторизованы в системе')

            const respProjects = await getProjects(token)

            if (respProjects.ok) {
                const projects = respProjects.data

                if (projects.length > 1) {
                    await bot.sendMessage(chatId, 'Выберите проект, с которым хотите работать:', getProjectOptions(projects))
                } else {
                    const resp = await getUserRoles(chatId, projects[0]?.id)

                    if (resp.ok) {
                        await session.update({ projectName: projects[0]?.name , projectId: projects[0]?.id, userRoles: resp.data })
                        await bot.sendMessage(chatId, `Ваш активный проект - *${projects[0]?.name}*`, { parse_mode: 'Markdown' })
                        await bot.sendMessage(chatId, 'Список действий с проектом:', homeOptions)
                    }
                }
            } else {
                await bot.sendMessage(chatId, 'Произошла ошибка при получении проектов. Попробуйте еще раз')
            }
        } else {
            await session.destroy()
            await bot.sendMessage(chatId, 'Произошла ошибка во время авторизации. Попробуйте еще раз', logonAgainOptions)
        }
    }
}