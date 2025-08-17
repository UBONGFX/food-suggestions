import NextAuth from "next-auth"
import Keycloak from "next-auth/providers/keycloak"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Keycloak({
            clientId: process.env.KEYCLOAK_ID!,
            clientSecret: process.env.KEYCLOAK_SECRET!,
            issuer: process.env.KEYCLOAK_ISSUER!,
        }),
    ],
    pages: {
        signIn: "/auth/signin",
        error: "/auth/error",
    },
    callbacks: {
        async redirect({ url, baseUrl }) {
            // After successful login, redirect to /home
            if (url === baseUrl || url === `${baseUrl}/`) {
                return `${baseUrl}/home`
            }
            // If the url is relative, make it absolute
            if (url.startsWith("/")) {
                return `${baseUrl}${url}`
            }
            // Allow callback URLs on the same origin
            if (new URL(url).origin === baseUrl) {
                return url
            }
            return `${baseUrl}/home`
        },
    },
})
