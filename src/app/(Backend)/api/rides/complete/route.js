import connectToDatabase from "@/app/lib/db";

export async function POST(request) {
    try {
        const { rideId } = await request.json();

        if (!rideId) {
            return Response.json({ error: "Missing rideId" }, { status: 400 });
        }

        const conn = await connectToDatabase();

        await conn.execute(
            "UPDATE rides SET status = 'COMPLETED' WHERE id = ?",
            [rideId]
        );

        return Response.json({ message: "Ride completed" }, { status: 200 });

    } catch (error) {
        console.error("Complete Ride Error:", error);
        return Response.json(
            { error: "Database error" },
            { status: 500 }
        );
    }
}
