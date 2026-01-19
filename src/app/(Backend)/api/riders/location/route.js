import connectToDatabase from "@/app/lib/db";

export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        const { riderId, lat, lng } = await request.json();

        if (!riderId || !lat || !lng) {
            return Response.json({ error: "Missing fields" }, { status: 400 });
        }

        const conn = await connectToDatabase();

        // Update rider's location in the riders table
        const query = `
            UPDATE riders 
            SET current_lat = ?, current_lng = ?
            WHERE id = ?
        `;

        try {
            await conn.execute(query, [lat, lng, riderId]);
        } catch (err) {
            // Self-healing: If columns missing, add them and retry
            if (err.code === 'ER_BAD_FIELD_ERROR' || err.errno === 1054) {
                console.log("Fixing missing columns in riders table...");
                try {
                    await conn.query(`ALTER TABLE riders ADD COLUMN current_lat DECIMAL(10, 8) NULL`);
                    await conn.query(`ALTER TABLE riders ADD COLUMN current_lng DECIMAL(11, 8) NULL`);
                } catch (alterErr) {
                    console.log("Alter table failed or ignored:", alterErr.message);
                }
                // Retry
                await conn.execute(query, [lat, lng, riderId]);
            } else {
                throw err;
            }
        }

        return Response.json({ success: true });
    } catch (error) {
        console.error("Update Location Error:", error);
        return Response.json({ error: "Failed to update location" }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        const url = new URL(request.url);
        const riderId = url.searchParams.get('riderId');

        if (!riderId) {
            return Response.json({ error: "Missing riderId" }, { status: 400 });
        }

        const conn = await connectToDatabase();

        const [rows] = await conn.execute(
            `SELECT current_lat as lat, current_lng as lng FROM riders WHERE id = ?`,
            [riderId]
        );

        if (rows.length === 0) {
            return Response.json({ error: "Rider not found" }, { status: 404 });
        }

        return Response.json(rows[0]);
    } catch (error) {
        console.error("Get Location Error:", error);
        // If GET fails due to missing column, we technically can't "fix" it easily without a write, 
        // but the POST from the rider will fix it shortly.
        return Response.json({ error: "Failed to get location" }, { status: 500 });
    }
}
