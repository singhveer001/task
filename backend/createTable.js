import { pool } from './db.js'

const createTables = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS category(
                category_id SERIAL PRIMARY KEY,
                category_name VARCHAR(100) NOT NULL
            );    
        `);
        
        await pool.query(`
            CREATE TABLE IF NOT EXISTS product(
                product_id SERIAL PRIMARY KEY,
                product_name VARCHAR(100) NOT NULL,
                category_id INT REFERENCES category(category_id) ON DELETE SET NULL
            );
        `);

        console.log("Table Created Successfully")

    } catch (error) {
        console.log("Error while creating tables:",error)
        await pool.end();
        process.exit(1);
    } finally{
        await pool.end();
    }
}

createTables();