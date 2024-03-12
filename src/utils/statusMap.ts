import type { TWorkStatus } from "../interfaces/work.interface";

export const statusMap: Record<TWorkStatus, {name: string, emoji: string}> = {
    'notStarted': { name: 'Не начато', emoji: '⚪️' },
    'started': { name: 'В работе', emoji: '🟡' },
    'finished': { name: 'Завершено', emoji: '🔵' },
    'accepted': { name: 'Принято', emoji: '🟢' },
    'declined': { name: 'Отклонено', emoji: '🔴' },
}