import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const tokenCookie = (await cookies()).get("token")?.value
    if(tokenCookie) {
        const token: {
            access_token: string,
            expires_in: Date,
            token_type: string
        } = JSON.parse(tokenCookie)
        if(token.access_token) {
            const res = NextResponse.redirect(new URL("/", req.url))
            res.cookies.set("token", token.access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV == "production",
                sameSite: "strict",
                path: "/",
                maxAge: Math.floor(new Date(token.expires_in).getTime() / 1000)
            })
            res.cookies.set("isLogged", String(new Date(token.expires_in)), {
                httpOnly: false,
                secure: process.env.NODE_ENV == "production",
                sameSite: "strict",
                path: "/",
                maxAge: Math.floor(new Date(token.expires_in).getTime() / 1000)
            })
            return res
        }
    }
    console.log(tokenCookie)
    return NextResponse.json({
        error: true,
        message: "Invalid Token"
    })
}