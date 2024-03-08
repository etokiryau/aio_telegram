import { DataTypes } from "sequelize";
import sequelize from "../../db";
import type { IModelSession } from "../interfaces/session.interface";

const Session = sequelize.define<IModelSession>('session', {
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
    action: {
        type: DataTypes.STRING,
        defaultValue: 'auth_email'
    },
    email: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    projectId: {
        type: DataTypes.INTEGER,
        defaultValue: null
    },
    projectName: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    worksList: {
        type: DataTypes.ARRAY(DataTypes.JSON),
        defaultValue: []
    },
    currentWork: {
        type: DataTypes.JSON,
        defaultValue: null
    }
})

export default Session