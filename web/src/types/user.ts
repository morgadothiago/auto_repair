// /types/user.ts

export interface User {
  id: number
  name: string
  email: string
  role: "admin" | "user" | "doctor" | "assistant" // ajuste conforme seu caso
  token: string // token JWT retornado pela API
}
