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
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
        <span>Loading...</span>
      </div>
    )
  }

  if (!session) {
    // On landing page, navigate to sign-in page instead of direct sign-in
    if (showGoToApp) {
      return (
        <button
          onClick={() => router.push("/auth/signin")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Anmelden
        </button>
      )
    }
    
    // In other contexts, directly sign in
    return (
      <button
        onClick={() => signIn("keycloak", { callbackUrl: "/home" })}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Sign In
      </button>
    )
  }

  // When authenticated, only show "Go to App" if explicitly requested (landing page)
  if (showGoToApp) {
    return (
      <button
        onClick={() => router.push("/home")}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Go to App
      </button>
    )
  }

  // When authenticated and in the app, don't show anything
  return null
}
