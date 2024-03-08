import type TelegramBot from "node-telegram-bot-api"

export const setChatSettings = (bot: TelegramBot) => {
    bot.setMyCommands([
        { command: '/start', description: 'Авторизоваться' },
        { command: '/projects', description: 'Выбрать проект' },
        { command: '/works', description: 'Получить данные по работам' },
        { command: '/materials', description: 'Получить данные по материалам' },
        { command: '/stop', description: 'Выйти из системы' },
    ])
}