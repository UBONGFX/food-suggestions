"use client"

import { useRouter } from "next/navigation"

export default function ImpressumPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-950 dark:to-zinc-900">
      {/* Top Bar */}
      <div className="mx-auto w-full max-w-5xl px-6 py-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm rounded-lg border border-black/10 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 px-3 py-1.5 hover:bg-black/5 dark:hover:bg-white/10 transition"
        >
          <span>←</span>
          <span>Zurück</span>
        </button>
      </div>

      {/* Hero */}
      <header className="mx-auto w-full max-w-5xl px-6">
        <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 backdrop-blur p-8 text-center shadow-sm">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">📋 Impressum</h1>
          <p className="mt-2 text-base md:text-lg text-zinc-600 dark:text-zinc-400">Angaben gemäß § 5 TMG</p>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto w-full max-w-5xl px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Anbieter */}
          <article className="rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 rounded-full bg-black/5 dark:bg-white/10 grid place-items-center text-lg">🏢</div>
              <h2 className="text-lg font-semibold">Anbieter</h2>
            </div>
            <div className="space-y-1 text-zinc-700 dark:text-zinc-300">
              <p className="font-medium">Food Suggestions App</p>
              <p>Jordi Isken</p>
              <p>Musterstraße 123</p>
              <p>12345 Musterstadt</p>
              <p>Deutschland</p>
            </div>
          </article>

          {/* Kontakt */}
          <article className="rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 rounded-full bg-black/5 dark:bg-white/10 grid place-items-center text-lg">✉️</div>
              <h2 className="text-lg font-semibold">Kontakt</h2>
            </div>
            <div className="space-y-1 text-zinc-700 dark:text-zinc-300">
              <p><span className="font-medium">E‑Mail:</span> jordi@isken-ag.de</p>
              <p><span className="font-medium">Telefon:</span> +49 (0) 123 456789</p>
            </div>
          </article>

          {/* Verantwortlich */}
          <article className="rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 rounded-full bg-black/5 dark:bg-white/10 grid place-items-center text-lg">🖊️</div>
              <h2 className="text-lg font-semibold">Verantwortlich (RStV §55 Abs. 2)</h2>
            </div>
            <div className="space-y-1 text-zinc-700 dark:text-zinc-300">
              <p>Jordi Isken</p>
              <p>Musterstraße 123</p>
              <p>12345 Musterstadt</p>
            </div>
          </article>
        </div>

        {/* Legal text */}
        <section className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 p-6 md:p-8 shadow-sm space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-2">Haftung für Inhalte</h3>
            <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht unter der Verpflichtung, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Haftung für Links</h3>
            <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Urheberrecht</h3>
            <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
          </div>

          <div className="pt-4 border-t border-black/10 dark:border-white/10 text-center">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Stand: {new Date().toLocaleDateString('de-DE')}</p>
          </div>
        </section>
      </main>

      {/* Footer spacer (copyright handled globally) */}
      <div className="pb-8" />
    </div>
  )
}
