"use client"

import { signIn, getProviders } from "next-auth/react"
import { useEffect, useState } from "react"

export default function SignIn() {
  const [providers, setProviders] = useState<any>(null)

  useEffect(() => {
    const setAuthProviders = async () => {
      const res = await getProviders()
      setProviders(res)
    }
    setAuthProviders()
  }, [])

  if (!providers) {
    return (
      <main className="min-h-dvh flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 p-6 shadow-sm">
            <div className="h-6 w-40 bg-black/10 dark:bg-white/10 rounded mb-3"/>
            <div className="h-4 w-56 bg-black/10 dark:bg-white/10 rounded mb-6"/>
            <div className="h-10 w-full bg-black/10 dark:bg-white/10 rounded"/>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-dvh flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 p-6 shadow-sm">
          <header className="mb-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight">🍽️ Essensvorschläge & Planer</h1>
            <p className="mt-1 text-base text-zinc-600 dark:text-zinc-400">Melde dich an, um deine Pläne zu speichern.</p>
          </header>

          {/* Optional error from query string (e.g., ?error=OAuthCallback) */}
          {/* We don't import useSearchParams here to keep it lightweight; this is optional to add later. */}

          <div className="grid gap-3">
            {Object.values(providers).map((provider: any) => (
              <button
                key={provider.name}
                onClick={() => signIn(provider.id, { callbackUrl: "/home" })}
                className="group w-full px-4 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-black text-white dark:bg-white dark:text-black text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-black/30 dark:focus:ring-white/30 hover:opacity-95 active:opacity-90"
              >
                {provider.name === "Keycloak" ? (
                  <span className="inline-flex w-full items-center justify-center gap-2">
                    <span className="text-xl leading-none" role="img" aria-label="Keycloak">🔐</span>
                    <span>Anmelden mit Keycloak</span>
                  </span>
                ) : (
                  <span className="inline-flex w-full items-center justify-center gap-2">
                    <span className="text-base leading-none">🔑</span>
                    <span>Anmelden mit {provider.name}</span>
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="mt-2 grid gap-2">
            {/* Apple (coming soon) */}
            <div className="relative">
              <button
                type="button"
                disabled
                aria-disabled="true"
                className="w-full px-4 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-transparent text-sm font-medium opacity-60 cursor-not-allowed"
                title="Bald verfügbar"
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <span className="text-lg" aria-hidden></span>
                  <span>Mit Apple anmelden</span>
                </span>
              </button>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-zinc-700 dark:text-zinc-300">Bald verfügbar</span>
            </div>

            {/* Google (coming soon) */}
            <div className="relative">
              <button
                type="button"
                disabled
                aria-disabled="true"
                className="w-full px-4 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-transparent text-sm font-medium opacity-60 cursor-not-allowed"
                title="Bald verfügbar"
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <span className="text-lg" aria-hidden>🟡</span>
                  <span>Mit Google anmelden</span>
                </span>
              </button>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-zinc-700 dark:text-zinc-300">Bald verfügbar</span>
            </div>
          </div>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
            <span className="text-xs uppercase tracking-wide text-zinc-500">oder</span>
            <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
          </div>

          <div className="text-center text-sm text-zinc-600 dark:text-zinc-400">
            Noch keinen Account?{" "}
            <a
                href="http://localhost:8083/realms/myrealm/protocol/openid-connect/registrations?client_id=food-suggestions&response_type=code&scope=openid&redirect_uri=http://localhost:3000/api/auth/callback/keycloak"
                className="font-medium underline underline-offset-4 hover:opacity-90"
              >
                Hier registrieren
              </a>
          </div>
        </div>
        <footer className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="hover:opacity-80">Impressum</span>
              <span className="opacity-40 select-none">·</span>
              <span className="hover:opacity-80">Datenschutz</span>
              <span className="opacity-40 select-none">·</span>
              <span className="hover:opacity-80">AGB</span>
              <span className="opacity-40 select-none">·</span>
              <span className="opacity-70">Version v0.1.0</span>
            </div>
          </footer>
      </div>
    </main>
  )
}
