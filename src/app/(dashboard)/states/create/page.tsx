"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "react-hot-toast"
import { ArrowLeft, Save } from "lucide-react"

import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { createState } from "@/store/slices/stateSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

// validación
const createStateSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(50, "El nombre es muy largo"),
  description: z.string().max(200, "La descripción es muy larga").optional(),
})

type CreateStateFormData = z.infer<typeof createStateSchema>

export default function CreateStatePage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isLoading } = useAppSelector((state) => state.states)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateStateFormData>({
    resolver: zodResolver(createStateSchema),
  })

  const onSubmit = async (data: CreateStateFormData) => {
    try {
      const stateData = {
        ...data,
        description: data.description || undefined,
      }

      const result = await dispatch(createState(stateData))

      if (createState.fulfilled.match(result)) {
        toast.success("Estado creado exitosamente")
        router.push("/states")
      }
    } catch (error) {
        console.error("Error al crear el estado:", error)
      toast.error("Error al crear el estado")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Crear Nuevo Estado</h1>
          <p className="text-gray-600">Define un nuevo estado para las tareas</p>
        </div>
      </div>

      {/* formulario*/}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-black">Información del Estado</CardTitle>
          <CardDescription>Ingresa los detalles del nuevo estado</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* nombre */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-black">
                Nombre <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Ej: En Revisión, Aprobado, Rechazado"
                {...register("name")}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-black">Descripción</Label>
              <textarea
                id="description"
                rows={3}
                placeholder="Describe qué representa este estado (opcional)"
                {...register("description")}
                className={`text-black w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-ring ${
                  errors.description ? "border-red-500" : "border-input"
                }`}
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
            </div>

            {/* ejemplos */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Ejemplos de estados comunes:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>
                  • <strong>Pendiente:</strong> Tarea creada pero no iniciada
                </li>
                <li>
                  • <strong>En Progreso:</strong> Tarea en desarrollo
                </li>
                <li>
                  • <strong>En Revisión:</strong> Tarea completada, esperando aprobación
                </li>
                <li>
                  • <strong>Completada:</strong> Tarea finalizada y aprobada
                </li>
                <li>
                  • <strong>Cancelada:</strong> Tarea descartada
                </li>
              </ul>
            </div>

            <div className="flex space-x-4 pt-4">
              <Button type="submit" disabled={isLoading} className="bg-green-600 text-white">
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Creando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Crear Estado
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
