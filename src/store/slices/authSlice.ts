import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { AuthState, LoginDto, RegisterDto, AuthResponseDto, User } from "@/types"
import api from "@/lib/axios"

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

//  cookies Y localStorage
const saveAuthData = (token: string, user: User) => {

  localStorage.setItem("token", token)
  localStorage.setItem("user", JSON.stringify(user))

  document.cookie = `auth-token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`
  document.cookie = `auth-user=${JSON.stringify(user)}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`

  console.log("guardado --- ", {
    token: token,
    user: {
      username: user.username,
      email: user.email,
    },
  })
}

// limpiar auth data
const clearAuthData = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("user")

  document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
  document.cookie = "auth-user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"

}

// Thunks
export const loginUser = createAsyncThunk("auth/login", async (credentials: LoginDto, { rejectWithValue }) => {
  try {
    const response = await api.post<AuthResponseDto>("/api/Auth/login", credentials)

    const authData = response.data

    const user: User = {
      username: authData.username,
      email: authData.email,
    }

    const loginResponse = {
      token: authData.token,
      user: user,
      expiresAt: authData.expiresAt,
    }

    // localStorage Y cookies
    saveAuthData(authData.token, user)

    return loginResponse
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Error al iniciar sesión"
    return rejectWithValue(errorMessage)
  }
})

export const registerUser = createAsyncThunk("auth/register", async (userData: RegisterDto, { rejectWithValue }) => {
  try {
    const response = await api.post<AuthResponseDto>("/api/Auth/register", userData)
    const authData = response.data

    const user: User = {
      username: authData.username,
      email: authData.email,
    }

    const registerResponse = {
      token: authData.token,
      user: user,
      expiresAt: authData.expiresAt,
    }

    // localStorage Y cookies
    saveAuthData(authData.token, user)

    return registerResponse
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Error al registrarse"
    return rejectWithValue(errorMessage)
  }
})

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  clearAuthData()
})

export const checkAuthStatus = createAsyncThunk("auth/checkStatus", async (_, { rejectWithValue }) => {
  const token = localStorage.getItem("token")
  const userStr = localStorage.getItem("user")

  if (!token || !userStr) {
    throw new Error("No hay sesión activa")
  }

  try {
    await api.get("/api/States")

    const user = JSON.parse(userStr)

    if (typeof document !== "undefined") {
      saveAuthData(token, user)
    }

    return { token, user }
  } catch {
    clearAuthData()
    return rejectWithValue("Token inválido")
  }
})

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = false
        state.user = null
        state.token = null
        state.error = action.payload as string
      })
      // Registrar
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.error = null
      })
      // ver estado de autenticación
      .addCase(checkAuthStatus.pending, (state) => {
        state.isLoading = true
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.isLoading = false
        state.user = null
        state.token = null
        state.isAuthenticated = false
      })
  },
})

export const { clearError, setLoading } = authSlice.actions
export default authSlice.reducer
