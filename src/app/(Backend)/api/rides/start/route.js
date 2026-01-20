import connectToDatabase from "@/app/lib/db";

export async function POST(request) {
    try {
        const { rideId } = await request.json();

        if (!rideId) {
            return Response.json({ error: "Missing rideId" }, { status: 400 });
        }

        const conn = await connectToDatabase();

        // Check if ride is ACCEPTED
        const [check] = await conn.execute(
            "SELECT status FROM rides WHERE id = ?",
            [rideId]
        );

        if (check.length === 0) {
            return Response.json({ error: "Ride not found" }, { status: 404 });
        }

        // We allow starting if it's ACCEPTED. 
        // If it's already IN_PROGRESS, we can just return success (idempotent)
        if (check[0].status === 'IN_PROGRESS') {
            return Response.json({ message: "Ride already started" }, { status: 200 });
        }

        if (check[0].status !== 'ACCEPTED') {
            return Response.json({ error: "Ride cannot be started" }, { status: 400 });
        }

        // Update status to IN_PROGRESS
        await conn.execute(
            "UPDATE rides SET status = 'IN_PROGRESS' WHERE id = ?",
            [rideId]
        );

        return Response.json({ message: "Ride started successfully" }, { status: 200 });

    } catch (error) {
        console.error("Start Ride Error:", error);
        return Response.json(
            { error: "Database error", details: error.message },
            { status: 500 }
        );
    }
}
