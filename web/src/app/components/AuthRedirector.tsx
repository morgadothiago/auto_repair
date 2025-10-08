"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import LoadingScreen from "./LoadingScreen"

export default function AuthRedirector({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/signin")
    }
  }, [status, router])

  if (status === "loading") {
    return <LoadingScreen isLoading={status === "loading"} />
  }

  return <>{children}</>
}
