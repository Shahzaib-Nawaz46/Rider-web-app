import connectToDatabase from "@/app/lib/db";

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
    try {
        const { rideId } = await params; // Await params here

        if (!rideId) {
            return Response.json({ error: "Missing rideId" }, { status: 400 });
        }

        const conn = await connectToDatabase();

        const [rows] = await conn.execute(
            "SELECT status, rider_id, price, expires_at, created_at, (NOW() > expires_at) as is_expired_now FROM rides WHERE id = ?",
            [rideId]
        );

        if (rows.length === 0) {
            return Response.json({ error: "Ride not found" }, { status: 404 });
        }

        return Response.json(rows[0], { status: 200 });

    } catch (error) {
        console.error("Fetch Ride Status Error:", error);
        return Response.json(
            { error: "Failed to fetch status", details: error.message },
            { status: 500 }
        );
    }
}
