import type { Options } from "sequelize";

const options: Record<string, Options> = {
    development: {
        username: 'postgres',
        password: 'rnH1-895*3P3n3E9r1V8Pu',
        database: 'postgres',
        host: 'localhost',
        port: 5432,
        dialect: 'postgres',
    },
};

export default options;