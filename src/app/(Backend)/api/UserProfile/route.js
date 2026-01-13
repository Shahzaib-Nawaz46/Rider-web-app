import connectToDatabase from "@/app/lib/db";

export async function POST(request) {
    try {
        const { phoneNumber } = await request.json();

        if (!phoneNumber) {
            return Response.json(
                { error: "Phone number is required" },
                { status: 400 }
            );
        }

        const conn = await connectToDatabase();

        // Update user details
        await conn.execute(
            "UPDATE users SET FirstName = ?, LastName = ?, email = ? WHERE phoneNumber = ?",
            [name.firstName, name.lastName, email, phoneNumber]
        );

        // Fetch updated user
        const [rows] = await conn.execute(
            "SELECT FirstName, LastName, email, phoneNumber, created_at FROM users WHERE phoneNumber = ?",
            [phoneNumber]
        );

        await conn.end();

        if (rows.length > 0) {
            return Response.json(
                { success: true, user: rows[0] },
                { status: 200 }
            );
        } else {
            return Response.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

    } catch (error) {
        console.error("Update Profile Error:", error);
        return Response.json(
            { error: "Database error" },
            { status: 500 }
        );
    }
}
