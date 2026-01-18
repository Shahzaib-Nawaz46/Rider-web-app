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

        let query = `
        SELECT r.*, 
               TIMESTAMPDIFF(SECOND, r.created_at, NOW()) as seconds_elapsed,
               TIMESTAMPDIFF(SECOND, NOW(), r.expires_at) as seconds_left,
               ro.amount as my_offer_amount,
               ro.status as my_offer_status,
               ro.counter_by,
               ro.id as offer_id
        FROM rides r
        LEFT JOIN ride_offers ro ON r.id = ro.ride_id AND ro.rider_id = ?
        WHERE r.status = 'PENDING' 
        AND r.created_at > NOW() - INTERVAL 180 SECOND`;

        const params = [riderId || 0]; // If riderId is null, use 0 (safer for join)

        if (riderId) {
            query += ` AND (r.vehicle_type IS NULL OR r.vehicle_type = (SELECT vehicleType FROM riders WHERE id = ?))`;
            params.push(riderId);
        }

        query += ` ORDER BY r.created_at DESC`;

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
