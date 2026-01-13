import connectToDatabase from "@/app/lib/db";
import bcrypt from 'bcrypt';

export async function POST(request) {
  try {
    const { phoneNumber, pin, policyAccepted, FirstName, LastName } =
      await request.json();

    // validation
    if (
      !phoneNumber ||
      !pin ||
      policyAccepted !== true ||
      !FirstName ||
      !LastName
    ) {
      return Response.json(
        { error: "All fields are required & policy must be accepted" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(pin, 10);

    const conn = await connectToDatabase();

    const [result] = await conn.execute(
      "INSERT INTO users (phoneNumber, pin, policyAccepted, FirstName, LastName) VALUES (?, ?, ?, ?, ?)",
      [phoneNumber, hashedPassword, policyAccepted, FirstName, LastName]
    );

    await conn.end();

    return Response.json(
      {
        message: "User inserted successfully",
        insertId: result.insertId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration Error:", error);
    return Response.json(
      {
        error: "Database insert failed",
        details: error.message,
        code: error.code,
        errno: error.errno
      },
      { status: 500 }
    );
  }
}
