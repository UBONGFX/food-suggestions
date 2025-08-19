"use client"

import { useSession, signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

interface AuthButtonProps {
  showGoToApp?: boolean
}

export default function AuthButton({ showGoToApp = false }: AuthButtonProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === "loading") {
    return (
      <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-zinc-600 dark:border-zinc-300"></div>
        <span>Wird geladen...</span>
      </div>
    )
  }

  if (!session) {
    // On landing page, navigate to sign-in page instead of direct sign-in
    if (showGoToApp) {
      return (
        <button
          onClick={() => router.push("/auth/signin")}
          className="w-full max-w-sm mx-auto px-4 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-black text-white dark:bg-white dark:text-black text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-black/30 dark:focus:ring-white/30 hover:opacity-95 active:opacity-90"
        >
          Anmelden
        </button>
      )
    }
    
    // In other contexts, directly sign in
    return (
      <button
        onClick={() => signIn("keycloak", { callbackUrl: "/lists" })}
        className="w-full max-w-sm mx-auto px-4 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-black text-white dark:bg-white dark:text-black text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-black/30 dark:focus:ring-white/30 hover:opacity-95 active:opacity-90"
      >
        Sign In
      </button>
    )
  }

  // When authenticated, only show "Go to App" if explicitly requested (landing page)
  if (showGoToApp) {
    return (
      <button
        onClick={() => router.push("/lists")}
        className="w-full max-w-sm mx-auto px-4 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-black text-white dark:bg-white dark:text-black text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-black/30 dark:focus:ring-white/30 hover:opacity-95 active:opacity-90"
      >
        Zur App
      </button>
    )
  }

  // When authenticated and in the app, don't show anything
  return null
}
