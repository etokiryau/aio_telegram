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

export const homeOptions: SendMessageOptions = {
    reply_markup: { 
        inline_keyboard: [[{ text: 'Работы', callback_data: JSON.stringify({ action: 'works_periods' }) }, { text: 'Материалы', callback_data: JSON.stringify({ action: 'materials_periods' }) }]] 
    }
}

export const getProjectOptions = (projects: IProject[]) => {
    const keyboardContent = projects.map((project) => {
        return [{ text: project.name, callback_data: JSON.stringify({ action: 'project', payload: { id: project.id, name: project.name } }) }]
    })

    return { reply_markup: { 
        inline_keyboard: keyboardContent
    }}
}

export const worksPeriodOptions: SendMessageOptions = {
    reply_markup: { 
        inline_keyboard: [
            // [{ text: 'Текущие', callback_data: JSON.stringify({ action: 'works', payload: 1 }) }],
            [{ text: 'Ближайший 1 день', callback_data: JSON.stringify({ action: 'works', payload: 1 }) }],
            [{ text: 'Ближайшие 3 дня', callback_data: JSON.stringify({ action: 'works', payload: 3 }) }],
            [{ text: 'Ближайшие 7 дней', callback_data: JSON.stringify({ action: 'works', payload: 7 }) }],
            [{ text: 'Ближайший 1 месяц', callback_data: JSON.stringify({ action: 'works', payload: 30 }) }],
            [{ text: 'Назад', callback_data: JSON.stringify({ action: 'home' }) }],
        ] 
    }
}

export const getWorksOptions = (works: IWork[]): SendMessageOptions => {
    const worksKeyboard: InlineKeyboardButton[][] = []
    const devision = Math.ceil(works.length / 5)
    works.forEach((_, i) => {
        if (i === 0 || i % devision === 0) { worksKeyboard.push([]) }
        worksKeyboard[Math.floor(i / devision)].push({ text: String(i + 1), callback_data: JSON.stringify({ action: 'work', payload: i }) })
    });
    
    return { 
        reply_markup: { inline_keyboard: [...worksKeyboard,
            [{ text: 'Назад', callback_data: JSON.stringify({ action: 'works_periods' }) }, { text: 'Главная', callback_data: JSON.stringify({ action: 'home' }) }]] 
        },
        parse_mode: "HTML"
    }
}

export const getWorkOptions = (id: number, buttons?: {toStatus: TWorkStatus, title: string}[]): SendMessageOptions => {
    const keyboard: InlineKeyboardButton[] = buttons?.map(button => {
        return { text: button.title, callback_data: JSON.stringify({ action: button.toStatus === 'declined' ? 'declineWork' : 'statusChange' }) }
    }) ?? []

    return {
        reply_markup: { 
            inline_keyboard: [
                keyboard,
                [{ text: 'Комментировать', callback_data: JSON.stringify({ action: 'comment', payload: id }) }],
                [{ text: 'Технология производства', callback_data: JSON.stringify({ action: 'technology', payload: id }) }],
                [{ text: 'Назад', callback_data: JSON.stringify({ action: 'works' }) }, { text: 'Главная', callback_data: JSON.stringify({ action: 'home' }) }]
            ] 
        }
    }
}

export const getWorkStatusChangeOptions = (buttons: {toStatus: TWorkStatus, title: string}[]): SendMessageOptions => {
    const keyboard: InlineKeyboardButton[] = buttons.map(button => {
        return { text: button.title, callback_data: JSON.stringify({ action: button.toStatus === 'declined' ? 'declineWork' : 'statusChange' }) }
    })

    return {
        reply_markup: { 
            inline_keyboard: [
                keyboard,
                [{ text: 'Назад', callback_data: JSON.stringify({ action: 'cancel' }) }, { text: 'Главная', callback_data: JSON.stringify({ action: 'home' }) }]
            ] 
        }
    }
}

export const statusDatesOptions: SendMessageOptions = {
    reply_markup: { 
        inline_keyboard: [
            [{ text: 'Текущая дата', callback_data: JSON.stringify({ action: 'date_current' }) }],
            [{ text: 'Другая дата', callback_data: JSON.stringify({ action: 'date_another' }) }],
            [{ text: 'Назад', callback_data: JSON.stringify({ action: 'cancel' }) }, { text: 'Главная', callback_data: JSON.stringify({ action: 'home' }) }]
        ] 
    }
}

export const confirmOptions: SendMessageOptions = {
    reply_markup: { 
        inline_keyboard: [
            [{ text: 'Подтвердить', callback_data: JSON.stringify({ action: 'confirm' }) }, { text: 'Отменить', callback_data: JSON.stringify({ action: 'cancel' }) }]
        ] 
    }
}

export const commentBackOptions: SendMessageOptions = {
    reply_markup: { 
        inline_keyboard: [
            [{ text: 'Завершить процесс', callback_data: JSON.stringify({ action: 'stopProcess' }) }],
            [{ text: 'Назад', callback_data: JSON.stringify({ action: 'cancel' }) }]
        ] 
    }
}

export const materialsPeriodOptions: SendMessageOptions = {
    reply_markup: { 
        inline_keyboard: [
            [{ text: 'Ближайший 1 день', callback_data: JSON.stringify({ action: 'materials', payload: 1 }) }],
            [{ text: 'Ближайшие 3 дня', callback_data: JSON.stringify({ action: 'materials', payload: 3 }) }],
            [{ text: 'Ближайшие 7 дней', callback_data: JSON.stringify({ action: 'materials', payload: 7 }) }],
            [{ text: 'Ближайший 1 месяц', callback_data: JSON.stringify({ action: 'materials', payload: 30 }) }],
            [{ text: 'Назад', callback_data: JSON.stringify({ action: 'home' }) }],
        ] 
    }
}

export const stopProcessOptions: SendMessageOptions = {
    reply_markup: { 
        inline_keyboard: [
            [{ text: 'Завершить процесс', callback_data: JSON.stringify({ action: 'stopProcess' }) }],
        ] 
    }
}

export const workPhotosOptions: SendMessageOptions = {
    reply_markup: { 
        inline_keyboard: [
            [{ text: 'Отправить', callback_data: JSON.stringify({ action: 'work_photos' }) }, { text: 'Завершить процесс', callback_data: JSON.stringify({ action: 'stopProcess' }) }],
        ] 
    }
}

export const commentPhotosOptions: SendMessageOptions = {
    reply_markup: { 
        inline_keyboard: [
            [{ text: 'Отправить', callback_data: JSON.stringify({ action: 'comment_photos' }) }, { text: 'Завершить процесс', callback_data: JSON.stringify({ action: 'stopProcess' }) }],
        ] 
    }
}