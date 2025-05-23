import { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

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
      // Add admin user validation here
      // For now, allow all users - you can restrict this later
      return true;
    },
    
    async session({ session, token }) {
      // Add custom session data
      if (session.user) {
        session.user.id = token.sub!;
        session.user.isAdmin = await isUserAdmin(session.user.email);
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
    strategy: 'jwt',
  },
  
  secret: process.env.NEXTAUTH_SECRET,
};

// Function to check if user is admin
async function isUserAdmin(email?: string | null): Promise<boolean> {
  if (!email) return false;
  
  // For now, define admin emails in environment variables
  // Later you can use a database
  const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
  return adminEmails.includes(email);
}

// Middleware helper for protecting admin routes
export async function requireAuth(request: any) {
  // This will be used in middleware to protect admin routes
  return true; // Implement actual auth check
} 