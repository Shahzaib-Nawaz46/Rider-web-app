import connectToDatabase from "@/app/lib/db";

export async function POST(request) {
    try {
        const body = await request.json();
        const {
            userId,
            pickupLat, pickupLng, pickupName,
            dropLat, dropLng, dropName,
            price
        } = body;

        // Basic validation
        if (!pickupLat || !pickupLng || !dropLat || !dropLng || !userId) {
            return Response.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const conn = await connectToDatabase();

        const [result] = await conn.execute(
            `INSERT INTO rides 
      (user_id, pickup_lat, pickup_lng, pickup_name, drop_lat, drop_lng, drop_name, price, status, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', NOW())`,
            [userId, pickupLat, pickupLng, pickupName, dropLat, dropLng, dropName, price]
        );

        // conn.end() removed as we are using a pool

        return Response.json(
            {
                message: "Ride requested successfully",
                rideId: result.insertId
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Create Ride Error:", error);
        return Response.json(
            { error: "Failed to create ride", details: error.message },
            { status: 500 }
        );
    }
}
