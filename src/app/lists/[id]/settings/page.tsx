"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

type UserRole = "owner" | "admin" | "member"

type Member = {
  id: string
  name: string
  email: string
  role: UserRole
  joinedAt: string
  lastActive: string
  avatar?: string
}

type InviteLink = {
  id: string
  role: UserRole
  expiresAt: string
  usageCount: number
  maxUsage: number
}

// Mock data
const DEFAULT_MEMBERS: Member[] = [
  {
    id: "1",
    name: "Jordi Isken",
    email: "jordi@isken-ag.de",
    role: "owner",
    joinedAt: "2024-01-15",
    lastActive: "vor 5 Minuten"
  },
  {
    id: "2",
    name: "Anna Müller",
    email: "anna@example.com",
    role: "admin",
    joinedAt: "2024-01-20",
    lastActive: "vor 2 Stunden"
  },
  {
    id: "3",
    name: "Max Schmidt",
    email: "max@example.com",
    role: "member",
    joinedAt: "2024-02-01",
    lastActive: "vor 1 Tag"
  }
]

export default function EntitySettingsPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [entityName, setEntityName] = useState("Essensvorschläge & Planer")
  const [entityDescription, setEntityDescription] = useState("Haupthaushalt Familie Mustermann")
  const [members, setMembers] = useState<Member[]>(DEFAULT_MEMBERS)
  const [inviteLinks, setInviteLinks] = useState<InviteLink[]>([])
  const [showInviteForm, setShowInviteForm] = useState(false)
  const [inviteRole, setInviteRole] = useState<UserRole>("member")
  const [activeTab, setActiveTab] = useState<"general" | "members" | "sharing" | "danger">("general")

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  const handleSaveGeneral = () => {
    // TODO: API call to save entity settings
    alert("Einstellungen gespeichert!")
  }

  const handleCreateInviteLink = () => {
    const newInvite: InviteLink = {
      id: Date.now().toString(),
      role: inviteRole,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      usageCount: 0,
      maxUsage: 10
    }
    setInviteLinks([...inviteLinks, newInvite])
    setShowInviteForm(false)
  }

  const handleRemoveMember = (memberId: string) => {
    if (confirm("Mitglied wirklich entfernen?")) {
      setMembers(members.filter(m => m.id !== memberId))
    }
  }

  const handleDeleteEntity = () => {
    if (confirm("Liste wirklich löschen? Alle Daten gehen verloren!")) {
      // TODO: API call to delete entity
      router.push("/lists")
    }
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
      <header className="mx-auto max-w-4xl px-6 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Link
            href={`/lists/${params.id}`}
            className="inline-flex items-center gap-2 text-sm rounded-lg border border-black/10 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 px-3 py-1.5 hover:bg-black/5 dark:hover:bg-white/10 transition"
          >
            <span>←</span>
            <span>Zurück zur Liste</span>
          </Link>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          ⚙️ Einstellungen
        </h1>
        <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
          Verwalte deine Liste "{entityName}"
        </p>
      </header>

      <main className="mx-auto max-w-4xl px-6 pb-16">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 mb-8 p-1 bg-white/70 dark:bg-zinc-900/70 rounded-xl border border-black/10 dark:border-white/10">
          {[
            { key: "general", label: "Allgemein", icon: "📝" },
            { key: "members", label: "Mitglieder", icon: "👥" },
            { key: "sharing", label: "Teilen", icon: "🔗" },
            { key: "danger", label: "Erweitert", icon: "⚠️" }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === tab.key
                  ? "bg-black dark:bg-white text-white dark:text-black"
                  : "hover:bg-black/5 dark:hover:bg-white/10"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* General Settings */}
          {activeTab === "general" && (
            <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 p-6">
              <h2 className="text-xl font-semibold mb-4">Allgemeine Einstellungen</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name der Liste</label>
                  <input
                    type="text"
                    value={entityName}
                    onChange={(e) => setEntityName(e.target.value)}
                    className="w-full px-3 py-2 border border-black/10 dark:border-white/10 rounded-lg bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 focus:border-transparent outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Beschreibung</label>
                  <textarea
                    value={entityDescription}
                    onChange={(e) => setEntityDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-black/10 dark:border-white/10 rounded-lg bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 focus:border-transparent outline-none resize-none"
                  />
                </div>

                <button
                  onClick={handleSaveGeneral}
                  className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition"
                >
                  Änderungen speichern
                </button>
              </div>
            </div>
          )}

          {/* Members */}
          {activeTab === "members" && (
            <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Mitglieder ({members.length})</h2>
                <button
                  onClick={() => setShowInviteForm(true)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition"
                >
                  <span>+</span>
                  <span>Einladen</span>
                </button>
              </div>

              <div className="space-y-3">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 border border-black/10 dark:border-white/10 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        {member.avatar ? (
                          <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <span className="text-lg">👤</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">{member.email}</p>
                        <p className="text-xs text-zinc-500">Zuletzt aktiv: {member.lastActive}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(member.role)}`}>
                        {getRoleText(member.role)}
                      </span>
                      
                      {member.role !== "owner" && (
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm"
                        >
                          Entfernen
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sharing */}
          {activeTab === "sharing" && (
            <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 p-6">
              <h2 className="text-xl font-semibold mb-4">Einladungslinks</h2>
              
              {inviteLinks.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🔗</div>
                  <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                    Noch keine Einladungslinks erstellt
                  </p>
                  <button
                    onClick={() => setShowInviteForm(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition"
                  >
                    <span>+</span>
                    <span>Ersten Link erstellen</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {inviteLinks.map((link) => (
                    <div
                      key={link.id}
                      className="flex items-center justify-between p-3 border border-black/10 dark:border-white/10 rounded-lg"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(link.role)}`}>
                            {getRoleText(link.role)}
                          </span>
                          <span className="text-sm text-zinc-600 dark:text-zinc-400">
                            {link.usageCount}/{link.maxUsage} verwendet
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500">
                          Läuft ab: {new Date(link.expiresAt).toLocaleDateString('de-DE')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1 border border-black/10 dark:border-white/10 rounded text-sm hover:bg-black/5 dark:hover:bg-white/10 transition">
                          Kopieren
                        </button>
                        <button className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm">
                          Löschen
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Danger Zone */}
          {activeTab === "danger" && (
            <div className="rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-950/20 p-6">
              <h2 className="text-xl font-semibold text-red-800 dark:text-red-400 mb-4">Erweiterte Einstellungen</h2>
              
              <div className="space-y-4">
                <div className="p-4 border border-red-200 dark:border-red-900/50 rounded-lg bg-white/50 dark:bg-red-950/30">
                  <h3 className="font-medium text-red-800 dark:text-red-400 mb-2">Liste löschen</h3>
                  <p className="text-sm text-red-600 dark:text-red-400 mb-3">
                    Diese Aktion kann nicht rückgängig gemacht werden. Alle Daten gehen verloren.
                  </p>
                  <button
                    onClick={handleDeleteEntity}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition text-sm"
                  >
                    Liste endgültig löschen
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Invite Form Modal */}
        {showInviteForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 w-full max-w-md border border-black/10 dark:border-white/10">
              <h2 className="text-xl font-semibold mb-4">Einladungslink erstellen</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Berechtigung</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 border border-black/10 dark:border-white/10 rounded-lg bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 focus:border-transparent outline-none"
                  >
                    <option value="member">Mitglied</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={handleCreateInviteLink}
                  className="flex-1 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition"
                >
                  Link erstellen
                </button>
                <button
                  onClick={() => setShowInviteForm(false)}
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
      <footer className="mx-auto max-w-4xl px-6 py-10 text-sm text-zinc-600 dark:text-zinc-400 text-center">
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
