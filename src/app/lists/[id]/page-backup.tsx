"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthButton from "@/components/auth-button";

type Cuisine = "Spanisch" | "Deutsch" | "Italienisch" | "Französisch" | "Asiatisch";

type Diet = "Vegan" | "Vegetarisch" | "Pescetarisch" | "Fleisch";

type Dish = {
  id: string;
  name: string;
  cuisine: Cuisine;
  diet: Diet;
  time: number; // Minuten
};

type MealType = "Mittag" | "Abend";

type DayKey = "Montag" | "Dienstag" | "Mittwoch" | "Donnerstag" | "Freitag" | "Samstag" | "Sonntag";

type Plan = {
  [day in DayKey]: {
    Mittag: string | null; // dish id
    Abend: string | null;  // dish id
  };
};

const DEFAULT_DISHES: Dish[] = [
  { id: "1", name: "Spaghetti Aglio e Olio", cuisine: "Italienisch", diet: "Vegetarisch", time: 20 },
  { id: "2", name: "Gebratener Reis mit Gemüse", cuisine: "Asiatisch", diet: "Vegetarisch", time: 15 },
  { id: "3", name: "Tomatensuppe mit Basilikum", cuisine: "Deutsch", diet: "Vegan", time: 10 },
  { id: "4", name: "Hähnchen aus dem Ofen", cuisine: "Deutsch", diet: "Fleisch", time: 60 },
  { id: "5", name: "Ofenlachs mit Zitronen-Dill", cuisine: "Französisch", diet: "Pescetarisch", time: 45 },
  { id: "6", name: "Veganes Kichererbsen-Curry", cuisine: "Asiatisch", diet: "Vegan", time: 30 },
  { id: "7", name: "Gemischter Salat mit Feta", cuisine: "Französisch", diet: "Vegetarisch", time: 15 },
  { id: "8", name: "Penne Arrabbiata", cuisine: "Italienisch", diet: "Vegan", time: 20 },
  { id: "9", name: "Pilzrisotto", cuisine: "Italienisch", diet: "Vegetarisch", time: 40 },
  { id: "10", name: "Linsensuppe", cuisine: "Deutsch", diet: "Vegan", time: 25 },
  { id: "11", name: "Veggie-Bowl", cuisine: "Spanisch", diet: "Vegetarisch", time: 35 },
  { id: "12", name: "Rindergeschnetzeltes mit Paprika", cuisine: "Spanisch", diet: "Fleisch", time: 90 },
];

const DAYS: DayKey[] = [
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
  "Sonntag",
];

