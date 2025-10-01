import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
    const isLogged = req.cookies.get("isLogged")?.value
    const { pathname } = req.nextUrl
    if (!isLogged) {
        return NextResponse.redirect(new URL("/login", req.url))
    }

    try {
        if(pathname === "/" && isLogged) {
            return NextResponse.redirect(new URL("/app", req.url))
        }
        return NextResponse.next()
    } catch (err) {
        console.error("Invalid token:", err)
        return NextResponse.redirect(new URL("/login", req.url))
    }
}

export const config = {
    matcher: ["/"]
}
