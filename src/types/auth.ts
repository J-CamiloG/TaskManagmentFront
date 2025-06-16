export interface User {
    id?: number
    username: string
    email: string
    createdAt?: string
    updatedAt?: string
}

export interface LoginDto {
    email: string
    password: string
}

export interface RegisterDto {
    username: string
    email: string
    password: string
}

export interface AuthResponseDto {
    token: string
    username: string
    email: string
    expiresAt: string
}

export interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null
}
