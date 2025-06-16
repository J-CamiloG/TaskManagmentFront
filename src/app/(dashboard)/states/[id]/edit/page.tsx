"use client"

import { useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "react-hot-toast"
import { ArrowLeft, Save, Trash2 } from "lucide-react"

import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchStateById, updateState, deleteState, clearCurrentState } from "@/store/slices/stateSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Skeleton } from "@/components/ui/skeleton"

// validación
const updateStateSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(50, "El nombre es muy largo"),
  description: z.string().max(200, "La descripción es muy larga").optional(),
})

type UpdateStateFormData = z.infer<typeof updateStateSchema>

export default function EditStatePage() {
  const router = useRouter()
  const params = useParams()
  const dispatch = useAppDispatch()

  const stateId = Number.parseInt(params.id as string)
  const { currentState, isLoading } = useAppSelector((state) => state.states)
  const { tasks } = useAppSelector((state) => state.tasks)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateStateFormData>({
    resolver: zodResolver(updateStateSchema),
  })

  useEffect(() => {
    if (stateId) {
      dispatch(fetchStateById(stateId))
    }

    return () => {
      dispatch(clearCurrentState())
    }
  }, [dispatch, stateId])

  useEffect(() => {
    if (currentState) {
      reset({
        name: currentState.name,
        description: currentState.description || "",
      })
    }
  }, [currentState, reset])

  const onSubmit = async (data: UpdateStateFormData) => {
    try {
      const stateData = {
        ...data,
        description: data.description || undefined,
      }

      const result = await dispatch(updateState({ id: stateId, stateData }))

      if (updateState.fulfilled.match(result)) {
        toast.success("Estado actualizado exitosamente")
        router.push("/states")
      }
    } catch (error) {
        console.error("Error al actualizar el estado:", error)
      toast.error("Error al actualizar el estado")
    }
  }

  const handleDeleteState = async () => {
    if (!currentState) return

    const associatedTasks = tasks.filter((task) => task.stateId === stateId)

    if (associatedTasks.length > 0) {
      toast.error(
        `No se puede eliminar el estado "${currentState.name}" porque tiene ${associatedTasks.length} tareas asociadas.`,
      )
      return
    }

    if (window.confirm(`¿Estás seguro de que quieres eliminar el estado "${currentState.name}"?`)) {
      try {
        await dispatch(deleteState(stateId))
        toast.success("Estado eliminado correctamente")
        router.push("/states")
      } catch (error) {
        console.error("Error al eliminar el estado:", error)
        toast.error("Error al eliminar el estado")
      }
    }
  }

  if (isLoading && !currentState) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-20" />
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-60" />
          </CardHeader>
          <CardContent className="space-y-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!currentState) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </div>

        <Card className="max-w-2xl">
          <CardContent className="p-12 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Estado no encontrado</h3>
            <p className="text-gray-600 mb-4">El estado que buscas no existe o ha sido eliminado.</p>
            <Button onClick={() => router.push("/states")}>Volver a Estados</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const associatedTasks = tasks.filter((task) => task.stateId === stateId)
  const canDelete = associatedTasks.length === 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Editar Estado</h1>
            <p className="text-gray-600">Modifica los datos del estado</p>
          </div>
        </div>

        <Button variant="destructive" onClick={handleDeleteState} disabled={!canDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          Eliminar Estado
        </Button>
      </div>

      {/* Form */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-black">Información del Estado</CardTitle>
          <CardDescription>Actualiza los detalles del estado</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Nnombre */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-black">
                Nombre <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Nombre del estado"
                {...register("name")}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            {/* Descricion*/}
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

            {/* Metadata */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Información adicional</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <strong>Tareas asociadas:</strong> {associatedTasks.length}
                </p>
                <p>
                  <strong>Creado:</strong> {new Date(currentState.createdAt).toLocaleString("es-ES")}
                </p>
                <p>
                  <strong>Última actualización:</strong> {new Date(currentState.updatedAt).toLocaleString("es-ES")}
                </p>
                <p>
                  <strong>ID:</strong> {currentState.id}
                </p>
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <Button type="submit" disabled={isLoading} className="bg-green-600 text-white">
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Actualizando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Actualizar Estado
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
