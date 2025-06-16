"use client"

import type React from "react"

import { useEffect } from "react"
import { useAppDispatch } from "@/store/hooks"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    console.log("AuthProvider cargado - NO se verifica sesión automáticamente")

  }, [dispatch])

  return <>{children}</>
}

