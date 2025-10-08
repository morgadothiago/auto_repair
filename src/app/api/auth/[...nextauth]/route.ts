import NextAuth, { Account, Session } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import prisma from "@/lib/prisma"
import { sign } from "jsonwebtoken"
import { JWT } from "next-auth/jwt"
import { User } from "@/types/user"


export const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!user) {
          throw new Error("No user found with the given email!")
        }

        const checkPassword = await compare(
          credentials!.password,
          user.password
        )

        if (!checkPassword) {
          throw new Error("Password doesn't match!")
        }
        return {
          email: user.email,
          name: user.name,
          id: user.id,
          role: user.role,
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }: { token: JWT; user: User; account: Account }) {
      if (account && user) {
          token.accessToken = sign(
            { userId: user.id, email: user.email, name: user.name, role: user.role },
            process.env.NEXTAUTH_SECRET as string,
            { expiresIn: "1h" }
          );
          token.id = user.id;
          token.name = user.name;
          token.email = user.email;
          token.role = user.role;
        }
      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email as string
        session.user.role = token.role as string
        session.accessToken = token.accessToken as string
      }
      return session
    },
  },
  pages: {
    signIn: "/signin",
  },
}

const handler = NextAuth(authOptions as any)
export { handler as GET, handler as POST }
