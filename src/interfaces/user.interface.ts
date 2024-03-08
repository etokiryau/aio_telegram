import type { Model } from "sequelize";

interface IUser {
    id?: number
    chatId: number
    email: string
    token: string
}

export interface IModelUser extends Model<IUser> {}