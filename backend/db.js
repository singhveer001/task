import { Pool } from 'pg';
import dotenv from 'dotenv'
dotenv.config();

export const pool = new Pool({
    connectionString : process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false  
    }
})


pool.on('error', (err) => {
  console.error('Unexpected error on PostgreSQL client', err);
});