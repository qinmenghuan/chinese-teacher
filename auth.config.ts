import type { NextAuthConfig } from 'next-auth';

const publicPaths = ['/resource'];
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
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