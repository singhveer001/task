import { client } from './db.js'

const createTables = async () => {
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS category(
                category_id SERIAL PRIMARY KEY,
                category_name VARCHAR(100) NOT NULL
            );    
        `);
        
        await client.query(`
            CREATE TABLE IF NOT EXISTS product(
                product_id SERIAL PRIMARY KEY,
                product_name VARCHAR(100) NOT NULL,
                category_id INT REFERENCES category(category_id)
            );
        `);

        console.log("Table Created Successfully")
        client.end();

    } catch (error) {
        console.log("Error while creating tables:",error)
        await client.end();
        process.exit(1);
    }
}

createTables();