"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchStates, deleteState } from "@/store/slices/stateSlice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Edit, Trash2, Tag, AlertTriangle } from "lucide-react"
import { toast } from "react-hot-toast"
import { formatDate } from "@/lib/utils"

export default function StatesPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const { states, isLoading } = useAppSelector((state) => state.states)
  const { tasks } = useAppSelector((state) => state.tasks)

  useEffect(() => {
    dispatch(fetchStates())
  }, [dispatch])

  const handleDeleteState = async (stateId: number, stateName: string) => {
    const associatedTasks = tasks.filter((task) => task.stateId === stateId)

    if (associatedTasks.length > 0) {
      toast.error(
        `No se puede eliminar el estado "${stateName}" porque tiene ${associatedTasks.length} tareas asociadas.`,
      )
      return
    }

    if (window.confirm(`¿Estás seguro de que quieres eliminar el estado "${stateName}"?`)) {
      try {
        await dispatch(deleteState(stateId))
        toast.success("Estado eliminado correctamente")
      } catch (error) {
        console.error("Error al eliminar el estado:", error)
        toast.error("Error al eliminar el estado")
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Estados</h1>
          <p className="text-gray-600">Administra los estados disponibles para las tareas</p>
        </div>
        <Button onClick={() => router.push("/states/create")} className="bg-gray-800 text-white cursor-pointer">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Estado
        </Button>
      </div>

      {/* lista */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : states.length > 0 ? (
          states.map((state) => {
            const associatedTasks = tasks.filter((task) => task.stateId === state.id)
            const canDelete = associatedTasks.length === 0

            return (
              <Card key={state.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Tag className="h-5 w-5 text-blue-600" />
                    <span className="text-black">{state.name}</span>
                  </CardTitle>
                  <CardDescription>{state.description || "Sin descripción"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Tareas asociadas:</span>
                      <span className="font-medium">{associatedTasks.length}</span>
                    </div>

                    <div className="text-xs text-gray-500">
                      <p>Creado: {formatDate(state.createdAt)}</p>
                      {state.updatedAt !== state.createdAt && <p>Actualizado: {formatDate(state.updatedAt)}</p>}
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => router.push(`/states/${state.id}/edit`)}>
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteState(state.id, state.name)}
                        disabled={!canDelete}
                        className={
                          !canDelete
                            ? "opacity-50 cursor-not-allowed"
                            : "text-red-600 hover:text-red-700 hover:bg-red-50"
                        }
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Eliminar
                      </Button>
                    </div>

                    {!canDelete && (
                      <div className="flex items-center space-x-2 p-2 bg-yellow-50 rounded-md">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <span className="text-xs text-yellow-700">No se puede eliminar: tiene tareas asociadas</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })
        ) : (
          <div className="col-span-full">
            <Card>
              <CardContent className="p-12 text-center">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Tag className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay estados</h3>
                <p className="text-gray-600 mb-4">Comienza creando el primer estado para las tareas.</p>
                <Button onClick={() => router.push("/states/create")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Primer Estado
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Informacion */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-black">Información sobre Estados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600 space-y-2">
            <p>• Los estados definen el progreso de las tareas en el sistema.</p>
            <p>• No puedes eliminar un estado que tenga tareas asociadas.</p>
            <p>• Se recomienda tener al menos los estados básicos: Pendiente, En Progreso, Completada.</p>
            <p>• Puedes crear estados personalizados según las necesidades de tu proyecto.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
