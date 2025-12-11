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
        if(!credentials?.email || !credentials?.password) {
            return null;
        }

        const user = await db.select().from(usersTable).where(eq(usersTable.email, credentials.email as string)).limit(1);

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
        } as User;
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
            }

            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.name = token.name as string;
            }
        
            return session;
        },
  },

});