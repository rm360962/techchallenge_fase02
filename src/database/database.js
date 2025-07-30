import { Pool } from 'pg';

export const poolConexoes = new Pool({
    user: process.env.DATABASE_USER_1,
    host: process.env.DATABASE_HOST_1,
    database: process.env.DATABASE_1,
    password: process.env.DATABASE_PASSWORD_1,
    port: process.env.DATABASE_PORT_1
});