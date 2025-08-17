"use client"

import { useSession } from "next-auth/react"
import AuthButton from "@/components/auth-button"

export default function LandingPage() {
  const { data: session, status } = useSession()

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-950 dark:to-zinc-900">
      <div className="flex-1 flex items-center justify-center mx-auto max-w-4xl px-6">
        <div className="text-center">
          {/* Hero Section */}
          <div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              🍽️ Was gibt es heute zu essen?
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
              Diese tägliche Frage muss nicht mehr nerven. Lass dir spontan Gerichte vorschlagen oder plane gleich die ganze Woche!
            </p>
            <div className="mb-8">
              <AuthButton showGoToApp={true} />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Noch keinen Account?{" "}
              <a
                href="http://localhost:8080/realms/myrealm/protocol/openid-connect/registrations?client_id=food-suggestions&response_type=code&scope=openid&redirect_uri=http://localhost:3000/api/auth/callback/keycloak"
                className="font-medium underline underline-offset-4 hover:opacity-90"
              >
                Hier registrieren
              </a>
            </p>
          </div>
        </div>
      </div>

      <footer className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
        <p>&copy; 2025 Essensvorschläge & Planer. Alle Rechte vorbehalten.</p>
      </footer>
    </div>
  )
}
