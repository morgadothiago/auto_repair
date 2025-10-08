import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import type { NextAuthOptions } from "next-auth"
import type { User } from "@/types/user"

type AuthResponse = {
  success: boolean
  data?: {
    user: User
    token: string
  }
  message?: string
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
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

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/signin",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as User
        token.accessToken = u.token
        token.role = u.role
        token.name = u.name
        token.email = u.email
        token.sub = u.id // opcional: garante id no token.sub
      }
      return token
    },

    async session({ session, token }) {
      session.user = {
        id: token.sub ?? "",
        name: token.name ?? "",
        email: token.email ?? "",
        role: token.role ?? "",
        token: token.accessToken ?? "",
      }
      session.accessToken = token.accessToken ?? ""
      return session
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
