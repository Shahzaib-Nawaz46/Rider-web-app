const mysql = require('mysql2/promise');
require('dotenv').config();

async function addVehicleType() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log("Adding vehicle_type column to rides table...");
        await connection.execute(`
      ALTER TABLE rides 
      ADD COLUMN vehicle_type VARCHAR(50) DEFAULT 'Standard' AFTER price;
    `);
        console.log("Column 'vehicle_type' added successfully.");
    } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
            console.log("Column 'vehicle_type' already exists.");
        } else {
            console.error("Error adding column:", err);
        }
    } finally {
        await connection.end();
        process.exit(0);
    }
}

addVehicleType();
