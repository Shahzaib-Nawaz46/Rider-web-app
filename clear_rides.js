const mysql = require('mysql2/promise');
require('dotenv').config();

async function clearStaleRides() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log("Clearing all ACCEPTED rides to reset state...");
        const [result] = await connection.execute("UPDATE rides SET status = 'CANCELLED' WHERE status = 'ACCEPTED'");
        console.log(`Updated ${result.affectedRows} rides to CANCELLED.`);
    } catch (err) {
        console.error("Error clearing rides:", err);
    } finally {
        await connection.end();
        process.exit(0);
    }
}

clearStaleRides();
