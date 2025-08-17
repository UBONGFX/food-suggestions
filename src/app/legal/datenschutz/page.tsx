"use client"

import { useRouter } from "next/navigation"

export default function DatenschutzPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-950 dark:to-zinc-900">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            ← Zurück
          </button>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              🔒 Datenschutzerklärung
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Schutz Ihrer persönlichen Daten
            </p>
          </div>

          <div className="bg-white/70 dark:bg-zinc-800/70 rounded-2xl p-8 border border-black/10 dark:border-white/10 space-y-8">
            
            {/* Allgemeine Hinweise */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                1. Allgemeine Hinweise
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten 
                passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie 
                persönlich identifiziert werden können.
              </p>
            </section>

            {/* Datenerfassung */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                2. Datenerfassung auf dieser Website
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    Wer ist verantwortlich für die Datenerfassung auf dieser Website?
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten 
                    können Sie dem Impressum dieser Website entnehmen.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    Wie erfassen wir Ihre Daten?
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich 
                    z.B. um Daten handeln, die Sie bei der Registrierung oder Anmeldung eingeben.
                  </p>
                </div>
              </div>
            </section>

            {/* Keycloak/Auth */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                3. Authentifizierung und Benutzerdaten
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    Keycloak-Authentifizierung
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    Diese Website nutzt Keycloak für die Benutzerauthentifizierung. Dabei werden folgende Daten verarbeitet:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 text-sm space-y-1 mt-2">
                    <li>Benutzername</li>
                    <li>E-Mail-Adresse</li>
                    <li>Vor- und Nachname</li>
                    <li>Anmelde- und Sitzungsdaten</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    Rechtsgrundlage
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO zur Erfüllung eines Vertrags 
                    oder vorvertraglicher Maßnahmen.
                  </p>
                </div>
              </div>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                4. Cookies und Session-Daten
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                Diese Website verwendet Cookies und Session-Daten für die Authentifizierung und zur Verbesserung der 
                Benutzererfahrung. Diese sind für den Betrieb der Website erforderlich und werden automatisch gelöscht, 
                wenn Sie sich abmelden oder Ihre Browser-Session beenden.
              </p>
            </section>

            {/* Ihre Rechte */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                5. Ihre Rechte
              </h2>
              <div className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                <p><strong>Auskunftsrecht:</strong> Sie haben das Recht auf Auskunft über Ihre gespeicherten Daten.</p>
                <p><strong>Berichtigungsrecht:</strong> Sie haben das Recht auf Berichtigung falscher Daten.</p>
                <p><strong>Löschungsrecht:</strong> Sie haben das Recht auf Löschung Ihrer Daten.</p>
                <p><strong>Widerspruchsrecht:</strong> Sie haben das Recht auf Widerspruch gegen die Datenverarbeitung.</p>
                <p><strong>Datenübertragbarkeit:</strong> Sie haben das Recht auf Datenübertragbarkeit.</p>
              </div>
            </section>

            {/* Datensicherheit */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                6. Datensicherheit
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                Wir verwenden geeignete technische und organisatorische Sicherheitsmaßnahmen, um Ihre Daten gegen 
                zufällige oder vorsätzliche Manipulationen, teilweisen oder vollständigen Verlust, Zerstörung oder 
                gegen den unbefugten Zugriff Dritter zu schützen.
              </p>
            </section>

            <div className="text-center pt-8 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Stand: {new Date().toLocaleDateString('de-DE')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
