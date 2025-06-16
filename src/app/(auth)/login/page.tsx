"use client"

import { Suspense } from "react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import LoginPageContent from "./loginPageContext"

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  )
}
