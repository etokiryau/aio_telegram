import { DataTypes } from "sequelize";
import sequelize from "../../db";
import type { IModelUser } from "../interfaces/user.interface";

const User = sequelize.define<IModelUser>('user', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    chatId: {
        type: DataTypes.INTEGER,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
    },
    token: {
        type: DataTypes.STRING,
    }
})

export default User