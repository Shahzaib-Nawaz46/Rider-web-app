import connectToDatabase from "@/app/lib/db";

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

        // Query to check if user exists with matching phone and pin
        const [rows] = await conn.execute(
            "SELECT id FROM users WHERE phoneNumber = ? AND pin = ?",
            [phoneNumber, pin]
        );

        await conn.end();

        if (rows.length > 0) {
            // Fetch the user details to return
            const [userRows] = await conn.execute(
                "SELECT id, FirstName, LastName, phoneNumber FROM users WHERE phoneNumber = ? AND pin = ?",
                [phoneNumber, pin]
            );

            const user = userRows[0];

            return Response.json(
                {
                    success: true,
                    message: "Login successful",
                    user: user
                },
                { status: 200 }
            );
        } else {
            return Response.json(
                { error: "Invalid Phone Number or PIN" },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error("Login Verify Error:", error);
        return Response.json(
            { error: "Database error" },
            { status: 500 }
        );
    }
}
