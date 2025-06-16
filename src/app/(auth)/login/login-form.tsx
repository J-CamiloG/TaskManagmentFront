"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "react-hot-toast"
import { Eye, EyeOff, LogIn } from "lucide-react"

import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { loginUser, clearError } from "@/store/slices/authSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

// validación
const loginSchema = z.object({
  email: z.string().email("Ingresa un email válido").min(1, "El email es requerido"),
  password: z.string().min(1, "La contraseña es requerida"),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const { isLoading, error, isAuthenticated, user, token } = useAppSelector((state) => state.auth)

  const [showPassword, setShowPassword] = useState(false)
  const [redirecting, setRedirecting] = useState(false)
  const redirectTo = searchParams.get("redirect") || "/dashboard"

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@example.com",
      password: "admin57123@",
    },
  })

  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  useEffect(() => {
    console.log("🔍 Estado Auth:", {
      isAuthenticated,
      isLoading,
      hasUser: !!user,
      hasToken: !!token,
      redirectTo,
      redirecting,
    })
  }, [isAuthenticated, isLoading, user, token, redirectTo, redirecting])

  const performRedirect = (destination: string) => {
    console.log("🚀 Redirigiendo con window.location a:", destination)
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

  const onSubmit = async (data: LoginFormData) => {
    try {
      setRedirecting(false) 
      const result = await dispatch(loginUser(data))
      if (loginUser.fulfilled.match(result)) {
        toast.success("¡Inicio de sesión exitoso! Redirigiendo...")
      } else {
        setRedirecting(false)
      }
    } catch {
      setRedirecting(false)
    }
  }


  return (
    <Card className="shadow-xl bg-gray-100">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold text-black">Iniciar Sesión</CardTitle>
        <CardDescription>Ingresa tu email y contraseña para acceder al sistema</CardDescription>
      </CardHeader>
      <CardContent>

        {/* Mensaje de redirección */}
        {isAuthenticated && redirecting && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
            <div className="flex items-center justify-center space-x-2">
              <LoadingSpinner size="sm" />
              <span className="text-green-700 font-medium">¡Login exitoso! Redirigiendo al dashboard...</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-black">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              {...register("email")}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-black">Contraseña</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Ingresa tu contraseña"
                {...register("password")}
                className={errors.password ? "border-red-500 pr-10" : "pr-10"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full bg-gray-600" disabled={isLoading || redirecting}>
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Iniciando sesión...
              </>
            ) : redirecting ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Redirigiendo...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Iniciar Sesión
              </>
            )}
          </Button>
        </form>


        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ¿No tienes una cuenta?{" "}
            <button onClick={() => router.push("/register")} className="text-blue-600 hover:text-blue-800 font-medium">
              Regístrate aquí
            </button>
          </p>
        </div>

      </CardContent>
    </Card>
  )
}
