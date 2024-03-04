import TelegramBot from "node-telegram-bot-api"
import type { SendMessageOptions, Message, CallbackQuery, ReplyKeyboardMarkup } from "node-telegram-bot-api"
import dotenv from "dotenv"

dotenv.config()

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN ?? '', { polling: true })

const replyOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: '1', callback_data: 'Директор конченный'}, { text: '2', callback_data: 'Директор почти конченный'}, { text: '3', callback_data: 'Директор ужасный'}],
            [{ text: '4', callback_data: 'Директора можно поменять'}, { text: '5', callback_data: 'Директор слабый'}, { text: '6', callback_data: 'Директор сойдет'}],
            [{ text: '7', callback_data: 'Директор нормальный'}, { text: '8', callback_data: 'Директор добрый'}, { text: '9', callback_data: 'Директор лучший'}],
            [{ text: '10', callback_data: 'Директор ахуенный'}],
        ]
    })
}

const getAuthorisationLink = (username: string): SendMessageOptions => {
    return {
        // @ts-ignore
        reply_markup: JSON.stringify({
            keyboard: [
                [{ text: 'Авторизоваться в системе', web_app: { url: `https://aio-ashen.vercel.app/logon?tg_username${username}` }}],
            ]
        })
    }
}

const start = () => {
    bot.setMyCommands([
        { command: '/start', description: 'Авторизоваться' },
        { command: '/works_current', description: 'Получить данные по текущим работам' },
        { command: '/works_planned', description: 'Получить данные по планновым работам' },
        { command: '/materials', description: 'Получить данные по материалам' },
    ])
    
    bot.on('message', async (msg: Message) => {
        const { text, from, chat: { id: chatId, username }} = msg
        console.log(msg)
    
        if (text === '/start') {
            // await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/697/ba1/697ba160-9c77-3b1a-9d97-86a9ce75ff4d/3.webp')
            if (username) {
                await bot.sendMessage(chatId, 'Добро пожаловать в телеграм бот экосистемы АИО')
                return bot.sendMessage(chatId, 'Для дальнейшего использования авторизуйтесь в системе', getAuthorisationLink(username))
            }
        }
    
        if (text === '/info') {
            if (from) {
                return bot.sendMessage(chatId, `Тебя зовут ${from.first_name} ${from.last_name}`)
            }
        }
        
        if (text === '/assessment') {
            await bot.sendMessage(chatId, 'Оцените директора по 10-бальной шкале')
            await bot.sendSticker(chatId, 'https://aio-ashen.vercel.app/_next/image?url=https%3A%2F%2Faio-backend.ru%2Fapi%2FLocalDb%3FPath%3DTechSteps%2F948%2F2023-07-16%2020.23.53.jpg&w=1920&q=75')
            // return bot.sendMessage(chatId, 'Выберите ниже оценку', replyOptions)
        }
        
        return bot.sendMessage(chatId, 'Я еще не научился отвечать на такие запросы. :(')
    })

    bot.on('callback_query', (msg: CallbackQuery) => {
        const { data } = msg
        const chatId = msg.message?.chat.id
        if (data && chatId) {
            bot.sendMessage(chatId, `Ваша оценка директора: ${data}`)
        }
    })
}

start()