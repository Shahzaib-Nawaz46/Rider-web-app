import connectToDatabase from "@/app/lib/db";

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const conn = await connectToDatabase();

        // Select pending rides created in the last 60 seconds
        // 1. Get the Rider's ID from session/token (assuming passed in header or session, but for now we might need to fetch it based on context or pass it)
        // Actually, available is a GET. We should rely on server session.
        // However, the Rider page calls this in a loop.
        // Let's assume the rider sends their ID in a query param or we assume 'Standard' if generic.
        // Better: Fetch the rider's vehicle type first using their ID from session.

        // For simplicity, let's filter in the query. But we need the rider's ID. 
        // The current implementation of `available` doesn't take params.
        // We will update it to take `riderId` in query param or rely on session.

        // Let's rely on the session if possible, but for polling speed, let's assume the client might pass it.
        // Or, simply:
        // SELECT * FROM rides WHERE status = 'PENDING' ...
        // AND vehicle_type IN (SELECT vehicleType FROM riders WHERE id = ?)

        // We need to parse riderId from searchParams or session.
        const url = new URL(request.url);
        const riderId = url.searchParams.get('riderId');

        let query = `SELECT *, 
       TIMESTAMPDIFF(SECOND, created_at, NOW()) as seconds_elapsed 
       FROM rides 
       WHERE status = 'PENDING' 
       AND created_at > NOW() - INTERVAL 60 SECOND`;

        const params = [];

        if (riderId) {
            query += ` AND (vehicle_type IS NULL OR vehicle_type = (SELECT vehicleType FROM riders WHERE id = ?))`;
            params.push(riderId);
        }

        query += ` ORDER BY created_at DESC`;

        const [rows] = await conn.execute(query, params);

        // conn.end() removed

        return Response.json(rows, { status: 200 });

    } catch (error) {
        console.error("Fetch Available Rides Error:", error);
        return Response.json(
            { error: "Failed to fetch rides", details: error.message },
            { status: 500 }
        );
    }
}
