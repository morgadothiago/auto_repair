"use client"

import { useSession, signOut } from "next-auth/react"
import { Button } from "../../components/ui/button"

export default function DashboardPage() {
  const { data: session } = useSession()

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {session?.user?.email}</p>
      <p>Role: {session?.user?.role}</p>
      <Button onClick={() => {
        console.log("Sign out button clicked!");
        signOut({ callbackUrl: "/signin" })
      }}>
        Sign out
      </Button>
    </div>
  )
}
