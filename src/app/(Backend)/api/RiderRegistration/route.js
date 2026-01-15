import connectToDatabase from "@/app/lib/db";
import bcrypt from 'bcrypt';

const VALID_VEHICLE_TYPES = ['comfort', 'mini', 'rickshaw', 'bike'];

export async function POST(request) {
    try {
        const { phoneNumber, pin, FirstName, LastName, vehicleType } = await request.json();

        // Validation
        if (!phoneNumber || !pin || !FirstName || !LastName || !vehicleType) {
            return Response.json(
                { error: "All fields are required (Phone, PIN, First Name, Last Name, Vehicle Type)" },
                { status: 400 }
            );
        }

        if (!VALID_VEHICLE_TYPES.includes(vehicleType)) {
            return Response.json(
                { error: `Invalid vehicle type. Must be one of: ${VALID_VEHICLE_TYPES.join(', ')}` },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(pin, 10);

        const conn = await connectToDatabase();

        // Check if rider already exists
        const [existing] = await conn.execute(
            "SELECT id FROM riders WHERE phoneNumber = ?",
            [phoneNumber]
        );

        if (existing.length > 0) {
            await conn.end();
            return Response.json(
                { error: "Rider with this phone number already exists" },
                { status: 409 }
            );
        }

        const [result] = await conn.execute(
            "INSERT INTO riders (phoneNumber, pin, FirstName, LastName, vehicleType) VALUES (?, ?, ?, ?, ?)",
            [phoneNumber, hashedPassword, FirstName, LastName, vehicleType]
        );

        await conn.end();

        return Response.json(
            {
                message: "Rider registered successfully",
                insertId: result.insertId,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Rider Registration Error:", error);
        return Response.json(
            {
                error: "Database insert failed",
                details: error.message,
            },
            { status: 500 }
        );
    }
}
