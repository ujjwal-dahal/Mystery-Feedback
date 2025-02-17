import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import databaseConnection from "@/lib/dbConnection";
import UserModel from "@/models/User.model";

export const authOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      authorize: async (credentials: any): Promise<any> => {
        await databaseConnection().catch((err) => {
          console.error("Database connection failed:", err);
          throw new Error("Database connection error");
        });

        try {
          const { email, password } = credentials;

          const existingUser = await UserModel.findOne({
            $or: [{ email }, { username: credentials.username }],
          });

          if (!existingUser) {
            throw new Error("No user found with this email");
          }

          if (!existingUser.isVerified) {
            throw new Error("Please verify your account before logging in");
          }

          const isPasswordMatched = await bcrypt.compare(
            password,
            existingUser.password
          );

          if (!isPasswordMatched) {
            throw new Error("Incorrect password");
          }

          return existingUser;
        } catch (error: any) {
          console.error("Authorization error:", error);
          throw new Error(error.message || "An error occurred during login");
        }
      },
    }),

    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],

  pages: {
    signIn: "/sign-in", 
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessage;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user = session.user || {};
        session.user._id = token._id || null;
        session.user.isVerified = token.isVerified || false;
        session.user.isAcceptingMessage = token.isAcceptingMessage || false;
        session.user.username = token.username || null;
      }
      return session;
    },
  },
} as any;
