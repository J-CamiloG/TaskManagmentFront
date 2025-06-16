"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { toast } from "react-hot-toast"
import { clearError } from "@/store/slices/authSlice"
import LoginForm from "./login-form"

export default function LoginPageContent() {
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth)

  const [redirecting, setRedirecting] = useState(false)
  const redirectTo = searchParams.get("redirect") || "/dashboard"

  const performRedirect = (destination: string) => {
    window.location.href = destination
  }

  useEffect(() => {
    if (isAuthenticated && !isLoading && !redirecting) {
      setRedirecting(true)
      setTimeout(() => {
        performRedirect(redirectTo)
      }, 1000)
    }
  }, [isAuthenticated, isLoading, redirecting, redirectTo])

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  return <LoginForm />
}
