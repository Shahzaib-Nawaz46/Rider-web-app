import connectToDatabase from "@/app/lib/db";
import bcrypt from 'bcrypt';

export async function POST(request) {
    try {
        const { phoneNumber, pin } = await request.json();

        if (!phoneNumber || !pin) {
            return Response.json(
                { error: "Phone number and PIN are required" },
                { status: 400 }
            );
        }

        const conn = await connectToDatabase();

        // Query to find rider by phone number
        const [rows] = await conn.execute(
            "SELECT id, FirstName, LastName, phoneNumber, pin, vehicleType FROM riders WHERE phoneNumber = ?",
            [phoneNumber]
        );

        // conn.end() removed

        if (rows.length > 0) {
            const rider = rows[0];
            const isMatch = await bcrypt.compare(pin, rider.pin);

            if (isMatch) {
                // Remove pin from rider object before sending response
                const { pin: dbPin, ...riderWithoutPin } = rider;

                return Response.json(
                    {
                        success: true,
                        message: "Rider Login successful",
                        user: { ...riderWithoutPin, role: 'rider' }
                    },
                    {
                        status: 200,
                        headers: { 'Set-Cookie': `rider_session=${rider.id}; Path=/; HttpOnly; SameSite=Strict` }
                    }
                );
            }
        }

        return Response.json(
            { error: "Invalid Phone Number or PIN" },
            { status: 401 }
        );
    } catch (error) {
        console.error("Rider Login Verify Error:", error);
        return Response.json(
            { error: "Database error" },
            { status: 500 }
        );
    }
}
