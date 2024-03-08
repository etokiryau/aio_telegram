export type TWorkStatus = 'accepted' | 'started' | 'finished' | 'declined' | 'notStarted'

export interface IWork {
    id: number
    workTitle: string
    plannedStart: string
    plannedEnd: string
    actualStart: string
    actualEnd: string
    status: TWorkStatus
    elements: number[]
}