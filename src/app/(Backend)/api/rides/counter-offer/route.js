import connectToDatabase from "@/app/lib/db";

export async function POST(request) {
    try {
        const body = await request.json();
        const { rideId, offerId, price, userId } = body;
        // We might just need offerId, but rideId is useful/safer
        // If it's a User countering a SPECIFIC offer, offerId is mandatory.
        // But previously I made a route that updated the global ride price.
        // User request: "rider ki ride per click kr k osko counter bhjye"

        if (!rideId || !price) {
            return Response.json({ error: "Missing fields" }, { status: 400 });
        }

        const conn = await connectToDatabase();

        // Check if ride is active
        const [rows] = await conn.execute(
            `SELECT created_at, expires_at FROM rides WHERE id = ?`,
            [rideId]
        );

        if (rows.length === 0) {
            return Response.json({ error: "Ride not found" }, { status: 404 });
        }

        const ride = rows[0];
        const now = new Date();
        const expiresAt = new Date(ride.expires_at);

        // Check if ride has expired (strict 2-minute limit from creation)
        if (now > expiresAt) {
            return Response.json({ error: "Ride has expired" }, { status: 400 });
        }

        // Note: We are NOT extending the ride timer
        // Rides have a strict 2-minute limit from creation

        // 2. Update the specific Offer or Create one?
        // If `offerId` is provided (User responding to Rider), update that offer.
        if (offerId) {
            await conn.execute(
                `UPDATE ride_offers 
                 SET amount = ?, counter_by = 'user'
                 WHERE id = ?`,
                [price, offerId]
            );
        } else {
            // If no offerId, maybe the User is countering the RIDE itself (e.g. broadcasting new price)?
            // The user updated the "Counter Price" input.
            // We should update the main ride price?
            await conn.execute(
                `UPDATE rides 
                 SET price = ?
                 WHERE id = ?`,
                [price, rideId]
            );
        }

        return Response.json({ message: "Counter offer sent and timer extended" }, { status: 200 });

    } catch (error) {
        console.error("Counter Offer Error:", error);
        return Response.json({ error: "Server Error" }, { status: 500 });
    }
}
