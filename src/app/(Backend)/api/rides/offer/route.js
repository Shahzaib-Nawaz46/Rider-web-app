import connectToDatabase from "@/app/lib/db";

export async function POST(request) {
    try {
        const { rideId, riderId, amount } = await request.json();
        console.log("Received Offer:", { rideId, riderId, amount });

        if (!rideId || !riderId || !amount) {
            return Response.json(
                { error: "Missing required fields (rideId, riderId, amount)" },
                { status: 400 }
            );
        }

        const conn = await connectToDatabase();

        // 1. Check if an offer already exists from this rider for this ride
        // If so, update it (or we could interpret this as a counter-offer replacement)
        const [existing] = await conn.execute(
            "SELECT id FROM ride_offers WHERE ride_id = ? AND rider_id = ?",
            [rideId, riderId]
        );

        if (existing.length > 0) {
            await conn.execute(
                "UPDATE ride_offers SET amount = ?, status = 'PENDING', counter_by = 'rider' WHERE id = ?",
                [amount, existing[0].id]
            );
        } else {
            await conn.execute(
                "INSERT INTO ride_offers (ride_id, rider_id, amount, status, counter_by) VALUES (?, ?, ?, 'PENDING', 'rider')",
                [rideId, riderId, amount]
            );
        }

        // Note: We are NOT extending the ride timer anymore
        // Rides have a strict 2-minute limit from creation


        return Response.json({ message: "Offer sent successfully" }, { status: 200 });

    } catch (error) {
        console.error("Create Offer Error:", error);
        return Response.json(
            { error: error.message || "Failed to send offer" },
            { status: 500 }
        );
    }
}
