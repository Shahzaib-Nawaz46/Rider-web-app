const mysql = require('mysql2/promise');
require('dotenv').config();

async function createTable() {
    console.log("Connecting to DB...");
    // Using direct connection config to ensure it works outside of Next.js context
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log("Creating table...");
        await connection.execute(`
      CREATE TABLE IF NOT EXISTS ride_offers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ride_id INT NOT NULL,
        rider_id INT NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        status ENUM('PENDING', 'ACCEPTED', 'REJECTED') DEFAULT 'PENDING',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE CASCADE,
        FOREIGN KEY (rider_id) REFERENCES riders(id) ON DELETE CASCADE
      );
    `);
        console.log("Table 'ride_offers' created successfully!");
    } catch (err) {
        console.error("Error creating table:", err);
    } finally {
        await connection.end();
        process.exit(0);
    }
}

createTable();
