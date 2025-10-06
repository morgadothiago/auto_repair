import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import type { NextAuthOptions } from "next-auth"
import type { User } from "@/types/user"

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) return null

        try {
          const res = await fetch(`http://localhost:3001/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          if (!res.ok) return null

          const user: User = await res.json()

          if (!user?.token) return null

          return user
        } catch (error) {
          console.error("Erro ao autenticar:", error)
          return null
        }
      },
    }),
  ],

  pages: {
    signIn: "/signin", // página de login personalizada
  },
  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const typedUser = user as User
        token.accessToken = typedUser.token
        token.role = typedUser.role
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as User["role"]
        session.accessToken = token.accessToken as string
      }
      return session
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
