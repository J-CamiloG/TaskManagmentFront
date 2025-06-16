"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Menu, Bell, User, LogOut } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { logoutUser } from "@/store/slices/authSlice"
import { toggleSidebar } from "@/store/slices/uiSlice"
import { Button } from "@/components/ui/button"
import { toast } from "react-hot-toast"

export function Header() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const [showUserMenu, setShowUserMenu] = useState(false)

  // Obtener las tareas
  const tasks = useAppSelector((state) => state.tasks.tasks)
  const totalTasksOnPage = tasks.length

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser())
      toast.success("Sesión cerrada correctamente")
      router.push("/login")
    } catch {
      toast.error("Error al cerrar sesión")
    }
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 text-black">
      <div className="flex items-center justify-between">
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => dispatch(toggleSidebar())} className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>

          <div className="hidden lg:block">
            <h1 className="text-xl font-semibold text-gray-900">Task Management</h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {totalTasksOnPage > 0 ? totalTasksOnPage : ""}
            </span>
          </Button>

          {/* User menu */}
          <div className="relative">
            <Button
              variant="ghost"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2"
            >
              <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="hidden md:block text-sm font-medium">{user?.username || "Usuario"}</span>
            </Button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                <div className="px-4 py-2 border-b">
                  <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>

                <button
                  onClick={() => {
                    setShowUserMenu(false)
                    handleLogout()
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="lg:hidden mt-2">
        <h1 className="text-lg font-semibold text-gray-900">Task Management</h1>
      </div>

      {showUserMenu && <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />}
    </header>
  )
}
