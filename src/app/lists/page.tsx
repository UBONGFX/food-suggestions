"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

type UserRole = "owner" | "admin" | "member"

type Entity = {
  id: string
  name: string
  description?: string
  role: UserRole
  memberCount: number
  itemCount: number
  createdAt: string
  lastActivity: string
}

// Mock data - später aus API
const DEFAULT_ENTITIES: Entity[] = [
  {
    id: "1",
    name: "Familienküche",
    description: "Haupthaushalt Familie Mustermann",
    role: "owner",
    memberCount: 3,
    itemCount: 47,
    createdAt: "2024-01-15",
    lastActivity: "vor 2 Stunden"
  },
  {
    id: "2", 
    name: "WG Küche",
    description: "Gemeinsame Essensliste für die WG",
    role: "member",
    memberCount: 5,
    itemCount: 23,
    createdAt: "2024-02-01",
    lastActivity: "vor 1 Tag"
  }
]

export default function EntitiesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  // Load entities from localStorage on initialization
  const [entities, setEntities] = useState<Entity[]>(() => {
    if (typeof window === "undefined") return DEFAULT_ENTITIES;
    try {
      const saved = localStorage.getItem("user-entities");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Validate that parsed data has the correct structure
        if (Array.isArray(parsed) && parsed.every(item => 
          item && typeof item === 'object' && 
          typeof item.id === 'string' && 
          typeof item.name === 'string'
        )) {
          // Merge with default entities, but prefer saved ones
          const savedIds = new Set(parsed.map((e: Entity) => e.id));
          const merged = [...parsed, ...DEFAULT_ENTITIES.filter(e => !savedIds.has(e.id))];
          return merged;
        }
      }
      return DEFAULT_ENTITIES;
    } catch (error) {
      console.error("Failed to load entities from localStorage:", error);
      return DEFAULT_ENTITIES;
    }
  });
  
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newEntityName, setNewEntityName] = useState("")
  const [newEntityDescription, setNewEntityDescription] = useState("")

  // Save entities to localStorage whenever entities change
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("user-entities", JSON.stringify(entities));
      } catch (error) {
        console.error("Failed to save entities to localStorage:", error);
      }
    }
  }, [entities]);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  const handleCreateEntity = () => {
    if (!newEntityName.trim()) return

    // Generate a more unique ID
    const newId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newEntity: Entity = {
      id: newId,
      name: newEntityName,
      description: newEntityDescription || undefined,
      role: "owner",
      memberCount: 1,
      itemCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      lastActivity: "gerade erstellt"
    }

    setEntities(prev => [...prev, newEntity])
    setNewEntityName("")
    setNewEntityDescription("")
    setShowCreateForm(false)
  }

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case "owner": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "admin": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "member": return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getRoleText = (role: UserRole) => {
    switch (role) {
      case "owner": return "Besitzer"
      case "admin": return "Admin"
      case "member": return "Mitglied"
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-950 dark:to-zinc-900">
      {/* Header */}
      <header className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex items-start justify-between mb-6 gap-4">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              👋 Willkommen zurück, {session?.user?.name || "Benutzer"}!
            </h1>
            <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
              Wähle eine deiner Listen aus oder erstelle eine neue.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
            <button
              onClick={() => router.push("/profile")}
              className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-black/10 dark:border-white/10 bg-white/80 dark:bg-zinc-800/80 hover:bg-black/5 dark:hover:bg-white/10 transition-colors shrink-0"
              aria-label="Profil öffnen"
              title="Profil"
            >
              <span className="text-lg">👤</span>
            </button>
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition shrink-0"
            >
              <span>+</span>
              <span className="whitespace-nowrap">Neue Liste</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-6 pb-16">
        {/* Entities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entities.map((entity) => (
            <div
              key={entity.id}
              className="group relative rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 backdrop-blur p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-black/20 dark:hover:border-white/20"
            >
              {/* Entity Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg leading-tight mb-1">{entity.name}</h3>
                  {entity.description && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {entity.description}
                    </p>
                  )}
                </div>
                
                {/* Role Badge */}
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(entity.role)}`}>
                  {getRoleText(entity.role)}
                </span>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 mb-4 text-sm text-zinc-600 dark:text-zinc-400">
                <div className="flex items-center gap-1">
                  <span>👥</span>
                  <span>{entity.memberCount} Mitglieder</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>📋</span>
                  <span>{entity.itemCount} Einträge</span>
                </div>
              </div>

              {/* Last Activity */}
              <p className="text-xs text-zinc-500 dark:text-zinc-500 mb-4">
                Letzte Aktivität: {entity.lastActivity}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Link
                  href={`/lists/${entity.id}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition"
                >
                  <span>Öffnen</span>
                  <span>→</span>
                </Link>
                
                {entity.role === "owner" && (
                  <Link
                    href={`/lists/${entity.id}/settings`}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 transition"
                    title="Einstellungen"
                  >
                    <span className="text-lg">⚙️</span>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Create Entity Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 w-full max-w-md border border-black/10 dark:border-white/10">
              <h2 className="text-xl font-semibold mb-4">Neue Liste erstellen</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name *</label>
                  <input
                    type="text"
                    value={newEntityName}
                    onChange={(e) => setNewEntityName(e.target.value)}
                    placeholder="z.B. Familienküche"
                    className="w-full px-3 py-2 border border-black/10 dark:border-white/10 rounded-lg bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 focus:border-transparent outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Beschreibung (optional)</label>
                  <textarea
                    value={newEntityDescription}
                    onChange={(e) => setNewEntityDescription(e.target.value)}
                    placeholder="Kurze Beschreibung der Liste..."
                    rows={3}
                    className="w-full px-3 py-2 border border-black/10 dark:border-white/10 rounded-lg bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 focus:border-transparent outline-none resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={handleCreateEntity}
                  disabled={!newEntityName.trim()}
                  className="flex-1 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Erstellen
                </button>
                <button
                  onClick={() => {
                    setShowCreateForm(false)
                    setNewEntityName("")
                    setNewEntityDescription("")
                  }}
                  className="px-4 py-2 border border-black/10 dark:border-white/10 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition"
                >
                  Abbrechen
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mx-auto max-w-6xl px-6 py-10 text-sm text-zinc-600 dark:text-zinc-400 text-center">
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
  )
}
