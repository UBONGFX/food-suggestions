"use client"

import { useSession } from "next-auth/react"
import AuthButton from "@/components/auth-button"

export default function LandingPage() {
  const { data: session, status } = useSession()

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-950 dark:to-zinc-900">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="text-center">
          {/* Hero Section */}
          <div className="py-24">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              🍽️ Essensvorschläge & Planer
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
              <span className="text-red-600 dark:text-red-400 font-semibold">"Was gibt es heute zu essen?"</span>
              <br />Diese tägliche Frage muss nicht mehr nerven. Lass dir spontan Gerichte vorschlagen oder plane gleich die ganze Woche!
            </p>
            <div className="mb-8">
              <AuthButton showGoToApp={true} />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Noch keinen Account?{" "}
              <a
                href="http://localhost:8083/realms/myrealm/protocol/openid-connect/registrations?client_id=food-suggestions&response_type=code&scope=openid&redirect_uri=http://localhost:3000/api/auth/callback/keycloak"
                className="font-medium underline underline-offset-4 hover:opacity-90"
              >
                Hier registrieren
              </a>
            </p>
          </div>
          {/* Marketing: Die Probleme kennt jeder */}
          <section className="py-16">
            <div className="max-w-5xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Die Probleme kennt jeder
              </h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-12 max-w-2xl mx-auto">
                Wer kennt es nicht? Keine Zeit, keine Idee, keine Lust – und am Ende gibt’s
                doch wieder das Gleiche. Wir haben die typischen Alltagsprobleme gesammelt:
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Problem 1 */}
                <div className="text-center p-6 rounded-xl bg-white/50 dark:bg-zinc-800/50 border border-black/10 dark:border-white/10 shadow-sm hover:shadow-md transition">
                  <div className="text-4xl mb-4">⏱️</div>
                  <h3 className="font-semibold text-lg mb-2">Keine Zeit</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Nach der Arbeit noch ewig in der Küche stehen? Fehlanzeige.
                  </p>
                </div>

                {/* Problem 2 */}
                <div className="text-center p-6 rounded-xl bg-white/50 dark:bg-zinc-800/50 border border-black/10 dark:border-white/10 shadow-sm hover:shadow-md transition">
                  <div className="text-4xl mb-4">🤔</div>
                  <h3 className="font-semibold text-lg mb-2">Keine Idee</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Jeden Tag dieselbe Frage: „Was koche ich heute?“
                  </p>
                </div>

                {/* Problem 3 */}
                <div className="text-center p-6 rounded-xl bg-white/50 dark:bg-zinc-800/50 border border-black/10 dark:border-white/10 shadow-sm hover:shadow-md transition">
                  <div className="text-4xl mb-4">😴</div>
                  <h3 className="font-semibold text-lg mb-2">Keine Lust</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Motivation gleich null – aber Hunger trotzdem groß.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Transition from problems to features */}
          <div className="py-6">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex items-center gap-3 justify-center mb-3">
                <div className="h-px w-10 bg-black/10 dark:bg-white/10"></div>
                <span className="text-xs uppercase tracking-wide text-zinc-500">Wie wir das lösen</span>
                <div className="h-px w-10 bg-black/10 dark:bg-white/10"></div>
              </div>
              <p className="text-base text-zinc-600 dark:text-zinc-400">
                Aus den typischen Engpässen leiten wir klare Funktionen ab – so kommst du vom Problem direkt zur Lösung.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6 rounded-xl bg-white/50 dark:bg-zinc-800/50 border border-black/10 dark:border-white/10">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-lg font-semibold mb-2">Intelligente Vorschläge</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Personalisierte Mahlzeiten-Empfehlungen basierend auf deinen Vorlieben und Ernährungsgewohnheiten.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-white/50 dark:bg-zinc-800/50 border border-black/10 dark:border-white/10">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-lg font-semibold mb-2">Wochenplanung</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Plane deine gesamte Woche im Voraus. Nie wieder "Was koche ich heute?" fragen müssen.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-white/50 dark:bg-zinc-800/50 border border-black/10 dark:border-white/10">
              <div className="text-4xl mb-4">🧾</div>
              <h3 className="text-lg font-semibold mb-2">Automatische Listen</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Einkaufslisten werden automatisch erstellt. Einfach mit der Familie teilen und abhaken.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className={`rounded-2xl p-8 border ${session
            ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700"
            : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700"
            }`}>
            {session ? (
              <>
                <h2 className="text-2xl font-bold mb-4">Willkommen zurück!</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Dein Essensplaner wartet auf dich. Setze da fort, wo du aufgehört hast und entdecke neue Rezepte.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-4">Bereit für stressfreie Essensplanung?</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Melde dich mit deinem Keycloak-Account an und starte noch heute mit der intelligenten Mahlzeitenplanung.
                </p>
              </>
            )}
            <AuthButton showGoToApp={true} />
          </div>
        </div>
      </div>

      <footer className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
        <p>&copy; 2025 Essensvorschläge & Planer. Alle Rechte vorbehalten.</p>
      </footer>
    </div>
  )
}
