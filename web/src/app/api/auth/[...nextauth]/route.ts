import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import type { NextAuthOptions } from "next-auth"
import type { User } from "@/types/user"
import { sign } from "jsonwebtoken"

type AuthResponse = {
  success: boolean
  data?: {
    user: User
    token: string
  }
  message?: string
}

export const authOptions: NextAuthOptions = {
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
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const res = await fetch(`http://localhost:3001/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          const responseData: AuthResponse = await res.json()

          if (!responseData.success || !responseData.data) return null

          const { user, token } = responseData.data

          if (!token) return null

          return { ...user, token }
        } catch (error) {
          console.error("Erro ao autenticar:", error)
          return null
        }
      },
    }),
  ],

  pages: {
    signIn: "/signin",
  },

  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        const u = user as User
        token.accessToken = sign(
          { userId: u.id, email: u.email, name: u.name, role: u.role },
          process.env.NEXTAUTH_SECRET as string,
          { expiresIn: "1h" }
        )
        token.role = u.role
      }
      return token
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.name = token.name
        session.user.email = token.email
        session.user.role = token.role as string
        session.accessToken = token.accessToken
      }
      return session
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
