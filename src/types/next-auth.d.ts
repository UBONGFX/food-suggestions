import { DefaultSession, DefaultJWT } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
    interface Session {
        accessToken?: string
        refreshToken?: string
        idToken?: string
        user: {
            id: string
        } & DefaultSession["user"]
    }

    interface User {
        id: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string
        refreshToken?: string
        idToken?: string
        exp?: number
        user?: any
    }
}
