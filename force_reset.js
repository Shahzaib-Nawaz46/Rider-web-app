const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

async function resetRides() {
    try {
        const pool = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: Number(process.env.DB_PORT),
            ssl: {
                rejectUnauthorized: false
            }
        });

        const [result] = await pool.execute("UPDATE rides SET status = 'CANCELLED' WHERE status = 'ACCEPTED'");
        console.log(`Reset ${result.affectedRows} stuck rides.`);
        await pool.end();
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
resetRides();
