import type TelegramBot from "node-telegram-bot-api"
import { handleStopProcessCallback } from "../handlers/handleStopProcessCallback"
import { handleProjectCallback } from "../handlers/handleProjectCallback"
import { handleLogoutCallback } from "../handlers/handleLogoutCallback"
import { handleAuthCallback } from "../handlers/handleAuthCallback"
import { handleMaterialsCallback } from "../handlers/handleMaterialsCallback"
import { handleWorksCallback } from "../handlers/handleWorksCallback"
import { handleWorkOverviewCallback } from "../handlers/handleWorkOverviewCallback"
import { handleCommentCallback } from "../handlers/handleCommentCallback"
import { handleStatusCallback } from "../handlers/handleStatusCallback"

export const onCallbackQuery = (bot: TelegramBot) => {
    bot.on('callback_query', async (msg) => {
        const { data } = msg
        const chatId = msg.message?.chat.id

        if (data && chatId) {
            const { action } = JSON.parse(data)

            if (action === 'materials') handleMaterialsCallback(bot, msg)

            if (action === 'works') handleWorksCallback(bot, msg)

            if (action === 'workOverview') handleWorkOverviewCallback(bot, msg)

            if (action === 'status') handleStatusCallback(bot, msg)

            if (action === 'comment') handleCommentCallback(bot, msg)

            if (action === 'stopProcess') handleStopProcessCallback(bot, msg)

            if (action === 'project') handleProjectCallback(bot, msg)

            if (action === 'auth') handleAuthCallback(bot, msg)
    
            if (action === 'logout') handleLogoutCallback(bot, msg)
        }
    })
}