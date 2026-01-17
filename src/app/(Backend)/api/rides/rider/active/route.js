import connectToDatabase from "@/app/lib/db";

export async function POST(request) {
    try {
        const { riderId } = await request.json();

        if (!riderId) {
            return Response.json({ error: "Missing riderId" }, { status: 400 });
        }

        const conn = await connectToDatabase();

        // Check if this rider has any ride in ACCEPTED state
        // (Assuming one active ride at a time)
        const [rows] = await conn.execute(
            `SELECT * FROM rides 
             WHERE rider_id = ? 
             AND status = 'ACCEPTED'
             LIMIT 1`,
            [riderId]
        );

        if (rows.length > 0) {
            return Response.json({ activeRide: rows[0] }, { status: 200 });
        } else {
            return Response.json({ activeRide: null }, { status: 200 });
        }

    } catch (error) {
        console.error("Fetch Active Ride Error:", error);
        return Response.json(
            { error: "Database error" },
            { status: 500 }
        );
    }
}
