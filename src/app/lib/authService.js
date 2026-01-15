import connectToDatabase from "@/app/lib/db";
import bcrypt from "bcrypt";

export async function verifyUser(phoneNumber, pin) {
    const conn = await connectToDatabase();

    try {
        const [rows] = await conn.execute(
            "SELECT id, FirstName, LastName, phoneNumber, pin FROM users WHERE phoneNumber = ?",
            [phoneNumber]
        );

        if (rows.length === 0) return null;

        const user = rows[0];
        const isMatch = await bcrypt.compare(pin, user.pin);

        if (!isMatch) return null;

        return {
            id: user.id.toString(),
            name: `${user.FirstName} ${user.LastName}`,
            firstName: user.FirstName,
            lastName: user.LastName,
            phoneNumber: user.phoneNumber,
            role: 'user',
        };
    } finally {
        await conn.end();
    }
}

export async function verifyRider(phoneNumber, pin) {
    const conn = await connectToDatabase();

    try {
        const [rows] = await conn.execute(
            "SELECT id, FirstName, LastName, phoneNumber, pin, vehicleType FROM riders WHERE phoneNumber = ?",
            [phoneNumber]
        );

        if (rows.length === 0) return null;

        const rider = rows[0];
        const isMatch = await bcrypt.compare(pin, rider.pin);

        if (!isMatch) return null;

        return {
            id: rider.id.toString(),
            name: `${rider.FirstName} ${rider.LastName}`,
            firstName: rider.FirstName,
            lastName: rider.LastName,
            phoneNumber: rider.phoneNumber,
            vehicleType: rider.vehicleType,
            role: 'rider',
        };
    } finally {
        await conn.end();
    }
}
