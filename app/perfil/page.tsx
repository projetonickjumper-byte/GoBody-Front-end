"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { AppShell } from "@/components/app-shell"
import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileMenu } from "@/components/profile/profile-menu"
import { AchievementsPreview } from "@/components/profile/achievements-preview"
import { rankingService } from "@/lib/api/services/ranking.service"
import { useAuth } from "@/lib/auth-context"
import { Loader2 } from "lucide-react"
import type { Achievement } from "@/lib/types"

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [achievements, setAchievements] = useState<Achievement[]>([])

  useEffect(() => {
    async function loadAchievements() {
      try {
        const res = await rankingService.getAchievements()
        if (res.success && res.data) setAchievements(res.data)
      } catch (error) {
        console.error("Erro ao carregar conquistas:", error)
      }
    }
    if (isAuthenticated) loadAchievements()
  }, [isAuthenticated])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl animate-pulse" />
            <Loader2 className="relative h-10 w-10 animate-spin text-orange-500" />
          </div>
          <p className="text-zinc-500">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  // Adaptar user do auth para o formato esperado pelo ProfileHeader
  const profileUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    bio: "Entusiasta fitness",
    level: user.level,
    xp: user.xp,
    totalCheckins: 42,
    totalFavorites: 8,
    totalAchievements: 12,
    memberSince: "2024-01-15",
    favoriteGyms: [],
    preferences: {
      notifications: true,
      newsletter: true,
      language: "pt-BR",
      theme: "dark" as const,
    },
  }

  return (
    <AppShell>
      <div className="min-h-screen bg-zinc-950 pb-20 lg:pb-8">
        <Header />

        <main className="mx-auto max-w-4xl">
          <ProfileHeader user={profileUser} />

          <div className="space-y-6 py-6 px-4 lg:px-0">
            <AchievementsPreview achievements={achievements} />

            <ProfileMenu />
          </div>
        </main>
      </div>
    </AppShell>
  )
}
