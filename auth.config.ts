import type { NextAuthConfig } from 'next-auth';

const publicPaths = ['/resource'];
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session({ session, token }) {
      // session.user.id = token.sub; // sub 就是用户ID
      (session.user as any).id = token.sub;
      return session;
    },
    // Middleware authorization logic
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;
      // allow public paths
      if (publicPaths.some((path) => pathname.startsWith(path))) { 
        return true;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
      }

      // check if user is on dashboard
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;