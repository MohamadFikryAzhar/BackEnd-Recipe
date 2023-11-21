import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const {Pool} = pkg;
const client = new Pool({
    host: process.env.DB_HOST_REMOTE,
    port: process.env.DB_PORT_REMOTE,
    database: process.env.DB_NAME_REMOTE,
    user: process.env.DB_USER_REMOTE,
    password: process.env.DB_PASSWORD_REMOTE
});

export default client;