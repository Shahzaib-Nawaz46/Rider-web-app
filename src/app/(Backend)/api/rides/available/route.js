import connectToDatabase from "@/app/lib/db";

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const conn = await connectToDatabase();

        // Select pending rides created in the last 60 seconds
        const [rows] = await conn.execute(
            `SELECT *, 
       TIMESTAMPDIFF(SECOND, created_at, NOW()) as seconds_elapsed 
       FROM rides 
       WHERE status = 'PENDING' 
       AND created_at > NOW() - INTERVAL 60 SECOND
       ORDER BY created_at DESC`
        );

        // conn.end() removed

        return Response.json(rows, { status: 200 });

    } catch (error) {
        console.error("Fetch Available Rides Error:", error);
        return Response.json(
            { error: "Failed to fetch rides", details: error.message },
            { status: 500 }
        );
    }
}
