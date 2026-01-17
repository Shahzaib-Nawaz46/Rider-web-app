
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' }); // Try loading from .env.local if available, otherwise relies on system env

async function init() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'my_app_db',
            port: Number(process.env.DB_PORT) || 3306,
            ssl: {
                rejectUnauthorized: false
            }
        });

        console.log('Connected to database.');

        const schemaPath = path.join(__dirname, 'src/app/lib/schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Split by semicolon to handle multiple statements if any, though our file is single statement
        const queries = schema.split(';').filter(q => q.trim());

        for (const query of queries) {
            await connection.query(query);
            console.log('Executed query:', query.substring(0, 50) + '...');
        }

        console.log('Database initialized successfully.');
        await connection.end();
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}

init();
