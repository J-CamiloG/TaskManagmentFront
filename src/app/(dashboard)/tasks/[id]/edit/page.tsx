"use client"

import { useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "react-hot-toast"
import { ArrowLeft, Save, Trash2 } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchTaskById, updateTask, deleteTask, clearCurrentTask } from "@/store/slices/taskSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Skeleton } from "@/components/ui/skeleton"

// validación
const updateTaskSchema = z.object({
  title: z.string().min(1, "El título es requerido").max(200, "El título es muy largo"),
  description: z.string().max(1000, "La descripción es muy larga").optional(),
  stateId: z.number().min(1, "Debes seleccionar un estado"),
  dueDate: z.string().optional(),
})

type UpdateTaskFormData = z.infer<typeof updateTaskSchema>

export default function EditTaskPage() {
  const router = useRouter()
  const params = useParams()
  const dispatch = useAppDispatch()

  const taskId = Number.parseInt(params.id as string)
  const { currentTask, isLoading } = useAppSelector((state) => state.tasks)
  const { states } = useAppSelector((state) => state.states)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateTaskFormData>({
    resolver: zodResolver(updateTaskSchema),
  })

  useEffect(() => {
    if (taskId) {
      dispatch(fetchTaskById(taskId))
    }

    return () => {
      dispatch(clearCurrentTask())
    }
  }, [dispatch, taskId])

  useEffect(() => {
    if (currentTask) {
      reset({
        title: currentTask.title,
        description: currentTask.description || "",
        stateId: currentTask.stateId,
        dueDate: currentTask.dueDate ? new Date(currentTask.dueDate).toISOString().slice(0, 16) : "",
      })
    }
  }, [currentTask, reset])

  const onSubmit = async (data: UpdateTaskFormData) => {
    try {
      const taskData = {
        ...data,
        description: data.description || undefined,
        dueDate: data.dueDate || undefined,
      }

      const result = await dispatch(updateTask({ id: taskId, taskData }))

      if (updateTask.fulfilled.match(result)) {
        toast.success("Tarea actualizada exitosamente")
        router.push("/tasks")
      }
    } catch (error) {
        console.error("Error al actualizar la tarea:", error)
      toast.error("Error al actualizar la tarea")
    }
  }

  const handleDeleteTask = async () => {
    if (!currentTask) return

    if (window.confirm(`¿Estás seguro de que quieres eliminar la tarea "${currentTask.title}"?`)) {
      try {
        await dispatch(deleteTask(taskId))
        toast.success("Tarea eliminada correctamente")
        router.push("/tasks")
      } catch (error) {
        console.error("Error al eliminar la tarea:", error)
        toast.error("Error al eliminar la tarea")
      }
    }
  }

  if (isLoading && !currentTask) {
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
            {[...Array(4)].map((_, i) => (
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

  if (!currentTask) {
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tarea no encontrada</h3>
            <p className="text-gray-600 mb-4">La tarea que buscas no existe o ha sido eliminada.</p>
            <Button onClick={() => router.push("/tasks")}>Volver a Tareas</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

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
            <h1 className="text-2xl font-bold text-gray-900">Editar Tarea</h1>
            <p className="text-gray-600">Modifica los datos de la tarea</p>
          </div>
        </div>

        <Button variant="destructive" onClick={handleDeleteTask}>
          <Trash2 className="mr-2 h-4 w-4" />
          Eliminar Tarea
        </Button>
      </div>

      {/* Forulario */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-black">Información de la Tarea</CardTitle>
          <CardDescription>Actualiza los detalles de la tarea</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* titulo */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-black">
                Título <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Ingresa el título de la tarea"
                {...register("title")}
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
            </div>

            {/* Descricion */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-black">Descripción</Label>
              <textarea
                id="description"
                rows={4}
                placeholder="Describe los detalles de la tarea (opcional)"
                {...register("description")}
                className={`text-black w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-ring ${
                  errors.description ? "border-red-500" : "border-input"
                }`}
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
            </div>

            {/* estado */}
            <div className="space-y-2">
              <Label htmlFor="stateId" className="text-black">
                Estado <span className="text-red-500">*</span>
              </Label>
              <select
                id="stateId"
                {...register("stateId", { valueAsNumber: true })}
                className={`text-black w-full h-10 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-ring ${
                  errors.stateId ? "border-red-500" : "border-input"
                }`}
              >
                {states.map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </select>
              {errors.stateId && <p className="text-sm text-red-500">{errors.stateId.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate" className="text-black">Fecha Límite</Label>
              <Input
                id="dueDate"
                type="datetime-local"
                {...register("dueDate")}
                className={errors.dueDate ? "border-red-500" : ""}
              />
              {errors.dueDate && <p className="text-sm text-red-500">{errors.dueDate.message}</p>}
              <p className="text-xs text-gray-500">Opcional: Establece una fecha y hora límite para la tarea</p>
            </div>

            {/* datos */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Información adicional</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <strong>Creada:</strong> {new Date(currentTask.createdAt).toLocaleString("es-ES")}
                </p>
                <p>
                  <strong>Última actualización:</strong> {new Date(currentTask.updatedAt).toLocaleString("es-ES")}
                </p>
                <p>
                  <strong>ID:</strong> {currentTask.id}
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
                    Actualizar Tarea
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
