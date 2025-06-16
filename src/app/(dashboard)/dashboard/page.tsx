
"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchTasks } from "@/store/slices/taskSlice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckSquare, Clock, AlertCircle, Plus, TrendingUp, Tag } from "lucide-react"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDate, isOverdue, getStateColor } from "@/lib/utils"

export default function DashboardPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { tasks, isLoading, totalCount } = useAppSelector((state) => state.tasks)
  const { states } = useAppSelector((state) => state.states)

  useEffect(() => {
    dispatch(fetchTasks({ page: 1, pageSize: 5 }))
  }, [dispatch])

  // estadísticas 
  const pendingTasks = tasks.filter((task) => task.state?.name?.toLowerCase() === "pendiente").length
  const inProgressTasks = tasks.filter((task) => task.state?.name?.toLowerCase() === "en progreso").length
  const overdueTasks = tasks.filter((task) => task.dueDate && isOverdue(task.dueDate)).length

  const stats = [
    {
      title: "Total de Tareas",
      value: totalCount,
      icon: CheckSquare,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Pendientes",
      value: pendingTasks,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "En Progreso",
      value: inProgressTasks,
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Vencidas",
      value: overdueTasks,
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Bienvenido de vuelta, {user?.username}!</p>
        </div>
        <Button onClick={() => router.push("/tasks/create")} className="bg-gray-800 cursor-pointer">
          <Plus className="mr-2 h-4 w-4 \" />
          Nueva Tarea
        </Button>
      </div>

      {/*Carts cabecera inforamcion*/}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <span className="text-2xl font-bold text-gray-900 block">
                      {isLoading ? <Skeleton className="h-8 w-12" /> : stat.value}
                    </span>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* tareas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-black">Tareas Recientes</CardTitle>
            <CardDescription>Las últimas tareas creadas</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <Skeleton className="h-4 w-4 rounded" />
                    <div className="space-y-1 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : tasks.length > 0 ? (
              <div className="space-y-3">
                {tasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{task.title}</h4>
                      <p className="text-sm text-gray-600">
                        {task.dueDate ? `Vence: ${formatDate(task.dueDate)}` : "Sin fecha límite"}
                      </p>
                    </div>
                    {/* ARREGLADO: Validar que task.state existe */}
                    {task.state && (
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full border ${getStateColor(task.state.name)}`}
                      >
                        {task.state.name}
                      </span>
                    )}
                    {/* Mostrar estado por defecto si no existe */}
                    {!task.state && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full border bg-gray-100 text-gray-800 border-gray-200">
                        Sin estado
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <CheckSquare className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay tareas</h3>
                <p className="mt-1 text-sm text-gray-500">Comienza creando tu primera tarea.</p>
                <Button onClick={() => router.push("/tasks/create")} className="mt-4" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Tarea
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* stados */}
        <Card>
          <CardHeader>
            <CardTitle className="text-black">Estados Disponibles</CardTitle>
            <CardDescription>Estados configurados en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            {states.length > 0 ? (
              <div className="space-y-3">
                {states.map((state) => (
                  <div key={state.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{state.name}</h4>
                      <p className="text-sm text-gray-600">{state.description}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStateColor(state.name)}`}>
                      {tasks.filter((task) => task.stateId === state.id).length} tareas
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Tag className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay estados</h3>
                <p className="mt-1 text-gray-500">Los estados se cargarán automáticamente.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
