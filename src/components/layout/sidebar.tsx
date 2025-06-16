"use client"

import { usePathname, useRouter } from "next/navigation"
import { Home, CheckSquare, Tag, X } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setSidebarOpen } from "@/store/slices/uiSlice"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Tareas", href: "/tasks", icon: CheckSquare },
  { name: "Estados", href: "/states", icon: Tag },
  // { name: "Reportes", href: "/reports", icon: BarChart3 },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { sidebarOpen } = useAppSelector((state) => state.ui)

  return (
    <>
      {sidebarOpen && <div className="fixed inset-0 z-40 lg:hidden" onClick={() => dispatch(setSidebarOpen(false))} />}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Menú</h2>
            <Button variant="ghost" size="icon" onClick={() => dispatch(setSidebarOpen(false))} className="lg:hidden">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* navecacion*/}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <button
                  key={item.name}
                  onClick={() => {
                    router.push(item.href)
                    dispatch(setSidebarOpen(false)) 
                  }}
                  className={cn(
                    "flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-blue-100 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                  )}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </button>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <div className="text-xs text-gray-500">
              <p>Task Management</p>
              <p>© 2024 </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
