import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { TaskState, TaskDto, CreateTaskDto, UpdateTaskDto, TaskQueryParams, PagedResultDto } from "@/types"
import api from "@/lib/axios"

const initialState: TaskState = {
  tasks: [],
  currentTask: null,
  totalCount: 0,
  currentPage: 1,
  pageSize: 10,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
  isLoading: false,
  error: null,
  filters: {},
}

// Thunks 
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (params: TaskQueryParams = {}, { rejectWithValue }) => {
    try {
      const response = await api.get<PagedResultDto<TaskDto>>("/api/Tasks", { params })
      return response.data
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al cargar las tareas"
      return rejectWithValue(errorMessage)
    }
  },
)

export const fetchTaskById = createAsyncThunk("tasks/fetchTaskById", async (id: number, { rejectWithValue }) => {
  try {
    const response = await api.get<TaskDto>(`/api/Tasks/${id}`)
    return response.data
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Error al cargar la tarea"
    return rejectWithValue(errorMessage)
  }
})

export const createTask = createAsyncThunk("tasks/createTask", async (taskData: CreateTaskDto, { rejectWithValue }) => {
  try {
    const response = await api.post<TaskDto>("/api/Tasks", taskData)
    return response.data
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Error al crear la tarea"
    return rejectWithValue(errorMessage)
  }
})

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, taskData }: { id: number; taskData: UpdateTaskDto }, { rejectWithValue }) => {
    try {
      const response = await api.put<TaskDto>(`/api/Tasks/${id}`, taskData)
      return response.data
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al actualizar la tarea"
      return rejectWithValue(errorMessage)
    }
  },
)

export const deleteTask = createAsyncThunk("tasks/deleteTask", async (id: number, { rejectWithValue }) => {
  try {
    await api.delete(`/api/Tasks/${id}`)
    return id
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Error al eliminar la tarea"
    return rejectWithValue(errorMessage)
  }
})

// Slice
const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setFilters: (state, action: PayloadAction<Partial<TaskState["filters"]>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = {}
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload
    },
    clearCurrentTask: (state) => {
      state.currentTask = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tasks
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false
        state.tasks = action.payload.items
        state.totalCount = action.payload.totalCount
        state.currentPage = action.payload.page
        state.pageSize = action.payload.pageSize
        state.totalPages = action.payload.totalPages
        state.hasNextPage = action.payload.hasNextPage
        state.hasPreviousPage = action.payload.hasPreviousPage
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Fetch Task por ID
      .addCase(fetchTaskById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentTask = action.payload
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Crear Task
      .addCase(createTask.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false
        state.tasks.unshift(action.payload) 
        state.totalCount += 1
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // actualizaar Task
      .addCase(updateTask.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.tasks.findIndex((task) => task.id === action.payload.id)
        if (index !== -1) {
          state.tasks[index] = action.payload
        }
        if (state.currentTask?.id === action.payload.id) {
          state.currentTask = action.payload
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // eliminar Task
      .addCase(deleteTask.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.isLoading = false
        state.tasks = state.tasks.filter((task) => task.id !== action.payload)
        state.totalCount -= 1
        if (state.currentTask?.id === action.payload) {
          state.currentTask = null
        }
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, setFilters, clearFilters, setCurrentPage, setPageSize, clearCurrentTask } = taskSlice.actions
export default taskSlice.reducer
