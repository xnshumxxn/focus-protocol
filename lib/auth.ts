import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      // Upsert keeps our own User table (id, email, name, image)
      // in sync with whatever Google hands back on every login.
      await prisma.user.upsert({
        where: { email: user.email },
        update: {
          name: user.name ?? undefined,
          image: user.image ?? undefined,
        },
        create: {
          email: user.email,
          name: user.name ?? undefined,
          image: user.image ?? undefined,
        },
      });

      return true;
    },

    async jwt({ token }) {
      if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
        });

        if (dbUser) {
          token.userId = dbUser.id;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token.userId) {
        (session.user as typeof session.user & { id: string }).id =
          token.userId as string;
      }

      return session;
    },
  },

  pages: {
    signIn: "/",
  },
};
