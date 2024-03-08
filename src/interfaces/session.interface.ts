import type { Model } from "sequelize";
import type { TWorkStatus } from "./work.interface";

interface ISession {
    id?: number
    chatId: number
    action?: string
    email?: string
    projectId?: number
    projectName?: string
    worksList?: {name: string, status: TWorkStatus}[]
    currentWork?: {id: number, status: TWorkStatus}
}

export interface IModelSession extends Model<ISession> {}