import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import prismaDB from "@/app/libs/prismaDb";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prismaDB),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      authorization: { params: { scope: "read:user user:email" } },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          const email = credentials?.email?.toLowerCase().trim();
          const password = credentials?.password ?? "";

          if (!email || !password) {
            // Returning null tells NextAuth to fail with CredentialsSignin instead of 500
            return null;
          }

          const user = await prismaDB.user.findUnique({
            where: { email },
          });

          if (!user || !user.hashedPassword) {
            return null;
          }

          const ok = await bcrypt.compare(password, user.hashedPassword);
          if (!ok) return null;

          return user;
        } catch (e) {
          console.error("[NextAuth:authorize:error]", e);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/",
  },
  debug:
    process.env.NEXTAUTH_DEBUG === "true" ||
    process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  events: {
    async signIn(message: any) {
      console.log("[NextAuth:event:signIn]", message);
    },
    async createUser(message: any) {
      console.log("[NextAuth:event:createUser]", message);
    },
    async linkAccount(message: any) {
      console.log("[NextAuth:event:linkAccount]", message);
    },
  },
  logger: {
    error(code, metadata) {
      console.error("[NextAuth:error]", code, metadata);
    },
    warn(code) {
      console.warn("[NextAuth:warn]", code);
    },
    debug(code, metadata) {
      if (process.env.NODE_ENV !== "production") {
        console.debug("[NextAuth:debug]", code, metadata);
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
