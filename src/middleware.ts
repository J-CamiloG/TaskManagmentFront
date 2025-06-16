import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Rutas auth
const protectedRoutes = ["/dashboard", "/tasks", "/states", "/reports"]

// Rutas publicas
const authRoutes = ["/login", "/register"]

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Obtener token 
    const token = request.cookies.get("auth-token")?.value

    // Verificar si la ruta está protegida
    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))


    // Ruta protegida y vadidacion Redirect Login
    if (isProtectedRoute && !token) {
        const loginUrl = new URL("/login", request.url)
        loginUrl.searchParams.set("redirect", pathname)
        return NextResponse.redirect(loginUrl)
    }

    // Ruta de autenticación y validación Redirect Dashboard
    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    // Redirecion desde la razil 
    if (pathname === "/" && token) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    if (pathname === "/" && !token) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
        * No aplicar Middleware en: *
        * - api (API routes)
        * - _next/static (static files)
        * - _next/image (image optimization files)
        * - favicon.ico (favicon file)
        */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
}

