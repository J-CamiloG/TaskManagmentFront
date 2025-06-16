import axios from "axios"
import { toast } from "react-hot-toast"

// instancia de axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Interceptor 
api.interceptors.request.use(
  (config) => {
    const isAuthEndpoint = config.url?.includes("/api/Auth/")
    if (!isAuthEndpoint) {
      const token = localStorage.getItem("token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Interceptor manejar errores 
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const { response } = error

    if (response) {
      switch (response.status) {
        case 401:
          // Token expirado
          localStorage.removeItem("token")
          localStorage.removeItem("user")
          toast.error("Sesión expirada. Por favor, inicia sesión nuevamente.")
          window.location.href = "/login"
          break
        case 403:
          toast.error("No tienes permisos para realizar esta acción.")
          break
        case 404:
          toast.error("Recurso no encontrado.")
          break
        case 400:
            if (response.data?.errors) {
        const errorMessages = Object.values(response.data.errors).flat()
        const message = typeof errorMessages[0] === "string"
            ? errorMessages[0]
            : "Error de validación"
        toast.error(message)
        }
          else if (response.data?.message) {
            toast.error(response.data.message)
          } else {
            toast.error("Datos inválidos. Verifica la información ingresada.")
          }
          break
        case 500:
          toast.error("Error interno del servidor. Intenta nuevamente.")
          break
        default:
          if (response.data?.message) {
            toast.error(response.data.message)
          } else {
            toast.error("Ha ocurrido un error inesperado.")
          }
      }
    } else {
      toast.error("Error de conexión. Verifica tu conexión a internet.")
    }

    return Promise.reject(error)
  },
)

export default api
