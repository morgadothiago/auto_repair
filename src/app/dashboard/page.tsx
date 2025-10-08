"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../context/AuthContext"

export default function Dashboard() {
  const router = useRouter()
  const { isAuthenticated, isLoading, user } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/signin")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return <p>Carregando...</p> // ou pode retornar null para nada renderizar
  }

  if (!isAuthenticated) {
    return null // não renderiza nada até redirecionar
  }

  return (
    <div>
      <h1>Bem-vindo ao dashboard!, {user?.role}</h1>
      {/* conteúdo do dashboard */}
    </div>
  )
}
