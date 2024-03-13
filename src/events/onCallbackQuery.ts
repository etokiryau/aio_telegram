import type TelegramBot from "node-telegram-bot-api"
import { handleStopProcessCallback } from "../handlers/common/handleStopProcessCallback"
import { handleProjectCallback } from "../handlers/common/handleProjectCallback"
import { handleLogoutCallback } from "../handlers/auth/handleLogoutCallback"
import { handleAuthCallback } from "../handlers/auth/handleAuthCallback"
import { handleMaterialsCallback } from "../handlers/handleMaterialsCallback"
import { handleWorksCallback } from "../handlers/works/handleWorksCallback"
import { handleWorkOverviewCallback } from "../handlers/works/handleWorkOverviewCallback"
import { handleCommentCallback } from "../handlers/works/handleCommentCallback"
import { handleStatusCallback } from "../handlers/works/handleStatusCallback"
import { handleStatusChangeCallback } from "../handlers/works/handleStatusChangeCallback"
import { handleAnotherDateCallback } from "../handlers/works/handleAnotherDateCallback"
import { handleCurrentDateCallback } from "../handlers/works/handleCurrentDateCallback"
import { handleStatusConfirmCallback } from "../handlers/works/handleStatusConfirmCallback"
import { handleNextTechStepCallback } from "../handlers/works/handleNextTechStepCallback"

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

            if (action === 'statusChange') handleStatusChangeCallback(bot, msg)

            if (action === 'date_current') handleCurrentDateCallback(bot, msg)

            if (action === 'date_another') handleAnotherDateCallback(bot, msg)

            if (action === 'confirm') handleStatusConfirmCallback(bot, msg)

            if (action === 'teckStep_next') handleNextTechStepCallback(bot, msg)

            if (action === 'comment') handleCommentCallback(bot, msg)

            if (action === 'stopProcess') handleStopProcessCallback(bot, msg)

            if (action === 'project') handleProjectCallback(bot, msg)

            if (action === 'auth') handleAuthCallback(bot, msg)
    
            if (action === 'logout') handleLogoutCallback(bot, msg)
        }
    })
}