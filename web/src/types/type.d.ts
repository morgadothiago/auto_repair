import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null
      email?: string | null
      role?: string
    }
    accessToken?: string
  }

  interface User {
    id: number
    name: string
    email: string
    role: string
    token: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    role?: string
  }
}
