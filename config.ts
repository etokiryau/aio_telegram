import type { Options } from "sequelize"

const options: Record<string, Options> = {
    development: {
        username: 'postgres',
        password: 'aio',
        database: 'postgres',
        host: 'localhost',
        port: 5432,
        dialect: 'postgres',
    },
}

export default options