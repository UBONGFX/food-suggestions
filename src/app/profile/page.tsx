"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import AuthButton from "@/components/auth-button"

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Profile image (persisted)
  const [profileImage, setProfileImage] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("profile-image")
    }
    return null
  })

  // Save profile image to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (profileImage) localStorage.setItem("profile-image", profileImage)
      else localStorage.removeItem("profile-image")
    }
  }, [profileImage])

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "loading") return // Still loading
    if (!session) {
      router.push("/auth/signin")
    }
  }, [session, status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-950 dark:to-zinc-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect
  }

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
          <AuthButton />
        </div>

        {/* Profile Content */}
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              👤 Dein Profil
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Verwalte deine persönlichen Einstellungen und Informationen
            </p>
          </div>

          <div className="space-y-8">
            {/* Profile Picture Section */}
            <div className="bg-white/70 dark:bg-zinc-800/70 rounded-2xl p-8 border border-black/10 dark:border-white/10">
              <h2 className="text-2xl font-semibold mb-6">Profilbild</h2>
              
              <div className="flex flex-col items-center space-y-6">
                {/* Profile Picture Display */}
                <div className="relative">
                  <div className="h-32 w-32 rounded-full border-4 border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-100 dark:bg-gray-800">
                    {profileImage ? (
                      <img 
                        src={profileImage} 
                        alt="Profilbild" 
                        className="h-full w-full object-cover" 
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                        <span className="text-4xl">👤</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Upload Controls */}
                <div className="flex flex-col items-center space-y-3">
                  <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                    <span>Bild hochladen</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onload = () => setProfileImage(reader.result as string)
                          reader.readAsDataURL(file)
                        }
                      }}
                    />
                  </label>
                  
                  {profileImage && (
                    <button
                      className="text-red-500 hover:text-red-600 text-sm"
                      onClick={() => setProfileImage(null)}
                    >
                      Bild entfernen
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="bg-white/70 dark:bg-zinc-800/70 rounded-2xl p-8 border border-black/10 dark:border-white/10">
              <h2 className="text-2xl font-semibold mb-6">Account-Informationen</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Name:</span>
                  <span className="text-gray-900 dark:text-gray-100">
                    {session.user?.name || "Nicht angegeben"}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="font-medium text-gray-700 dark:text-gray-300">E-Mail:</span>
                  <span className="text-gray-900 dark:text-gray-100">
                    {session.user?.email || "Nicht angegeben"}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Anbieter:</span>
                  <span className="text-gray-900 dark:text-gray-100">Keycloak</span>
                </div>
                
                <div className="flex justify-between items-center py-3">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Status:</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                    ✅ Angemeldet
                  </span>
                </div>
              </div>
            </div>

            {/* Preferences Section */}
            <div className="bg-white/70 dark:bg-zinc-800/70 rounded-2xl p-8 border border-black/10 dark:border-white/10">
              <h2 className="text-2xl font-semibold mb-6">Einstellungen</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Theme:</span>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Automatisch (System)</p>
                  </div>
                  <button className="text-blue-500 hover:text-blue-600 text-sm">
                    Ändern
                  </button>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Sprache:</span>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Deutsch</p>
                  </div>
                  <button className="text-blue-500 hover:text-blue-600 text-sm">
                    Ändern
                  </button>
                </div>
                
                <div className="flex justify-between items-center py-3">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Benachrichtigungen:</span>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Aktiviert</p>
                  </div>
                  <button className="text-blue-500 hover:text-blue-600 text-sm">
                    Verwalten
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/70 dark:bg-zinc-800/70 rounded-2xl p-8 border border-black/10 dark:border-white/10">
              <h2 className="text-2xl font-semibold mb-6">Schnellaktionen</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <button 
                  onClick={() => router.push("/home")}
                  className="text-left p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="text-2xl mb-2">🏠</div>
                  <div className="font-medium">Zur Hauptseite</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Zurück zum Essensplaner</div>
                </button>
                
                <button 
                  onClick={() => router.push("/dashboard")}
                  className="text-left p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="text-2xl mb-2">📊</div>
                  <div className="font-medium">Dashboard</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Übersicht und Statistiken</div>
                </button>
              </div>
              
              {/* Logout Button */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button 
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full text-left p-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-red-700 dark:text-red-300"
                >
                  <div className="text-2xl mb-2">🚪</div>
                  <div className="font-medium">Abmelden</div>
                  <div className="text-sm text-red-600 dark:text-red-400">Sicher aus deinem Account ausloggen</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
