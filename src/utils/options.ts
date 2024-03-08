import type { InlineKeyboardButton, SendMessageOptions } from "node-telegram-bot-api"
import type { IProject } from "../interfaces/project.interface"
import type { IWork, TWorkStatus } from "../interfaces/work.interface"

export const logonOptions: SendMessageOptions = {
    reply_markup: { 
        inline_keyboard: [[{ text: 'Авторизоваться', callback_data: JSON.stringify({ action: 'auth' }) }]] 
    }
}

export const logonAgainOptions: SendMessageOptions = {
    reply_markup: { 
        inline_keyboard: [[{ text: 'Повторить авторизацию', callback_data: JSON.stringify({ action: 'auth' }) }]] 
    }
}

export const logoutOptions: SendMessageOptions = {
    reply_markup: { 
        inline_keyboard: [[{ text: 'Выйти из аккаунта', callback_data: JSON.stringify({ action: 'logout' }) }]] 
    }
}

export const worksPeriodOptions: SendMessageOptions = {
    reply_markup: { 
        inline_keyboard: [
            [{ text: 'Текущие', callback_data: JSON.stringify({ action: 'works', payload: 1 }) }],
            [{ text: 'Ближайший 1 день', callback_data: JSON.stringify({ action: 'works', payload: 1 }) }],
            [{ text: 'Ближайшие 3 дня', callback_data: JSON.stringify({ action: 'works', payload: 3 }) }],
            [{ text: 'Ближайшие 7 дней', callback_data: JSON.stringify({ action: 'works', payload: 7 }) }],
            [{ text: 'Ближайшие 1 месяц', callback_data: JSON.stringify({ action: 'works', payload: 30 }) }],
            [{ text: 'Назад', callback_data: JSON.stringify({ action: 'back' }) }],
        ] 
    }
}

export const getWorksOptions = (works: IWork[]): SendMessageOptions => {
    const worksKeyboard: InlineKeyboardButton[][] = []
    const devision = Math.ceil(works.length / 5)
    works.forEach((work, i) => {
        if (i === 0 || i % devision === 0) { worksKeyboard.push([]) }
        worksKeyboard[Math.floor(i / devision)].push({ text: String(i + 1), callback_data: JSON.stringify({ action: 'workOverview', payload: { id: work.id, order: i } }) })
    });
    
    return { 
        reply_markup: { inline_keyboard: worksKeyboard },
        parse_mode: "HTML"
    }
}

export const getWorkChangeOptions = (id: number): SendMessageOptions => {
    return {
        reply_markup: { 
            inline_keyboard: [
                [{ text: 'Статус', callback_data: JSON.stringify({ action: 'status', payload: id }) }],
                [{ text: 'Изменить даты?', callback_data: JSON.stringify({ action: 'dates', payload: id }) }],
                [{ text: 'Комментарий', callback_data: JSON.stringify({ action: 'comment', payload: id }) }],
                [{ text: 'Назад', callback_data: JSON.stringify({ action: 'back', payload: 30 }) }, { text: 'Главная', callback_data: JSON.stringify({ action: 'home' }) }]
            ] 
        }
    }
}

export const getWorkStatusChangeOptions = (buttons: string[]): SendMessageOptions => {
    const keyboard: InlineKeyboardButton[] = buttons.map(button => {
        return { text: button, callback_data: JSON.stringify({ action: 'statusChange' }) }
    })

    return {
        reply_markup: { 
            inline_keyboard: [
                keyboard,
                [{ text: 'Назад', callback_data: JSON.stringify({ action: 'back' }) }, { text: 'Главная', callback_data: JSON.stringify({ action: 'home' }) }]
            ] 
        }
    }
}

export const materialsPeriodOptions: SendMessageOptions = {
    reply_markup: { 
        inline_keyboard: [
            [{ text: 'Ближайший 1 день', callback_data: JSON.stringify({ action: 'materials', payload: 1 }) }],
            [{ text: 'Ближайшие 3 дня', callback_data: JSON.stringify({ action: 'materials', payload: 3 }) }],
            [{ text: 'Ближайшие 7 дней', callback_data: JSON.stringify({ action: 'materials', payload: 7 }) }],
            [{ text: 'Ближайшие 1 месяц', callback_data: JSON.stringify({ action: 'materials', payload: 30 }) }],
            [{ text: 'Назад', callback_data: JSON.stringify({ action: 'back' }) }],
        ] 
    }
}

export const getProjectOptions = (projects: IProject[]) => {
    const keyboardContent = projects.map((project) => {
        return [{ text: project.name, callback_data: JSON.stringify({ action: 'project', payload: { id: project.id, name: project.name } }) }]
    });

    return { reply_markup: { 
        inline_keyboard: keyboardContent
    }}
}

export const stopProcessOptions: SendMessageOptions = {
    reply_markup: { 
        inline_keyboard: [
            [{ text: 'Завершить процесс', callback_data: JSON.stringify({ action: 'stopProcess' }) }],
        ] 
    }
}