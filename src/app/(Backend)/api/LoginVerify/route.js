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

        // Query to find user by phone number
        const [rows] = await conn.execute(
            "SELECT id, FirstName, LastName, phoneNumber, pin FROM users WHERE phoneNumber = ?",
            [phoneNumber]
        );

        await conn.end();

        if (rows.length > 0) {
            const user = rows[0];
            const isMatch = await bcrypt.compare(pin, user.pin);

            if (isMatch) {
                // Remove pin from user object before sending response
                const { pin: dbPin, ...userWithoutPin } = user;

                return Response.json(
                    {
                        success: true,
                        message: "Login successful",
                        user: userWithoutPin
                    },
                    { status: 200 }
                );
            }
        }

        return Response.json(
            { error: "Invalid Phone Number or PIN" },
            { status: 401 }
        );
    } catch (error) {
        console.error("Login Verify Error:", error);
        return Response.json(
            { error: "Database error" },
            { status: 500 }
        );
    }
}
