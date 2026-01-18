import connectToDatabase from "@/app/lib/db";

export async function POST(request) {
    try {
        const body = await request.json();
        const {
            userId,
            pickupLat, pickupLng, pickupName,
            dropLat, dropLng, dropName,
            price,
            vehicleType
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
      (user_id, pickup_lat, pickup_lng, pickup_name, drop_lat, drop_lng, drop_name, price, vehicle_type, status, created_at, expires_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', NOW(), DATE_ADD(NOW(), INTERVAL 120 SECOND))`,
            [userId, pickupLat, pickupLng, pickupName, dropLat, dropLng, dropName, price, vehicleType || 'Standard']
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
