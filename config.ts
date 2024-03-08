import { Options } from "sequelize";

const options: Record<string, Options> = {
    development: {
        username: 'kirill',
        password: 'kirill',
        database: 'kirill',
        host: 'localhost',
        port: 5432,
        dialect: 'postgres',
    },
};

export default options;