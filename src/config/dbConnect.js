import pg from 'pg';

const {Pool} = pg;
const isProduction = process.env.NODE_ENV === 'production';

export const pool = new Pool(
    process.env.DATABASE_URL
        ? {
            connectionString: process.env.DATABASE_URL,
            ssl: isProduction ? { rejectUnauthorized: false } : false // ssl only for production environment
        } : {
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASS,
            port: Number(process.env.DB_PORT) || 5432
        }
);

export const query = (text, params) => pool.query(text, params)