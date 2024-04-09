import type TelegramBot from "node-telegram-bot-api";
import type { PhotoSize } from "node-telegram-bot-api";
import { getImageArrayBuffer } from "./getImageArrayBuffer";

export const getFormData = async (bot: TelegramBot,photo: PhotoSize[]): Promise<FormData | null> => {
    const maxQualityImage = photo.pop()

    if (maxQualityImage) {
        const file = await bot.getFile(maxQualityImage.file_id)
        const filePath = `https://api.telegram.org/file/bot${process.env.TELEGRAM_TOKEN}/${file.file_path}`;
        // console.log('filePath', filePath)
        const imageBuffer = await getImageArrayBuffer(filePath)
        // console.log('buffer', imageBuffer)
        const formData = new FormData()
        const blob = new globalThis.Blob([imageBuffer])
        // console.log('blob', blob)
        formData.append('image', blob)
        return formData
    } else return null
}