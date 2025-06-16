export interface ApiResponse<T = unknown> {
    data: T
    message?: string
    success: boolean
}

export interface ApiError {
    message: string
    errors?: Record<string, string[]>
    statusCode: number
}

// Paginación
export interface PagedResultDto<T> {
    items: T[]
    totalCount: number
    page: number
    pageSize: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
}

// Parámetros de consulta para paginación y filtros
export interface TaskQueryParams {
    page?: number
    pageSize?: number
    stateId?: number
    dueDate?: string
    title?: string
}
