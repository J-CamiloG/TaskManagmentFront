import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utilidad para formatear fechas
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date))
}

// Utilidad para formatear fecha y hora
export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

// Utilidad para validar si una fecha está vencida
export function isOverdue(dueDate: string): boolean {
  return new Date(dueDate) < new Date()
}

// Utilidad para obtener el color del estado
export function getStateColor(stateName: string): string {
  switch (stateName.toLowerCase()) {
    case "pendiente":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "en progreso":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "completada":
      return "bg-green-100 text-green-800 border-green-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}
