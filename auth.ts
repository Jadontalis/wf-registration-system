import NextAuth, { User } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "@/database/drizzle"
import { usersTable } from "@/database/schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"
import config from "@/lib/config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  secret: config.env.authSecret,


  providers: [CredentialsProvider({ 

    async authorize(credentials) {
        try {
            if(!credentials?.email || !credentials?.password) {
                return null;
            }

            const email = (credentials.email as string).toLowerCase();
            const user = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);

            if(user.length === 0) {
                return null;
            }

            const isPasswordValid = await bcrypt.compare(credentials.password as string, user[0].password);

            if (!isPasswordValid) {
                return null;
            }

            return {
                id: user[0].id.toString(),
                email: user[0].email,
                name: user[0].full_name,
                role: user[0].role,
            } as User;
        } catch (error) {
            console.error("Error during authorization:", error);
            return null;
        }
    }

  })],

  pages: {
    signIn: '/sign-in',
  },

  callbacks: 
  {
    async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.role = user.role;
            }

            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.name = token.name as string;
                session.user.role = token.role as "ADMIN" | "USER";
            }
        
            return session;
        },
  },

});