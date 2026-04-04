import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { NextResponse } from "next/server"

const { auth: middleware } = NextAuth(authConfig)

export default middleware((req) => {
    const { nextUrl } = req
    const isLoggedIn = !!req.auth

    const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth")
    const isPublicRoute = [
        "/",
        "/search",
        "/faq",
        "/terms",
        "/privacy"
    ].includes(nextUrl.pathname) || 
    nextUrl.pathname.startsWith("/listings/") || 
    nextUrl.pathname.startsWith("/boutique/")

    const isAuthRoute = [
        "/auth/login",
        "/auth/register",
        "/auth/error",
        "/auth/forgot-password",
        "/auth/new-password",
    ].includes(nextUrl.pathname)

    // Allow API auth routes
    if (isApiAuthRoute) return NextResponse.next()

    // Redirect logged in users away from auth routes (login/register)
    if (isAuthRoute) {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL("/", nextUrl))
        }
        return NextResponse.next()
    }

    // Protect private routes
    if (!isLoggedIn && !isPublicRoute) {
        let callbackUrl = nextUrl.pathname
        if (nextUrl.search) {
            callbackUrl += nextUrl.search
        }
        const encodedCallbackUrl = encodeURIComponent(callbackUrl)
        return NextResponse.redirect(new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl))
    }

    return NextResponse.next()
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg)).*)"],
}
