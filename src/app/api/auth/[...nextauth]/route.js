import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectToDatabase from "@/app/lib/db";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phoneNumber: { label: "Phone Number", type: "text" },
        pin: { label: "PIN", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials) return null;

        const conn = await connectToDatabase();

        const [rows] = await conn.execute(
          "SELECT id, FirstName, LastName FROM users WHERE phoneNumber = ? AND pin = ?",
          [credentials.phoneNumber, credentials.pin]
        );

        await conn.end();

        if (rows.length === 0) return null;

        const user = rows[0];

        // returning user and saving data in token
        return {
          id: user.id.toString(),
          name: `${user.FirstName} ${user.LastName}`,
          firstName: `${user.FirstName}`,
          lastName: user.LastName,
          phoneNumber: user.phoneNumber,
          
        };
      },
    }),
  ],

  callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.id = user.id;
      token.firstName = user.firstName;
      token.phoneNumber = user.phoneNumber;
    }
    return token;
  },
  async session({ session, token }) {
    if (session.user) {
      session.user.id = token.id;
      session.user.firstName = token.firstName;
      session.user.phoneNumber = token.phoneNumber;
    }
    return session;
  },
},


  pages: {
    signIn: "/User/Login",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
