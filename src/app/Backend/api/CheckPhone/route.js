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

        const [rows] = await conn.execute(
            "SELECT id FROM users WHERE phoneNumber = ?",
            [phoneNumber]
        );

        await conn.end();

        return Response.json(
            { exists: rows.length > 0 },
            { status: 200 }
        );
    } catch (error) {
        console.error("Check Phone Error:", error);
        return Response.json(
            { error: "Database error" },
            { status: 500 }
        );
    }
}