function getWeekStart(date = new Date()) {
  // Start on Monday (EU)
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7; // 0=Mon ... 6=Sun
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - day);
  return d;
}

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("de-DE", { dateStyle: "full" }).format(d);
}

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  const [tab, setTab] = useState<"vorschlag" | "wochenplan" | "profil">("vorschlag");
  const [dishes, setDishes] = useState<Dish[]>(DEFAULT_DISHES);

  const [timeFilter, setTimeFilter] = useState<"Alle" | "10" | "15" | "25" | "45" | "60" | "120">("Alle");
  const [cuisineFilter, setCuisineFilter] = useState<"Alle" | Cuisine>("Alle");
  const [dietFilter, setDietFilter] = useState<"Alle" | Diet>("Alle");
  const [dayOffset, setDayOffset] = useState<number>(0);
  const [mealType, setMealType] = useState<MealType>("Mittag");
  const [suggestion, setSuggestion] = useState<Dish | null>(null);

  // Profile image (persisted)
  const [profileImage, setProfileImage] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem("profile-image");
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (profileImage) localStorage.setItem("profile-image", profileImage);
      else localStorage.removeItem("profile-image");
    } catch {}
  }, [profileImage]);

  // Theme handling
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    return (localStorage.getItem("theme") as "light" | "dark") || "light";
  });

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
    try {
      localStorage.setItem("theme", theme);
    } catch {}
  }, [theme]);

  type PlansByWeek = { [weekId: string]: Plan };

  const [weekOffset, setWeekOffset] = useState<number>(0);

  const [plans, setPlans] = useState<PlansByWeek>(() => {
    if (typeof window === "undefined") return {} as PlansByWeek;
    try {
      const raw = localStorage.getItem("food-plans");
      return raw ? (JSON.parse(raw) as PlansByWeek) : {};
    } catch {
      return {} as PlansByWeek;
    }
  });

  const weekStartBase = getWeekStart();
  const displayedWeekStart = useMemo(() => {
    const d = new Date(weekStartBase);
    d.setDate(d.getDate() + weekOffset * 7);
    return d;
  }, [weekStartBase, weekOffset]);

  const currentWeekId = isoDate(displayedWeekStart);

  const plan: Plan = useMemo(() => {
    return plans[currentWeekId] || createEmptyPlan();
  }, [plans, currentWeekId]);

  useEffect(() => {
    try {
      localStorage.setItem("food-plans", JSON.stringify(plans));
    } catch {}
  }, [plans]);

  function updatePlan(updater: (prev: Plan) => Plan) {
    setPlans((prev) => {
      const existing = prev[currentWeekId] || createEmptyPlan();
      const next = updater(existing);
      return { ...prev, [currentWeekId]: next };
    });
  }

  const filtered = useMemo(() => {
    return dishes
      .filter((d) => {
        if (timeFilter === "Alle") return true;
        if (timeFilter === "120") return d.time > 60; // über 1h
        return d.time <= parseInt(timeFilter, 10);
      })
      .filter((d) => (cuisineFilter === "Alle" || d.cuisine === cuisineFilter))
      .filter((d) => (dietFilter === "Alle" || d.diet === dietFilter));
  }, [dishes, timeFilter, cuisineFilter, dietFilter]);

  const today = new Date();
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + dayOffset);

  const dayKey = DAYS[(targetDate.getDay() + 6) % 7];

  function createEmptyPlan(): Plan {
    return DAYS.reduce((acc, day) => {
      acc[day] = { Mittag: null, Abend: null };
      return acc;
    }, {} as Plan);
  }

  function randomSuggest() {
    const pool = filtered.length ? filtered : dishes;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setSuggestion(pick);
  }

  function assignToPlan(dish: Dish) {
    updatePlan((prev) => ({
      ...prev,
      [dayKey]: { ...prev[dayKey], [mealType]: dish.id },
    }));
    // Close the suggestion card after adding
    setSuggestion(null);
  }

  function getDishById(id: string | null) {
    return dishes.find((d) => d.id === id) || null;
  }

  function goToSuggest(targetDay: DayKey, m: MealType) {
    setMealType(m);
    const todayKey: DayKey = DAYS[(today.getDay() + 6) % 7];
    const diff = DAYS.indexOf(targetDay) - DAYS.indexOf(todayKey);
    setDayOffset(diff);
    setTab("vorschlag");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // --- Drag & Drop for meals across days ---
  type DragPayload = { day: DayKey; meal: MealType; dishId: string };
  const [dragging, setDragging] = useState<DragPayload | null>(null);
  const [dragOver, setDragOver] = useState<{ day: DayKey; meal: MealType } | null>(null);

  function moveOrSwapMeal(from: DragPayload, to: { day: DayKey; meal: MealType }) {
    setPlans((prevPlans) => {
      const base = prevPlans[currentWeekId] || createEmptyPlan();
      const fromDish = base[from.day][from.meal];
      const toDish = base[to.day][to.meal];
      if (!fromDish) return prevPlans;
      const next: Plan = JSON.parse(JSON.stringify(base));
      next[from.day][from.meal] = toDish || null;
      next[to.day][to.meal] = fromDish;
      return { ...prevPlans, [currentWeekId]: next };
    });
  }

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-950 dark:to-zinc-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Loading...</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Checking authentication</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-950 dark:to-zinc-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Redirecting...</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Please sign in to access this page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-950 dark:to-zinc-900 text-foreground">
      {/* Header */}
      <header className="sticky top-0 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-zinc-900/60 border-b border-black/5 dark:border-white/10 z-20">
        <div className="mx-auto max-w-5xl px-6 py-4 flex flex-col gap-2">
          {/* Top row: Title + Profile. On desktop, nav appears here too via hidden/md:flex below */}
          <div className="flex items-center justify-between gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">🍽️ Essensvorschläge & Planer</h1>
            {/* Desktop: nav + auth + profile together */}
            <div className="hidden md:flex items-center gap-4">
              <nav className="flex gap-2 rounded-lg p-1 bg-black/5 dark:bg-white/10">
                <button onClick={() => setTab("vorschlag")} className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${tab === "vorschlag" ? "bg-white shadow dark:bg-zinc-700" : "hover:bg-black/10 dark:hover:bg-white/20"}`}>Vorschlag</button>
                <button onClick={() => setTab("wochenplan")} className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${tab === "wochenplan" ? "bg-white shadow dark:bg-zinc-700" : "hover:bg-black/10 dark:hover:bg-white/20"}`}>Wochenplan</button>
              </nav>
              <AuthButton />
              <button
                onClick={() => router.push("/profile")}
                className="inline-flex items-center justify-center h-9 w-9 aspect-square shrink-0 rounded-full p-0 border border-black/10 dark:border-white/10 bg-white/80 dark:bg-zinc-800/80 hover:bg-black/5 dark:hover:bg-white/10"
                aria-label="Profil öffnen"
                title="Profil"
              >
                <span className="text-sm">👤</span>
              </button>
            </div>
            {/* Mobile: only profile button on the right in the top row */}
            <button
              onClick={() => router.push("/profile")}
              className="md:hidden inline-flex items-center justify-center h-9 w-9 aspect-square shrink-0 rounded-full p-0 border border-black/10 dark:border-white/10 bg-white/80 dark:bg-zinc-800/80 hover:bg-black/5 dark:hover:bg-white/10"
              aria-label="Profil öffnen"
              title="Profil"
            >
              <span className="text-sm">👤</span>
            </button>
          </div>

          {/* Mobile: Tabs below title+profile */}
          <nav className="md:hidden mt-4 flex gap-2 rounded-lg p-1 bg-black/5 dark:bg-white/10 w-full">
            <button onClick={() => setTab("vorschlag")} className={`flex-1 px-3 py-1.5 rounded-md text-sm font-medium transition ${tab === "vorschlag" ? "bg-white shadow dark:bg-zinc-700" : "hover:bg-black/10 dark:hover:bg-white/20"}`}>Vorschlag</button>
            <button onClick={() => setTab("wochenplan")} className={`flex-1 px-3 py-1.5 rounded-md text-sm font-medium transition ${tab === "wochenplan" ? "bg-white shadow dark:bg-zinc-700" : "hover:bg-black/10 dark:hover:bg-white/20"}`}>Wochenplan</button>
          </nav>

          {/* Mobile: Auth section */}
          <div className="md:hidden mt-2">
            <AuthButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8 grid gap-8">
        {tab === "vorschlag" ? (
          /* --- existing Vorschlag section remains unchanged --- */
          <section className="grid gap-6">
            {/* Controls */}
            {/* ... (LEAVE ALL EXISTING CODE OF THE VORSCHLAG SECTION UNCHANGED) ... */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="grid gap-2 sm:col-span-2 lg:col-span-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDayOffset((o) => o - 1)}
                  className="px-3 py-2 rounded-md border text-sm hover:bg-black/5 dark:hover:bg-white/10 border-black/10 dark:border-white/10"
                  aria-label="Vorheriger Tag"
                >
                  ←
                </button>
                <div className="flex-1 text-sm px-3 py-2 rounded-md border bg-white dark:bg-zinc-800 border-black/10 dark:border-white/10 text-center">
                  {formatDate(targetDate)}
                </div>
                <button
                  onClick={() => setDayOffset((o) => o + 1)}
                  className="px-3 py-2 rounded-md border text-sm hover:bg-black/5 dark:hover:bg-white/10 border-black/10 dark:border-white/10"
                  aria-label="Nächster Tag"
                >
                  →
                </button>
                <button
                  onClick={() => setDayOffset(0)}
                  disabled={dayOffset === 0}
                  className={`px-3 py-2 rounded-md border text-sm ${dayOffset === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-black/5 dark:hover:bg-white/10"} border-black/10 dark:border-white/10`}
                >
                  Heute
                </button>
              </div>
            </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Kochzeit</label>
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-md border bg-white dark:bg-zinc-800 border-black/10 dark:border-white/10"
                >
                  <option value="Alle">Alle</option>
                  <option value="10">unter 10 min</option>
                  <option value="15">unter 15 min</option>
                  <option value="25">unter 25 min</option>
                  <option value="45">unter 45 min</option>
                  <option value="60">unter 1h</option>
                  <option value="120">über 1h</option>
                </select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Küche</label>
                <select
                  value={cuisineFilter}
                  onChange={(e) => setCuisineFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-md border bg-white dark:bg-zinc-800 border-black/10 dark:border-white/10"
                >
                  {(["Alle", "Spanisch", "Deutsch", "Italienisch", "Französisch", "Asiatisch"] as const).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Ernährung</label>
                <select
                  value={dietFilter}
                  onChange={(e) => setDietFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-md border bg-white dark:bg-zinc-800 border-black/10 dark:border-white/10"
                >
                  {(["Alle", "Vegan", "Vegetarisch", "Pescetarisch", "Fleisch"] as const).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
                            <div className="grid gap-2">
                <label className="text-sm font-medium">Mahlzeit</label>
                <div className="flex gap-2 flex-wrap lg:gap-1.5">
                  {["Mittag", "Abend"].map((m) => (
                    <button key={m} onClick={() => setMealType(m as MealType)} className={`px-3 py-2 rounded-md border text-sm ${mealType === m ? "bg-black text-white border-black dark:bg-white dark:text-black" : "hover:bg-black/5 dark:hover:bg-white/10 border-black/10 dark:border-white/10"}`}>{m}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Suggest Card */}
            <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">Vorschlag · {mealType}</h2>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{formatDate(targetDate)}</p>
                  <div className="mt-2 flex items-center gap-2">
                    {(() => {
                      const mittag = plan[dayKey].Mittag;
                      const abend = plan[dayKey].Abend;
                      const full = Boolean(mittag && abend);
                      const partial = Boolean((mittag && !abend) || (!mittag && abend));
                      const base = "inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs";
                      if (full) {
                        return (
                          <span className={`${base} bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-600/40`}>
                            ● Status: Komplett
                          </span>
                        );
                      }
                      if (partial) {
                        return (
                          <span className={`${base} bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-600/40`}>
                            ● Status: Teilweise
                          </span>
                        );
                      }
                      return (
                        <span className={`${base} bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700`}>
                          ● Status: Offen
                        </span>
                      );
                    })()}
                    <span className="text-xs text-zinc-600 dark:text-zinc-400">
                      Mittag: {plan[dayKey].Mittag ? '✓' : '–'} · Abend: {plan[dayKey].Abend ? '✓' : '–'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={randomSuggest} className="px-4 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black font-medium">Zufallsvorschlag</button>
                </div>
              </div>

              {suggestion ? (
                <div className="mt-3 grid gap-4">
                  <div className="rounded-xl border border-black/10 dark:border-white/10 p-4 bg-white dark:bg-zinc-800">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold">{suggestion.name}</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">{suggestion.cuisine} • {suggestion.diet} • {suggestion.time} min</p>
                      </div>
                      <div className="flex items-center gap-2">
                     
                        <button
                          onClick={() => setSuggestion(null)}
                          className="h-9 w-9 inline-flex items-center justify-center rounded-md border border-red-300 text-red-600 hover:bg-red-50 dark:border-red-600/50 dark:text-red-300 dark:hover:bg-red-900/30"
                          aria-label="Vorschlag verwerfen"
                          title="Vorschlag verwerfen"
                        >
                          ✕
                        </button>
                           <button
                          onClick={() => assignToPlan(suggestion)}
                          className="h-9 w-9 inline-flex items-center justify-center rounded-md border border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-600/50 dark:text-emerald-300 dark:hover:bg-emerald-900/30"
                          aria-label="Zum Plan hinzufügen"
                          title="Zum Plan hinzufügen"
                        >
                          ✓
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Library */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">Gerichte-Bibliothek</h3>
                <span className="text-xs text-zinc-500">{filtered.length} von {dishes.length} angezeigt</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((dish) => (
                  <article key={dish.id} className="rounded-xl border border-black/10 dark:border-white/10 p-4 bg-white dark:bg-zinc-800 flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-medium">{dish.name}</h4>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">{dish.cuisine} • {dish.diet} • {dish.time} min</p>
                    </div>
                    <button onClick={() => setSuggestion(dish)} className="text-sm px-3 py-1.5 rounded-md border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10">Vorschlagen</button>
                  </article>
                ))}
              </div>
            </section>
          </section>
        ) : tab === "wochenplan" ? (
          /* --- existing Wochenplan section remains unchanged --- */
          <section className="grid gap-6">
            {/* Week header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">Wochenplan</h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Woche ab {formatDate(displayedWeekStart)}</p>
              </div>
              <div className="flex items-center gap-2 self-start">
                <button
                  onClick={() => setWeekOffset((o) => o - 1)}
                  className="px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10"
                  aria-label="Vorige Woche"
                >
                  ← 
                </button>
                <button
                  onClick={() => setWeekOffset(0)}
                  disabled={weekOffset === 0}
                  className={`px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 ${weekOffset === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-black/5 dark:hover:bg-white/10"}`}
                >
                  Aktuelle Woche
                </button>
                <button
                  onClick={() => setWeekOffset((o) => o + 1)}
                  className="px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10"
                  aria-label="Nächste Woche"
                >
                  →
                </button>
              </div>
            </div>

            {/* Today highlight */}
            <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 p-4">
              <h3 className="font-semibold mb-2">Heute</h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {(["Mittag", "Abend"] as const).map((m) => {
                  const dish = getDishById(plan[DAYS[(today.getDay() + 6) % 7]][m]);
                  return (
                    <div key={m} className="rounded-xl border border-black/10 dark:border-white/10 p-3 bg-white dark:bg-zinc-800">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-zinc-500">{m}</p>
                          <p className="font-medium">{dish ? dish.name : "–"}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Plan-Übersicht */}
            <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="font-semibold">Übersicht</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Welche Tage sind schon geplant?</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-600/40">● Komplett</span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-200 dark:border-amber-600/40">● Teilweise</span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">● Offen</span>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {DAYS.map((d) => {
                  const mittag = plan[d].Mittag;
                  const abend = plan[d].Abend;
                  const full = Boolean(mittag && abend);
                  const partial = Boolean((mittag && !abend) || (!mittag && abend));
                  const cls = full
                    ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200 border-emerald-200 dark:border-emerald-600/40"
                    : partial
                    ? "bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 border-amber-200 dark:border-amber-600/40"
                    : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700";
                  return (
                    <button
                      key={d}
                      onClick={() => {
                        // scroll to planner grid
                        const el = document.getElementById(`planner-${d}`);
                        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                      }}
                      className={`text-left px-3 py-2 rounded-lg border ${cls}`}
                      title={`${d}: ${mittag ? "Mittag ✓" : "Mittag –"} · ${abend ? "Abend ✓" : "Abend –"}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-sm truncate">{d}</span>
                        <span className="text-xs opacity-80">{full ? "✓✓" : partial ? "✓–" : "––"}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Planner grid */}
            <div className="grid gap-4">
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                {DAYS.map((day) => {
                  const mittagId = plan[day].Mittag;
                  const abendId = plan[day].Abend;
                  const full = Boolean(mittagId && abendId);
                  const partial = Boolean((mittagId && !abendId) || (!mittagId && abendId));
                  const statusBorder = full
                    ? "border-emerald-300 dark:border-emerald-600/50"
                    : partial
                    ? "border-amber-300 dark:border-amber-600/50"
                    : "border-black/10 dark:border-white/10";

                  return (
                    <div
                      key={day}
                      id={`planner-${day}`}
                      className={`rounded-2xl border ${statusBorder} bg-white/70 dark:bg-zinc-900/70 p-4 flex flex-col gap-3`}
                    >
                      {/* Day header */}
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-base">{day}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${
                          full
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-600/40"
                            : partial
                            ? "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-600/40"
                            : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700"
                        }`}>
                          {full ? "Komplett" : partial ? "Teilweise" : "Offen"}
                        </span>
                      </div>

                      {/* Two-column layout for meals on larger screens */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(["Mittag", "Abend"] as const).map((m) => {
                          const selected = getDishById(plan[day][m]);
                          return (
                            <div
                              key={m}
                              className={`rounded-lg bg-white dark:bg-zinc-800 border border-black/10 dark:border-white/10 p-3 transition ring-offset-0 ${
                                dragOver && dragOver.day === day && dragOver.meal === m ? "ring-2 ring-blue-400 dark:ring-blue-500" : ""
                              }`}
                              onDragOver={(e) => {
                                e.preventDefault();
                                setDragOver({ day, meal: m });
                              }}
                              onDragLeave={() => setDragOver((cur) => (cur && cur.day === day && cur.meal === m ? null : cur))}
                              onDrop={(e) => {
                                e.preventDefault();
                                setDragOver(null);
                                try {
                                  const data = e.dataTransfer.getData("application/json") || e.dataTransfer.getData("text/plain");
                                  const payload = (data ? JSON.parse(data) : dragging) as DragPayload | null;
                                  if (payload) {
                                    moveOrSwapMeal(payload, { day, meal: m });
                                  }
                                } catch {
                                  if (dragging) moveOrSwapMeal(dragging, { day, meal: m });
                                }
                                setDragging(null);
                              }}
                            >
                              <p className="text-[11px] uppercase tracking-wide text-zinc-500 mb-1">{m}</p>

                              {/* Selected summary */}
                              {selected ? (
                                <div
                                  className="mb-2 cursor-grab active:cursor-grabbing"
                                  draggable
                                  onDragStart={(e) => {
                                    const payload: DragPayload = { day, meal: m, dishId: selected.id };
                                    setDragging(payload);
                                    try {
                                      e.dataTransfer.setData("application/json", JSON.stringify(payload));
                                    } catch {
                                      e.dataTransfer.setData("text/plain", JSON.stringify(payload));
                                    }
                                    e.dataTransfer.effectAllowed = "move";
                                  }}
                                  aria-grabbed={true}
                                  title="Zum Verschieben ziehen"
                                >
                                  <p className="font-medium truncate">{selected.name}</p>
                                  <div className="mt-1 flex flex-wrap items-center gap-1 text-[11px] text-zinc-600 dark:text-zinc-400">
                                    <span className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10">{selected.cuisine}</span>
                                    <span className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10">{selected.diet}</span>
                                    <span className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10">⏱ {selected.time} min</span>
                                  </div>
                                </div>
                              ) : (
                                <p className="mb-2 text-sm text-zinc-500">Noch nichts geplant – hierher ziehen oder „Jetzt planen“</p>
                              )}

                              {/* Controls */}
                              {selected ? (
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => goToSuggest(day, m)}
                                    className="px-3 py-1.5 rounded-md border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 text-sm"
                                  >
                                    Ändern
                                  </button>
                                  <button
                                    className="h-9 w-9 inline-flex items-center justify-center rounded-md border border-red-300 text-red-600 hover:bg-red-50 dark:border-red-600/50 dark:hover:bg-red-900/30"
                                    onClick={() => {
                                      updatePlan((prev) => ({
                                        ...prev,
                                        [day]: { ...prev[day], [m]: null },
                                      }));
                                    }}
                                    aria-label="Entfernen"
                                    title="Entfernen"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => goToSuggest(day, m)}
                                    className="w-full px-3 py-2 rounded-md bg-black text-white dark:bg-white dark:text-black text-sm font-medium"
                                  >
                                    Jetzt planen
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        ) : (
          /* --- NEW PROFIL SECTION --- */
          <section className="grid gap-6">
            {/* User Section */}
            <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 p-6">
              <h2 className="text-xl font-semibold mb-4">Benutzer</h2>
              <div className="flex flex-col items-center text-center gap-4 sm:gap-6 sm:grid sm:grid-cols-[6.5rem,1fr] sm:items-start sm:text-left">
                {/* Avatar + Upload */}
                <div className="flex flex-col items-center sm:items-start gap-3">
                  <div className="relative group">
                    <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full overflow-hidden border border-black/10 dark:border-white/10 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                      {profileImage ? (
                        <img src={profileImage} alt="Profilbild" className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-2xl">👤</span>
                      )}
                    </div>
                    <label
                      className="absolute inset-0 rounded-full flex items-center justify-center text-white text-xs sm:text-sm bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer select-none"
                      title="Bild hochladen"
                      aria-label="Bild hochladen"
                    >
                      Bild hochladen
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = () => setProfileImage(reader.result as string);
                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>
                  </div>
                  {profileImage && (
                    <button
                      className="mt-2 w-full sm:w-auto px-3 py-2 rounded-md border border-black/10 dark:border-white/10 text-sm hover:bg-black/5 dark:hover:bg-white/10"
                      onClick={() => setProfileImage(null)}
                    >
                      Entfernen
                    </button>
                  )}
                </div>

                {/* User Fields */}
                <div className="grid gap-4 w-full max-w-sm sm:max-w-none sm:min-w-0">
                  {session ? (
                    <>
                      <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-md">
                        <p className="text-sm text-green-800 dark:text-green-200">
                          <strong>Welcome, {session.user?.name || session.user?.email}!</strong>
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-300 mt-1">
                          Authenticated via Keycloak
                        </p>
                      </div>
                      <div className="grid gap-1.5">
                        <label className="text-sm font-medium">Name</label>
                        <input 
                          type="text" 
                          value={session.user?.name || ''} 
                          readOnly
                          className="w-full px-3 py-2 rounded-md border bg-gray-50 dark:bg-zinc-700 border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-300" 
                        />
                      </div>
                      <div className="grid gap-1.5">
                        <label className="text-sm font-medium">E‑Mail</label>
                        <input 
                          type="email" 
                          value={session.user?.email || ''} 
                          readOnly
                          className="w-full px-3 py-2 rounded-md border bg-gray-50 dark:bg-zinc-700 border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-300" 
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-md">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          Please sign in to view and manage your profile information.
                        </p>
                      </div>
                      <div className="grid gap-1.5">
                        <label className="text-sm font-medium">Name</label>
                        <input type="text" placeholder="Sign in to see your name" disabled className="w-full px-3 py-2 rounded-md border bg-gray-100 dark:bg-zinc-800 border-black/10 dark:border-white/10" />
                      </div>
                      <div className="grid gap-1.5">
                        <label className="text-sm font-medium">E‑Mail</label>
                        <input type="email" placeholder="Sign in to see your email" disabled className="w-full px-3 py-2 rounded-md border bg-gray-100 dark:bg-zinc-800 border-black/10 dark:border-white/10" />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Integrationen Section */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">Integrationen</h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                {[
                  {
                    name: "Bring",
                    emoji: "🧺",
                    desc: "Einkaufsliste synchronisieren",
                    benefits: ["Rezepte → Liste übernehmen", "Automatische Mengen", "Mehrere Listen teilen"],
                    tag: "Beliebt",
                    connected: false,
                  },
                  {
                    name: "Lidl",
                    emoji: "🛒",
                    desc: "Produkte & Online-Shop",
                    benefits: ["Preise direkt sehen", "Warenkorb füllen", "Filial-Verfügbarkeit"],
                    tag: "Neu",
                    connected: false,
                  },
                  {
                    name: "Rewe",
                    emoji: "🚚",
                    desc: "Liefer- & Abholservice",
                    benefits: ["Lieferzeit wählen", "Alternativen vorschlagen", "Bon digital"],
                    tag: "Empfohlen",
                    connected: false,
                  },
                  {
                    name: "Aldi",
                    emoji: "🏷️",
                    desc: "Wochenangebote & Aktionen",
                    benefits: ["Spar-Tipps integrieren", "Preisverlauf", "Favoriten"],
                    tag: "Angebote",
                    connected: false,
                  },
                ].map((i) => (
                  <article
                    key={i.name}
                    className="group rounded-xl border border-black/10 dark:border-white/10 p-5 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm transition hover:shadow-md hover:border-black/20 dark:hover:border-white/20"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-12 w-12 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-2xl">
                          <span className="leading-none">{i.emoji}</span>
                        </div>
                        <div className="min-w-0">
                          <h4 className="truncate">{i.name}</h4>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm px-2 py-0.5 rounded-full border whitespace-nowrap ${
                          i.connected
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-600/40"
                            : "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-600/40"
                        }`}>
                          {i.connected ? "Verbunden" : "Nicht verbunden"}
                        </span>
                        <span className="text-sm px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-zinc-700 dark:text-zinc-300 whitespace-nowrap">{i.tag}</span>
                      </div>
                    </div>

                    <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">{i.desc}</p>

                    <ul className="mt-3 space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
                      {i.benefits.map((b) => (
                        <li key={b} className="flex items-center gap-2">
                          <span className="inline-block h-2 w-2 rounded-full bg-zinc-400 dark:bg-zinc-500 flex-shrink-0"></span>
                          <span className="leading-normal">{b}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-3">
                      <button className="w-full sm:w-auto px-4 py-2 rounded-md bg-black text-white dark:bg-white dark:text-black text-sm font-medium">
                        Verbinden
                      </button>
                      <button className="w-full sm:w-auto px-0 sm:px-2 py-1.5 sm:py-2 text-sm underline underline-offset-4 hover:opacity-80 text-center sm:text-left">
                        Mehr erfahren
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Konto-Aktionen Section */}
            <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 p-6">
              <h3 className="text-lg font-semibold mb-3">Konto</h3>
              {session ? (
                <div className="flex flex-col sm:flex-row gap-2">
                  <button className="px-4 py-2 rounded-md border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10" disabled>
                    Passwort zurücksetzen
                    <span className="text-xs text-gray-500 block">Via Keycloak verwaltet</span>
                  </button>
                  <button 
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
                  >
                    Abmelden
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2">
                  <button 
                    disabled 
                    className="px-4 py-2 rounded-md border border-black/10 dark:border-white/10 bg-gray-100 dark:bg-zinc-800 text-gray-400 cursor-not-allowed"
                  >
                    Bitte erst anmelden
                  </button>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
      <footer className="mx-auto max-w-5xl px-6 py-10 text-sm text-zinc-600 dark:text-zinc-400 text-center">
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
  );
}
