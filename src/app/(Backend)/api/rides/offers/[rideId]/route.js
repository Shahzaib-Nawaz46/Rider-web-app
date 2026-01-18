import connectToDatabase from "@/app/lib/db";

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
    try {
        const { rideId } = await params;

        if (!rideId) {
            return Response.json({ error: "Missing rideId" }, { status: 400 });
        }

        const conn = await connectToDatabase();

        // Fetch offers along with rider details
        const [rows] = await conn.execute(
            `SELECT 
                ro.id, ro.amount, ro.status, ro.counter_by, ro.rider_id,
                r.FirstName, r.LastName, r.vehicleType, r.phoneNumber
             FROM ride_offers ro
             JOIN riders r ON ro.rider_id = r.id
             WHERE ro.ride_id = ? AND ro.status = 'PENDING'
             ORDER BY ro.amount ASC`,
            [rideId]
        );

        return Response.json(rows, { status: 200 });

    } catch (error) {
        console.error("Fetch Offers Error:", error);
        return Response.json(
            { error: "Failed to fetch offers" },
            { status: 500 }
        );
    }
}
