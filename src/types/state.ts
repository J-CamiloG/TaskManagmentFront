export interface StateDto {
    id: number
    name: string
    description: string
    createdAt: string
    updatedAt: string
}

export interface CreateStateDto {
    name: string
    description?: string
}

export interface UpdateStateDto {
    name: string
    description?: string
}

export interface StateState {
    states: StateDto[]
    currentState: StateDto | null
    isLoading: boolean
    error: string | null
}
