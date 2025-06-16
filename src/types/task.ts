import type { StateDto } from "./state"

export interface TaskDto {
    id: number
    title: string
    description: string
    dueDate?: string
    createdAt: string
    updatedAt: string
    stateId: number
    state: StateDto
}

export interface CreateTaskDto {
    title: string
    description?: string
    stateId: number
    dueDate?: string
}

export interface UpdateTaskDto {
    title: string
    description?: string
    stateId: number
    dueDate?: string
}

export interface TaskState {
    tasks: TaskDto[]
    currentTask: TaskDto | null
    totalCount: number
    currentPage: number
    pageSize: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
    isLoading: boolean
    error: string | null
    filters: {
        stateId?: number
        dueDate?: string
        title?: string
    }
}
