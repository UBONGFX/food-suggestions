import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default auth((req: NextRequest & { auth: any }) => {
    const { nextUrl } = req
    const isLoggedIn = !!req.auth

    console.log(`[Middleware] ${nextUrl.pathname} - Logged in: ${isLoggedIn}`)

    // Define public routes (routes that don't require authentication)
    const publicRoutes = [
        '/auth/signin',
        '/auth/error',
        '/', // Root is now the landing page (public)
    ]

    // Protected routes
    const protectedRoutes = [
        '/home',
        '/dashboard',
    ]

    // Check if the current path is a public route
    const isPublicRoute = publicRoutes.some(route => nextUrl.pathname === route || nextUrl.pathname.startsWith(route))
    const isProtectedRoute = protectedRoutes.some(route => nextUrl.pathname.startsWith(route))

    console.log(`[Middleware] Public: ${isPublicRoute}, Protected: ${isProtectedRoute}`)

    // If user is not logged in and trying to access a protected route
    if (!isLoggedIn && isProtectedRoute) {
        console.log(`[Middleware] Redirecting to sign-in: ${nextUrl.pathname}`)
        // Redirect to sign-in with callback to the protected route
        const signInUrl = new URL('/auth/signin', nextUrl.origin)
        signInUrl.searchParams.set('callbackUrl', nextUrl.href)
        return NextResponse.redirect(signInUrl)
    }

    // If user is logged in and trying to access auth pages, redirect to home
    if (isLoggedIn && (nextUrl.pathname.startsWith('/auth'))) {
        console.log(`[Middleware] Redirecting authenticated user to home`)
        return NextResponse.redirect(new URL('/home', nextUrl.origin))
    }

    return NextResponse.next()
})

// Configure which routes to run middleware on
export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}
