import type { Model } from "sequelize";
import type { TWorkStatus } from "./work.interface";
import type { TUserRoles } from "./userRoles.type";

interface ISession {
    id?: number
    chatId: number
    action?: string
    email?: string
    projectId?: number
    projectName?: string
    userRoles?: TUserRoles[]
    worksList?: {name: string, workTitle: string, status: TWorkStatus}[]
    currentWork?: {id: number, workTitle: string, status: TWorkStatus}
    workDate?: string
    declineComment?: string
}

export interface IModelSession extends Model<ISession> {}