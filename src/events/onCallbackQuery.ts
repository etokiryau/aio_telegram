import type TelegramBot from "node-telegram-bot-api"
import { handleStopProcessCallback } from "../handlers/common/handleStopProcessCallback"
import { handleProjectCallback } from "../handlers/common/handleProjectCallback"
import { handleLogoutCallback } from "../handlers/auth/handleLogoutCallback"
import { handleAuthCallback } from "../handlers/auth/handleAuthCallback"
import { handleMaterialsCallback } from "../handlers/materials/handleMaterialsCallback"
import { handleWorksCallback } from "../handlers/works/handleWorksCallback"
import { handleWorkOptionsCallback } from "../handlers/works/handleWorkOptionsCallback"
import { handleCommentCallback } from "../handlers/works/handleCommentCallback"
import { handleStatusChangeCallback } from "../handlers/works/handleStatusChangeCallback"
import { handleAnotherDateCallback } from "../handlers/works/handleAnotherDateCallback"
import { handleCurrentDateCallback } from "../handlers/works/handleCurrentDateCallback"
import { handleStatusConfirmCallback } from "../handlers/works/handleStatusConfirmCallback"
import { handleHomeCallback } from "../handlers/common/handleHomeCallback"
import { handleTechnologyCallback } from "../handlers/works/handleTechnologyCallback"
import { handleMaterialPeriodsCallback } from "../handlers/materials/handleMaterialPeriodsCallback"
import { handleWorkPeriodsCallback } from "../handlers/works/handleWorkPeriodsCallback"
import { handleCancelCallback } from "../handlers/common/handleCancelCallback"
import { handleDeclineWorkCallback } from "../handlers/works/handleDeclineWorkCallback"
import { handleSendWorkPhotosCallback } from "../handlers/works/handleSendWorkPhotosCallback"
import { handleSendCommentPhotosCallback } from "../handlers/works/handleSendCommentPhotosCallback"

export const onCallbackQuery = (bot: TelegramBot) => {
    bot.on('callback_query', async (msg) => {
        const { data } = msg
        const chatId = msg.message?.chat.id

        if (data && chatId) {
            const { action } = JSON.parse(data)

            if (action === 'home') handleHomeCallback(bot, msg)

            if (action === 'materials_periods') handleMaterialPeriodsCallback(bot, msg)

            if (action === 'materials') handleMaterialsCallback(bot, msg)

            if (action === 'works_periods') handleWorkPeriodsCallback(bot, msg)

            if (action === 'works') handleWorksCallback(bot, msg)

            if (action === 'work') handleWorkOptionsCallback(bot, msg)

            if (action === 'work_photos') handleSendWorkPhotosCallback(bot, msg)

            if (action === 'statusChange') handleStatusChangeCallback(bot, msg)

            if (action === 'work_decline') handleDeclineWorkCallback(bot, msg)

            if (action === 'date_current') handleCurrentDateCallback(bot, msg)

            if (action === 'date_another') handleAnotherDateCallback(bot, msg)

            if (action === 'confirm') handleStatusConfirmCallback(bot, msg)

            if (action === 'cancel') handleCancelCallback(bot, msg)

            if (action === 'technology') handleTechnologyCallback(bot, msg)

            if (action === 'comment') handleCommentCallback(bot, msg)

            if (action === 'comment_photos') handleSendCommentPhotosCallback(bot, msg)

            if (action === 'stopProcess') handleStopProcessCallback(bot, msg)

            if (action === 'project') handleProjectCallback(bot, msg)

            if (action === 'auth') handleAuthCallback(bot, msg)
    
            if (action === 'logout') handleLogoutCallback(bot, msg)
        }
    })
}