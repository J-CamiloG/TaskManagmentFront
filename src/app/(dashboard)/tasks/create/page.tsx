"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "react-hot-toast"
import { ArrowLeft, Save } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { createTask } from "@/store/slices/taskSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

// validacion
const createTaskSchema = z.object({
  title: z.string().min(1, "El título es requerido").max(200, "El título es muy largo"),
  description: z.string().max(1000, "La descripción es muy larga").optional(),
  stateId: z.number().min(1, "Debes seleccionar un estado"),
  dueDate: z.string().optional(),
})

type CreateTaskFormData = z.infer<typeof createTaskSchema>

export default function CreateTaskPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isLoading } = useAppSelector((state) => state.tasks)
  const { states } = useAppSelector((state) => state.states)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      stateId: states.find((s) => s.name.toLowerCase() === "pendiente")?.id || states[0]?.id,
      dueDate: "",
    },
  })

  useEffect(() => {
    if (states.length > 0) {
      const defaultState = states.find((s) => s.name.toLowerCase() === "pendiente") || states[0]
      setValue("stateId", defaultState.id)
    }
  }, [states, setValue])

  const onSubmit = async (data: CreateTaskFormData) => {
    try {
      const taskData = {
        ...data,
        description: data.description || undefined,
        dueDate: data.dueDate || undefined,
      }

      const result = await dispatch(createTask(taskData))

      if (createTask.fulfilled.match(result)) {
        toast.success("Tarea creada exitosamente")
        router.push("/tasks")
      }
    } catch (error) {
        console.error("Error al crear la tarea:", error)
      toast.error("Error al crear la tarea")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => router.back()} className="cursor-pointer">
          <ArrowLeft className="mr-2 h-4 w-4 " />
          Volver
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Crear Nueva Tarea</h1>
          <p className="text-gray-600">Completa los datos para crear una nueva tarea</p>
        </div>
      </div>

      {/* Formulario */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-black">Información de la Tarea</CardTitle>
          <CardDescription>Ingresa los detalles de la nueva tarea</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Titulo */}
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
                <option value="">Selecciona un estado</option>
                {states.map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </select>
              {errors.stateId && <p className="text-sm text-red-500">{errors.stateId.message}</p>}
            </div>

            {/* Due Date */}
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

            {/* Actions */}
            <div className="flex space-x-4 pt-4">
              <Button type="submit" disabled={isLoading} className="bg-green-600 text-white cursor-pointer">
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Creando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Crear Tarea
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()} className="cursor-pointer">
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
