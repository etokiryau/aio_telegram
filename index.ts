import TelegramBot from "node-telegram-bot-api"
import dotenv from "dotenv"

import { initialiseDb } from "./src/initialiseDb"
import { onStart } from "./src/events/onStart"
import { onStop } from "./src/events/onStop"
import { setChatSettings } from "./src/utils/setChatSettings"
import { onMessage } from "./src/events/onMessage"
import { onCallbackQuery } from "./src/events/onCallbackQuery"
import { onWorks } from "./src/events/onWorks"
import { onMaterials } from "./src/events/onMaterials"
import { onProjects } from "./src/events/onProjects"
import { onPhoto } from "./src/events/onPhoto"

dotenv.config()

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN ?? '', { polling: true })

const start = async () => {
    await initialiseDb()

    setChatSettings(bot)

    onStart(bot)
    onStop(bot)
    onProjects(bot)
    onWorks(bot)
    onMaterials(bot)

    onMessage(bot)
    onCallbackQuery(bot)
    onPhoto(bot)
}

start()