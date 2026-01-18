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

        // If Expired, check if it's within the "Missed" window?
        // Logic: "1 min Active + 1 min Missed".
        // If "Active" (seconds_left > 0), we extend.
        // If "Missed" (seconds_left <= 0 but > -60?), do we allow revival?
        // User said: "if user again wo price counter rider ko bhj sakhta hai actiive ride me"
        // So ONLY in active ride.

        const createdInfo = new Date(ride.created_at);
        const diffSeconds = (now - createdInfo) / 1000;

        // Allow negotiation up to 3 minutes (180s)
        if (diffSeconds > 180) {
            return Response.json({ error: "Ride active timer expired (3 mins)." }, { status: 400 });
        }

        // 1. Extend the main Ride Timer by + (Total 2 mins from Creation? Or +1 min?)
        // "60 sec ka time dono k bich barh jaye ga 1 min k bjye 2 min ho jye ga"
        // So expires_at = created_at + 120s.
        // NOTE: If we keep negotiating, does it keep extending? "max 2 min" seems implied.
        // implementation: Set expires_at = created_at + 120s (if not already > that?)
        await conn.execute(
            `UPDATE rides 
             SET expires_at = DATE_ADD(created_at, INTERVAL 120 SECOND)
             WHERE id = ?`,
            [rideId]
        );

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
