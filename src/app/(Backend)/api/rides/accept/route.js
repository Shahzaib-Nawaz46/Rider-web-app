import connectToDatabase from "@/app/lib/db";

export async function POST(request) {
    try {
        // Accept logic can be triggered by RIDER (instant accept at asking price)
        // OR by USER (accepting an offer).
        // If accepting an offer, we need offerId or details.

        const { rideId, riderId, price } = await request.json(); // Price might be from an offer

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

        // 2. Assign rider and potentially update price (if it's a bargained price)
        if (price) {
            await conn.execute(
                "UPDATE rides SET status = 'ACCEPTED', rider_id = ?, price = ? WHERE id = ?",
                [riderId, price, rideId]
            );
        } else {
            await conn.execute(
                "UPDATE rides SET status = 'ACCEPTED', rider_id = ? WHERE id = ?",
                [riderId, rideId]
            );
        }

        // 3. Mark the specific offer as ACCEPTED (if applicable) - Optional cleanup
        // We could also mark other offers as REJECTED here.
        await conn.execute(
            "UPDATE ride_offers SET status = 'ACCEPTED' WHERE ride_id = ? AND rider_id = ?",
            [rideId, riderId]
        );
        await conn.execute(
            "UPDATE ride_offers SET status = 'REJECTED' WHERE ride_id = ? AND rider_id != ?",
            [rideId, riderId]
        );


        return Response.json({ message: "Ride accepted successfully" }, { status: 200 });

    } catch (error) {
        console.error("Accept Ride Error:", error);
        return Response.json(
            { error: "Database error", details: error.message },
            { status: 500 }
        );
    }
}
