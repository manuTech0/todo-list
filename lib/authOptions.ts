import { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"


export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    scope: "openid email profile https://www.googleapis.com/auth/drive.file",
                    access_type: "offline",
                    prompt: "consent"
                }
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async session({ session, token }) {
            session.accessToken = token.access_token as string
            session.refreshToken = token.refresh_token as string
            session.useDriveScope = token.useDriveScope as boolean
            if(session.user) {
                session.user.email = token.sub
            }
            return session
        },
        async jwt({ token, user, account }) {
            if(account) {
                token.useDriveScope = account.scope?.includes("https://www.googleapis.com/auth/drive.file")
                token.accessToken = account.access_token
                token.refreshToken = account.refresh_token
            }
            if(user) {
                token.id = user.id
            }
            return token
        }
    }
}