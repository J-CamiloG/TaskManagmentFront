import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { StateState, StateDto, CreateStateDto, UpdateStateDto } from "@/types"
import api from "@/lib/axios"

const initialState: StateState = {
  states: [],
  currentState: null,
  isLoading: false,
  error: null,
}

// Thunks 
export const fetchStates = createAsyncThunk("states/fetchStates", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<StateDto[]>("/api/States")
    return response.data
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Error al cargar los estados"
    return rejectWithValue(errorMessage)
  }
})

export const fetchStateById = createAsyncThunk("states/fetchStateById", async (id: number, { rejectWithValue }) => {
  try {
    const response = await api.get<StateDto>(`/api/States/${id}`)
    return response.data
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Error al cargar el estado"
    return rejectWithValue(errorMessage)
  }
})

export const createState = createAsyncThunk(
  "states/createState",
  async (stateData: CreateStateDto, { rejectWithValue }) => {
    try {
      const response = await api.post<StateDto>("/api/States", stateData)
      return response.data
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al crear el estado"
      return rejectWithValue(errorMessage)
    }
  },
)

export const updateState = createAsyncThunk(
  "states/updateState",
  async ({ id, stateData }: { id: number; stateData: UpdateStateDto }, { rejectWithValue }) => {
    try {
      const response = await api.put<StateDto>(`/api/States/${id}`, stateData)
      return response.data
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al actualizar el estado"
      return rejectWithValue(errorMessage)
    }
  },
)

export const deleteState = createAsyncThunk("states/deleteState", async (id: number, { rejectWithValue }) => {
  try {
    await api.delete(`/api/States/${id}`)
    return id
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Error al eliminar el estado"
    return rejectWithValue(errorMessage)
  }
})

// Slice
const stateSlice = createSlice({
  name: "states",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCurrentState: (state) => {
      state.currentState = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch States
      .addCase(fetchStates.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchStates.fulfilled, (state, action) => {
        state.isLoading = false
        state.states = action.payload
      })
      .addCase(fetchStates.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Fetch State por ID
      .addCase(fetchStateById.fulfilled, (state, action) => {
        state.currentState = action.payload
      })
      // Crear State
      .addCase(createState.fulfilled, (state, action) => {
        state.states.push(action.payload)
      })
      // actualizar State
      .addCase(updateState.fulfilled, (state, action) => {
        const index = state.states.findIndex((s) => s.id === action.payload.id)
        if (index !== -1) {
          state.states[index] = action.payload
        }
      })
      // eliminar State
      .addCase(deleteState.fulfilled, (state, action) => {
        state.states = state.states.filter((s) => s.id !== action.payload)
      })
  },
})

export const { clearError, clearCurrentState } = stateSlice.actions
export default stateSlice.reducer

