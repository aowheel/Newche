import NextAuth from 'next-auth';
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
 
export const { handlers, auth, signIn, signOut } = NextAuth({
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnInternal = nextUrl.pathname.startsWith('/internal');
      if (isOnInternal) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/internal', nextUrl));
      }
      return true;
    },
  },
  providers: [Google],
});