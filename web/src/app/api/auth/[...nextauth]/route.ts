import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { connectToDatabase } from "@/lib/db"
import { sign } from "jsonwebtoken"

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
      async authorize(credentials) {
        const client = await connectToDatabase()
        const usersCollection = client.db().collection("users")
        const user = await usersCollection.findOne({ email: credentials?.email })

        if (!user) {
          client.close()
          throw new Error("No user found with the given email!")
        }

        const checkPassword = await compare(credentials!.password, user.password)

        if (!checkPassword) {
          client.close()
          throw new Error("Password mismatch!")
        }

        client.close()
        return { email: user.email, name: user.name, id: user._id.toString() }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        token.accessToken = sign(
          { userId: user.id, email: user.email, name: user.name },
          process.env.NEXTAUTH_SECRET as string,
          { expiresIn: "1h" }
        )
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.accessToken = token.accessToken
      }
      return session
    },
  },
  pages: {
    signIn: "/signin",
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
