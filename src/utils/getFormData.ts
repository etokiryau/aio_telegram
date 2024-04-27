import type TelegramBot from "node-telegram-bot-api";
import { getImageArrayBuffer } from "./getImageArrayBuffer";

export const getFormData = async (bot: TelegramBot, photos: string[]): Promise<FormData> => {
    const formData = new FormData()

    for (const photo of photos) {
        const file = await bot.getFile(photo)
        const filePath = `https://api.telegram.org/file/bot${process.env.TELEGRAM_TOKEN}/${file.file_path}`;
        const imageBuffer = await getImageArrayBuffer(filePath)
        const blob = new globalThis.Blob([imageBuffer])
        formData.append('image', blob)
    }

    return formData
}