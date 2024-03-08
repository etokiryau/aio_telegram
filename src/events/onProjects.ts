import type TelegramBot from "node-telegram-bot-api"
import { getProjectOptions, logonOptions } from "../utils/options"
import User from "../models/User"
import Session from "../models/Session"
import { getProjects } from "../utils/api"
import { checkCurrentAction } from "../utils/checkCurrentAction"

export const onProjects = (bot: TelegramBot) => {
    bot.onText(/\/projects/, async (msg) => {
        const { chat: { id: chatId }} = msg

        try {
            const session = await Session.findOne({ where: { chatId }})

            if (await checkCurrentAction(bot, session, chatId)) return
            
            const user = await User.findOne({ where: { chatId }})
            
            if (user && session) {
                const token = user.getDataValue('token')
                const resp = await getProjects(token)

                if (resp.ok) {
                    const projects = resp.data
                    if (projects.length > 1) {
                        const currentProject = session.getDataValue('projectName')
                        currentProject && await bot.sendMessage(chatId, `Активный проект - ${currentProject}`)
                        const filteredProjects = projects.filter((project => project.name !== currentProject))
                        await bot.sendMessage(chatId, 'Выберите проект, с которым хотите работать', getProjectOptions(filteredProjects))
                    } else {
                        await bot.sendMessage(chatId, `Портфель проектов состоит из одного - ${projects[0]?.name}`)
                    }
                }
            } else {
                return bot.sendMessage(
                    chatId, 
                    'Вы еще не авторизованы в системе',
                    logonOptions
                )
            }
        } catch(error) {
            console.error('Error:', error);
            bot.sendMessage(chatId, 'Что-то пошло не так при получении списка проектов')
        }
    })
}