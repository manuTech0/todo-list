import withAuth, { NextRequestWithAuth } from "next-auth/middleware";
import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";

export default withAuth((req: NextRequestWithAuth): NextResponse => {
    const { pathname } = req.nextUrl
    const isAuth = !!req.nextauth!.token

    if(!isAuth && pathname.startsWith("/my-paper")) {
        return NextResponse.redirect(new URL("/", req.url))
    }

    if(isAuth && pathname == "/") {
        return NextResponse.redirect(new URL("/my-paper", req.url))
    }
    return NextResponse.next()
}, {
    callbacks: {
        authorized: () => true,
    }
})

export const config: MiddlewareConfig = {
    matcher: [ "/", "/my-paper", "/api" ]
}