import type { NextAuthConfig } from "next-auth";

// Edge-safe auth config — no Prisma, no bcrypt, no Node.js-only modules.
// Used by middleware to validate JWT tokens on the edge.
export const authConfig = {
  session: { strategy: "jwt" as const },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        (session.user as { role?: string; id?: string }).role = token.role as string;
        (session.user as { role?: string; id?: string }).id = token.id as string;
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
