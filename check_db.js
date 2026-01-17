const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkColumn() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        ssl: { rejectUnauthorized: false }
    });

    try {
        const [cols] = await connection.execute("SHOW COLUMNS FROM rides LIKE 'vehicle_type'");
        console.log("Column exists:", cols.length > 0);
    } catch (err) {
        console.error(err.message);
    } finally {
        await connection.end();
        process.exit(0);
    }
}

checkColumn();
