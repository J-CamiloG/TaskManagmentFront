"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchTasks, deleteTask, setFilters, setCurrentPage, clearFilters } from "@/store/slices/taskSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Search, Filter, Edit, Trash2, Calendar, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "react-hot-toast"
import { formatDate, isOverdue, getStateColor } from "@/lib/utils"

export default function TasksPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const { tasks, isLoading, totalCount, currentPage, pageSize, totalPages, hasNextPage, hasPreviousPage, filters } =
    useAppSelector((state) => state.tasks)

  const { states } = useAppSelector((state) => state.states)

  const [searchTerm, setSearchTerm] = useState(filters.title || "")
  const [selectedState, setSelectedState] = useState(filters.stateId?.toString() || "")
  const [selectedDate, setSelectedDate] = useState(filters.dueDate || "")
  const [showFilters, setShowFilters] = useState(false)

  // Cargar tareas
  useEffect(() => {
    dispatch(
      fetchTasks({
        page: currentPage,
        pageSize,
        ...filters,
      }),
    )
  }, [dispatch, currentPage, pageSize, filters])

  // Aplicar filtros
  const handleApplyFilters = () => {
    const newFilters = {
      title: searchTerm || undefined,
      stateId: selectedState ? Number.parseInt(selectedState) : undefined,
      dueDate: selectedDate || undefined,
    }

    dispatch(setFilters(newFilters))
    dispatch(setCurrentPage(1)) 
  }

  // Limpiar filtros
  const handleClearFilters = () => {
    setSearchTerm("")
    setSelectedState("")
    setSelectedDate("")
    dispatch(clearFilters())
    dispatch(setCurrentPage(1))
  }

  // Eliminar tarea
  const handleDeleteTask = async (taskId: number, taskTitle: string) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar la tarea "${taskTitle}"?`)) {
      try {
        await dispatch(deleteTask(taskId))
        toast.success("Tarea eliminada correctamente")

        // Recargar la página actual
        dispatch(
          fetchTasks({
            page: currentPage,
            pageSize,
            ...filters,
          }),
        )
      } catch {
        toast.error("Error al eliminar la tarea")
      }
    }
  }

  // Cambiar página
  const handlePageChange = (newPage: number) => {
    dispatch(setCurrentPage(newPage))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Tareas</h1>
          <p className="text-gray-600">{totalCount > 0 ? `${totalCount} tareas encontradas` : "No hay tareas"}</p>
        </div>
        <Button onClick={() => router.push("/tasks/create")} className="bg-gray-800 cursor-pointer">
          <Plus className="mr-2 h-4 w-4" />
          Nueva Tarea
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-black">Filtros</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} >
              <Filter className="mr-2 h-4 w-4" />
              {showFilters ? "Ocultar" : "Mostrar"} Filtros
            </Button>
          </div>
        </CardHeader>

        {showFilters && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search" className="text-black">Buscar por título</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="search"
                    placeholder="Buscar tareas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="state" className="text-black">Filtrar por estado</Label>
                <select
                  id="state"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full h-10 px-3 py-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Todos los estados</option>
                  {states.map((state) => (
                    <option key={state.id} value={state.id}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate" className="text-black">Filtrar por fecha límite</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleApplyFilters} className="bg-green-600 text-white">Aplicar Filtros</Button>
              <Button variant="outline" onClick={handleClearFilters}>
                Limpiar Filtros
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* lista tareas */}
      <div className="space-y-4">
        {isLoading ? (
          [...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                  <div className="flex space-x-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : tasks.length > 0 ? (

          tasks.map((task) => (
            <Card key={task.id} className={`task-card ${isOverdue(task.dueDate || "") ? "task-overdue" : ""}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                      {task.dueDate && isOverdue(task.dueDate) && <AlertCircle className="h-4 w-4 text-red-500" />}
                    </div>

                    {task.description && <p className="text-gray-600">{task.description}</p>}

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Creada: {formatDate(task.createdAt)}</span>
                      {task.dueDate && (
                        <span className="flex items-center">
                          <Calendar className="mr-1 h-3 w-3" />
                          Vence: {formatDate(task.dueDate)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {task.state ? (
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full border ${getStateColor(task.state.name)}`}
                      >
                        {task.state.name}
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs font-medium rounded-full border bg-gray-100 text-gray-800 border-gray-200">
                        Sin estado
                      </span>
                    )}

                    <Button variant="outline" size="icon" onClick={() => router.push(`/tasks/${task.id}/edit`)}>
                      <Edit className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteTask(task.id, task.title)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Plus className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay tareas</h3>
              <p className="text-gray-600 mb-4">
                {Object.keys(filters).length > 0
                  ? "No se encontraron tareas con los filtros aplicados."
                  : "Comienza creando tu primera tarea."}
              </p>
              <Button onClick={() => router.push("/tasks/create")}>
                <Plus className="mr-2 h-4 w-4" />
                Crear Primera Tarea
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Mostrando {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalCount)} de{" "}
                {totalCount} tareas
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!hasPreviousPage}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>

                <span className="text-sm text-gray-600">
                  Página {currentPage} de {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!hasNextPage}
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
