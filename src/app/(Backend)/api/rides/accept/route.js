import connectToDatabase from "@/app/lib/db";

export async function POST(request) {
    try {
        const body = await request.json();
        const { rideId, riderId } = body;

        if (!rideId || !riderId) {
            return Response.json({ error: "Missing rideId or riderId" }, { status: 400 });
        }

        const conn = await connectToDatabase();

        // 1. Check if ride is still pending
        const [check] = await conn.execute(
            "SELECT status FROM rides WHERE id = ?",
            [rideId]
        );

        if (check.length === 0) {
            return Response.json({ error: "Ride not found" }, { status: 404 });
        }

        if (check[0].status !== 'PENDING') {
            return Response.json({ error: "Ride is no longer available" }, { status: 409 });
        }

        // 2. Assign rider
        await conn.execute(
            "UPDATE rides SET status = 'ACCEPTED', rider_id = ? WHERE id = ?",
            [riderId, rideId]
        );


        return Response.json({ message: "Ride accepted successfully" }, { status: 200 });

    } catch (error) {
        console.error("Accept Ride Error:", error);
        return Response.json(
            { error: "Failed to accept ride", details: error.message },
            { status: 500 }
        );
    }
}
