"use client"

import type React from "react"

import { Provider } from "react-redux"
import { store } from "@/store"
import { AuthProvider } from "./auth-provider"
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthProvider>{children}</AuthProvider>
    </Provider>
  )
}
