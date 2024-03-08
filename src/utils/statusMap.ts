import type { TWorkStatus } from "../interfaces/work.interface";

export const statusMap: Record<TWorkStatus, string> = {
    'notStarted': 'Не начато',
    'started': 'Начато',
    'finished': 'Завершено',
    'accepted': 'Принято',
    'declined': 'Отклонено',
}