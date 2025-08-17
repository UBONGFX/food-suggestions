"use client"

import { useRouter } from "next/navigation"

export default function AGBPage() {
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
              📜 Allgemeine Geschäftsbedingungen
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Nutzungsbedingungen für die Food Suggestions App
            </p>
          </div>

          <div className="bg-white/70 dark:bg-zinc-800/70 rounded-2xl p-8 border border-black/10 dark:border-white/10 space-y-8">
            
            {/* Geltungsbereich */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                1. Geltungsbereich
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für die Nutzung der Food Suggestions App, 
                einer Webanwendung zur Essensplanung und Rezeptverwaltung. Durch die Registrierung und Nutzung 
                der App erklären Sie sich mit diesen Bedingungen einverstanden.
              </p>
            </section>

            {/* Leistungsbeschreibung */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                2. Leistungsbeschreibung
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300 text-sm">
                <p>Die Food Suggestions App bietet folgende Funktionen:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Essensplanung und Menüvorschläge</li>
                  <li>Rezeptverwaltung und -sammlung</li>
                  <li>Einkaufslisten-Erstellung</li>
                  <li>Benutzerprofil-Verwaltung</li>
                  <li>Personalisierte Empfehlungen</li>
                </ul>
              </div>
            </section>

            {/* Registrierung und Nutzerkonto */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                3. Registrierung und Nutzerkonto
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300 text-sm">
                <div>
                  <h3 className="font-semibold mb-2">3.1 Registrierung</h3>
                  <p className="leading-relaxed">
                    Für die vollständige Nutzung der App ist eine Registrierung erforderlich. Bei der Registrierung 
                    sind wahrheitsgemäße und vollständige Angaben zu machen.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">3.2 Nutzerkonto</h3>
                  <p className="leading-relaxed">
                    Der Nutzer ist verpflichtet, die Zugangsdaten vertraulich zu behandeln und vor unbefugtem 
                    Zugriff zu schützen. Bei Verdacht auf Missbrauch ist der Betreiber unverzüglich zu informieren.
                  </p>
                </div>
              </div>
            </section>

            {/* Nutzungsrechte und -pflichten */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                4. Nutzungsrechte und -pflichten
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300 text-sm">
                <div>
                  <h3 className="font-semibold mb-2">4.1 Erlaubte Nutzung</h3>
                  <p className="leading-relaxed">
                    Die App darf nur für persönliche, nicht-kommerzielle Zwecke genutzt werden. 
                    Eine Weiterverbreitung oder kommerzielle Nutzung ist nicht gestattet.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">4.2 Verbotene Handlungen</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Störung des Betriebs der App</li>
                    <li>Umgehung von Sicherheitsmaßnahmen</li>
                    <li>Verbreitung von schädlicher Software</li>
                    <li>Verletzung von Rechten Dritter</li>
                    <li>Missbrauch der Kommunikationsfunktionen</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Verfügbarkeit */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                5. Verfügbarkeit
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                Eine 100%ige Verfügbarkeit der App kann nicht garantiert werden. Wartungsarbeiten, 
                technische Störungen oder höhere Gewalt können zu temporären Ausfällen führen. 
                Wir bemühen uns um eine möglichst hohe Verfügbarkeit.
              </p>
            </section>

            {/* Haftung */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                6. Haftung
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300 text-sm">
                <p>
                  Die Haftung für Schäden, die aus der Nutzung der App entstehen, ist auf Vorsatz und 
                  grobe Fahrlässigkeit beschränkt. Die Rezepte und Ernährungsempfehlungen dienen nur als 
                  Vorschläge und ersetzen keine professionelle Ernährungsberatung.
                </p>
                <p>
                  Der Nutzer ist selbst dafür verantwortlich, die Eignung von Rezepten und Zutaten für 
                  seine individuellen Bedürfnisse (Allergien, Unverträglichkeiten, etc.) zu prüfen.
                </p>
              </div>
            </section>

            {/* Kündigung */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                7. Kündigung
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                Das Nutzungsverhältnis kann jederzeit von beiden Seiten ohne Angabe von Gründen beendet werden. 
                Bei einem Verstoß gegen diese AGB kann der Account gesperrt werden. Nach der Kündigung werden 
                die Nutzerdaten gemäß unserer Datenschutzerklärung behandelt.
              </p>
            </section>

            {/* Änderungen */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                8. Änderungen der AGB
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                Wir behalten uns vor, diese AGB bei Bedarf zu ändern. Nutzer werden über wesentliche 
                Änderungen informiert. Die Fortsetzung der Nutzung nach einer Änderung gilt als Zustimmung 
                zu den neuen Bedingungen.
              </p>
            </section>

            {/* Schlussbestimmungen */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                9. Schlussbestimmungen
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300 text-sm">
                <p>
                  Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts. Gerichtsstand ist der 
                  Sitz des Betreibers, sofern der Nutzer Kaufmann, juristische Person des öffentlichen 
                  Rechts oder öffentlich-rechtliches Sondervermögen ist.
                </p>
                <p>
                  Sollten einzelne Bestimmungen unwirksam sein, bleibt die Wirksamkeit der übrigen 
                  Bestimmungen unberührt.
                </p>
              </div>
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
