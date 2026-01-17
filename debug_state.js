const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkState() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        ssl: { rejectUnauthorized: false }
    });

    try {
        // 1. Check Tables
        const [tables] = await connection.execute("SHOW TABLES LIKE 'ride_offers'");
        console.log("ride_offers table exists:", tables.length > 0);

        // 2. Check Active Rides
        const [activeRides] = await connection.execute("SELECT id, status, rider_id FROM rides WHERE status = 'ACCEPTED'");
        console.log("Active (ACCEPTED) Rides:", activeRides);

        // 3. Check Pending Rides
        const [pendingRides] = await connection.execute("SELECT id, status FROM rides WHERE status = 'PENDING'");
        console.log("Pending Rides:", pendingRides.length);

    } catch (err) {
        console.error("Error checking state:", err);
    } finally {
        await connection.end();
        process.exit(0);
    }
}

checkState();
