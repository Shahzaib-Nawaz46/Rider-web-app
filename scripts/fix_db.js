const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function migrate() {
    console.log("Connecting to DB...");
    console.log("Host:", process.env.DB_HOST);

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: Number(process.env.DB_PORT),
            ssl: { rejectUnauthorized: false }
        });

        console.log("Connected. Checking columns...");

        try {
            await connection.query("SELECT current_lat FROM riders LIMIT 1");
            console.log("Column 'current_lat' already exists.");
        } catch (err) {
            if (err.code === 'ER_BAD_FIELD_ERROR') {
                console.log("Adding 'current_lat' and 'current_lng'...");
                await connection.query("ALTER TABLE riders ADD COLUMN current_lat DECIMAL(10, 8) NULL");
                await connection.query("ALTER TABLE riders ADD COLUMN current_lng DECIMAL(11, 8) NULL");
                console.log("Columns added successfully.");
            } else {
                throw err;
            }
        }

        console.log("Migration Complete.");
        process.exit(0);
    } catch (err) {
        console.error("Migration Failed:", err);
        process.exit(1);
    }
}

migrate();
