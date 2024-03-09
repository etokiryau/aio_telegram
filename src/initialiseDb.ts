import sequelize from "../db"
import Session from "./models/Session"

export const initialiseDb = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync({alter: true})
        // await Session.sync({alter: true})
    } catch(e) {
        console.log('Ошибка в подключении БД')
        console.log(e)
    } 
}