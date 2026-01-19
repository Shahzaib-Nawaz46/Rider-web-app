import connectToDatabase from "@/app/lib/db";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const db = await connectToDatabase();

        // Check if columns exist first provided strictly valid SQL for the environment
        // But simplest is purely Try/Catch or ADD COLUMN IF NOT EXISTS (MySQL 8.0+)
        // Assuming MySQL 8.0 or MariaDB 10.x

        const query = `
            ALTER TABLE riders 
            ADD COLUMN IF NOT EXISTS current_lat DECIMAL(10, 8) NULL,
            ADD COLUMN IF NOT EXISTS current_lng DECIMAL(11, 8) NULL;
        `;

        await db.execute(query);

        return NextResponse.json({ message: "Migration successful: Added current_lat and current_lng to riders table." });
    } catch (error) {
        console.error("Migration Error:", error);
        // Fallback for older MySQL that doesn't support IF NOT EXISTS in ALTER TABLE
        if (error.code === 'ER_BAD_FIELD_ERROR' || error.errno === 1054) {
            // Columns might be missing, but syntax error?
        }

        if (error.sqlState === '42000' && error.message.includes('syntax')) {
            // fallback to raw add, might fail if exists
            try {
                const db = await connectToDatabase();
                await db.execute("ALTER TABLE riders ADD COLUMN current_lat DECIMAL(10, 8) NULL");
                await db.execute("ALTER TABLE riders ADD COLUMN current_lng DECIMAL(11, 8) NULL");
                return NextResponse.json({ message: "Migration successful (fallback methods)" });
            } catch (e2) {
                return NextResponse.json({ error: e2.message, stage: "fallback" }, { status: 500 });
            }
        }

        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
