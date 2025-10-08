"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../context/AuthContext"

export default function Dashboard() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/signin") // usa replace para evitar voltar com back
    }
  }, [isAuthenticated, isLoading, router])

  // Enquanto estiver carregando ou não autenticado, não renderiza nada
  if (isLoading || !isAuthenticated) {
    return null
  }

  return (
    <div>
      <h1>Bem-vindo ao dashboard!</h1>
      {/* conteúdo do dashboard */}
    </div>
  )
}
