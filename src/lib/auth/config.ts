import { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { isUserAdmin } from '@/lib/config/file-storage';
import '@/lib/init'; // Initialize file-based configuration

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  
  callbacks: {
    async signIn({ user, account, profile }) {
      // OAuth providers are allowed to sign in
      // Admin validation happens in session callback
      return true;
    },
    
    async session({ session, token }) {
      // Add custom session data
      if (session.user) {
        session.user.id = token.sub!;
        // Use file-based admin check
        session.user.isAdmin = isUserAdmin(session.user.email);
      }
      return session;
    },
    
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  
  pages: {
    signIn: '/admin/login',
    error: '/admin/error',
  },
  
  session: {
    strategy: 'jwt', // File-based, no database needed
  },
  
  secret: process.env.NEXTAUTH_SECRET,
};

// Middleware helper for protecting admin routes
export async function requireAuth(request: any) {
  // This will be used in middleware to protect admin routes
  return true; // Implement actual auth check
} 