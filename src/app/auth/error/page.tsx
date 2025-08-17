"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"

const errors: { [key: string]: string } = {
  Signin: "Versuche es mit einem anderen Account.",
  OAuthSignin: "Versuche es mit einem anderen Account.",
  OAuthCallback: "Versuche es mit einem anderen Account.",
  OAuthCreateAccount: "Versuche es mit einem anderen Account.",
  EmailCreateAccount: "Versuche es mit einem anderen Account.",
  Callback: "Versuche es mit einem anderen Account.",
  OAuthAccountNotLinked:
    "Bitte melde dich mit dem Account an, den du ursprünglich verwendet hast.",
  EmailSignin: "Bitte überprüfe deine E-Mail-Adresse.",
  CredentialsSignin:
    "Anmeldung fehlgeschlagen. Überprüfe deine Zugangsdaten.",
  default: "Anmeldung nicht möglich.",
}

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  return (
    <main className="min-h-dvh flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 p-6">
          <header className="mb-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight">⚠️ Fehler bei der Anmeldung</h1>
            <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
              {error && errors[error] ? errors[error] : errors.default}
            </p>
          </header>

          <div className="grid gap-3">
            <Link
              href="/auth/signin"
              className="w-full px-4 py-2 rounded-md bg-black text-white dark:bg-white dark:text-black border border-black/10 dark:border-white/10 hover:opacity-90 text-sm font-medium text-center"
            >
              Erneut versuchen
            </Link>
          </div>

          <footer className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Link href="/legal/impressum" className="hover:opacity-80 hover:underline transition-all duration-200">
                Impressum
              </Link>
              <span className="opacity-40 select-none">·</span>
              <Link href="/legal/datenschutz" className="hover:opacity-80 hover:underline transition-all duration-200">
                Datenschutz
              </Link>
              <span className="opacity-40 select-none">·</span>
              <Link href="/legal/agb" className="hover:opacity-80 hover:underline transition-all duration-200">
                AGB
              </Link>
              <span className="opacity-40 select-none">·</span>
              <span className="opacity-70">Version v0.1.0</span>
            </div>
          </footer>
        </div>
      </div>
    </main>
  )
}
