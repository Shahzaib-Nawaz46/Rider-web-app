import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyUser, verifyRider } from "@/app/lib/authService";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phoneNumber: { label: "Phone Number", type: "text" },
        pin: { label: "PIN", type: "password" },
        loginType: { label: "Login Type", type: "text" }, // 'user' or 'rider'
      },

      async authorize(credentials) {
        if (!credentials) return null;

        const { phoneNumber, pin, loginType } = credentials;

        // Explicit check based on loginType
        if (loginType === 'user') {
          return await verifyUser(phoneNumber, pin);
        } else if (loginType === 'rider') {
          return await verifyRider(phoneNumber, pin);
        }

        // Optional: fallback to checking User then Rider if no type is provided (for backward compatibility if needed)
        // For now, we strictly enforce type or return null to ensure "clean" logic as requested.
        return null;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.phoneNumber = user.phoneNumber;
        token.role = user.role;
        token.vehicleType = user.vehicleType;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.phoneNumber = token.phoneNumber;
        session.user.role = token.role;
        session.user.vehicleType = token.vehicleType;
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
