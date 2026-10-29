import connectToDatabase from "@/app/lib/db";
import Otp from "@/models/Otp";
import User from "@/models/User";
import NextAuth from "next-auth";
import CredentialsProviders from "next-auth/providers/credentials";
export const authOptions = {
  providers: [
    CredentialsProviders({
      name: "Credentials",
      credentials: {
        phone: { label: "phone", type: "text" },
        code: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        await connectToDatabase();

        const { phone, code } = credentials;
        const otp = await Otp.findOne({ phone, code });
        if (!otp || otp.expiresAt < new Date()) {
          //
          throw new Error("کد نا معتبر است یا منقضی است ");
        }

        const user = await User.findOne({ phone });
        if (!user) {
          //
          throw new Error("کاربری یافت نشت ");
        }
        await Otp.deleteOne({ _id: otp._id });
        return {
          id: user._id.toString(),
          phone: user.phone,
          name: user.name,
          isAdmin: user.isAdmin,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.phone = user.phone;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        name: token.name,
        phone: token.phone,
        isAdmin: token.isAdmin,
      };
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
