import sequelize from "../db"
import Session from "./models/Session"

export const initialiseDb = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        await Session.sync({alter: true})
    } catch(e) {
        console.log('Ошибка в подкллючении БД')
    } 
}