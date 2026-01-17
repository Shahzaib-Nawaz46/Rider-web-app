import connectToDatabase from "./src/app/lib/db.js";

async function updateSchema() {
    const pool = await connectToDatabase();
    console.log("Updating schema...");

    try {
        await pool.execute(`
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
        console.log("ride_offers table created successfully.");
    } catch (error) {
        console.error("Error creating table:", error);
    } finally {
        // We don't need to explicitly close the pool as it's designed to be long-lived, 
        // but for a script it's cleaner to let the process exit. 
        // However, since we removed explicit closing from db.js, we'll just let the script finish.
        process.exit(0);
    }
}

updateSchema();
