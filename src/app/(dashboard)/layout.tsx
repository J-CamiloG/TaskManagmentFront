"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { checkAuthStatus } from "@/store/slices/authSlice"
import { fetchStates } from "@/store/slices/stateSlice"
import { MainLayout } from "@/components/layout/main-layout"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth)

  useEffect(() => {
    dispatch(checkAuthStatus())
      .unwrap()
      .then(() => {
        dispatch(fetchStates())
      })
      .catch(() => {
        router.push("/login")
      })
  }, [dispatch, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Acceso Denegado</h2>
          <p className="text-gray-600">Debes iniciar sesión para acceder a esta página.</p>
          <button
            onClick={() => router.push("/login")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Ir a Login
          </button>
        </div>
      </div>
    )
  }

  return <MainLayout>{children}</MainLayout>
}
