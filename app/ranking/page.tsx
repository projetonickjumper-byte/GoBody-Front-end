"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { 
  Trophy,
  Flame,
  Target,
  Gift,
  Medal,
  Crown,
  TrendingUp,
  Calendar,
  ChevronRight,
  Star,
  Zap
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { AppShell } from "@/components/app-shell"
import { Header } from "@/components/header"
import { rankingService } from "@/lib/api/services/ranking.service"
import { useAuth } from "@/lib/auth-context"

interface RankingEntry {
  position: number
  userId: string
  userName: string
  userAvatar: string
  points: number
  checkins: number
  streak: number
  level: number
  change: number
}

const globalRanking: RankingEntry[] = [
  { position: 1, userId: "u10", userName: "Pedro Silva", userAvatar: "https://i.pravatar.cc/150?img=10", points: 4520, checkins: 156, streak: 45, level: 12, change: 0 },
  { position: 2, userId: "u11", userName: "Ana Costa", userAvatar: "https://i.pravatar.cc/150?img=11", points: 4180, checkins: 142, streak: 38, level: 11, change: 2 },
  { position: 3, userId: "u12", userName: "Lucas Mendes", userAvatar: "https://i.pravatar.cc/150?img=12", points: 3890, checkins: 128, streak: 32, level: 10, change: -1 },
  { position: 4, userId: "u1", userName: currentUser.name, userAvatar: currentUser.avatar || "", points: currentUser.xp, checkins: currentUser.totalCheckins, streak: 15, level: currentUser.level, change: 3 },
  { position: 5, userId: "u13", userName: "Julia Santos", userAvatar: "https://i.pravatar.cc/150?img=13", points: 3200, checkins: 98, streak: 21, level: 8, change: -2 },
  { position: 6, userId: "u14", userName: "Rafael Lima", userAvatar: "https://i.pravatar.cc/150?img=14", points: 2980, checkins: 89, streak: 18, level: 7, change: 1 },
  { position: 7, userId: "u15", userName: "Camila Rocha", userAvatar: "https://i.pravatar.cc/150?img=15", points: 2750, checkins: 82, streak: 14, level: 7, change: 0 },
  { position: 8, userId: "u16", userName: "Thiago Alves", userAvatar: "https://i.pravatar.cc/150?img=16", points: 2580, checkins: 76, streak: 12, level: 6, change: 4 },
  { position: 9, userId: "u17", userName: "Fernanda Dias", userAvatar: "https://i.pravatar.cc/150?img=17", points: 2420, checkins: 71, streak: 10, level: 6, change: -3 },
  { position: 10, userId: "u18", userName: "Bruno Martins", userAvatar: "https://i.pravatar.cc/150?img=18", points: 2280, checkins: 65, streak: 8, level: 5, change: 1 },
]

const challenges = [
  { id: "ch1", title: "Maratona de Janeiro", description: "Faca 20 check-ins ate o fim do mes", progress: 15, total: 20, reward: 500, endDate: "2026-01-31", icon: Target },
  { id: "ch2", title: "Streak Master", description: "Mantenha 30 dias seguidos de treino", progress: 15, total: 30, reward: 750, endDate: "2026-02-28", icon: Flame },
  { id: "ch3", title: "Explorador", description: "Visite 5 academias diferentes", progress: 3, total: 5, reward: 300, endDate: "2026-02-15", icon: Star },
]

const rewards = [
  { id: "rw1", title: "1 Day Use Gratis", points: 500, image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200" },
  { id: "rw2", title: "20% OFF Plano Mensal", points: 1000, image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=200" },
  { id: "rw3", title: "Camiseta FitApp", points: 1500, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200" },
  { id: "rw4", title: "1 Sessao Personal", points: 2500, image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200" },
]

const getMedalStyle = (position: number) => {
  if (position === 1) return { bg: "bg-amber-400/20", text: "text-amber-400", border: "border-amber-400" }
  if (position === 2) return { bg: "bg-zinc-400/20", text: "text-zinc-400", border: "border-zinc-400" }
  if (position === 3) return { bg: "bg-amber-600/20", text: "text-amber-600", border: "border-amber-600" }
  return { bg: "bg-muted", text: "text-muted-foreground", border: "border-border" }
}

export default function RankingPage() {
  const [period, setPeriod] = useState("monthly")
  const [rankingData, setRankingData] = useState<RankingEntry[]>(globalRanking)
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()
  const currentUserEntry = rankingData.find(e => e.userId === user?.id || e.userId === "u1")

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    async function loadRanking() {
      try {
        const res = await rankingService.getRanking()
        if (res.success && res.data && res.data.length > 0) {
          const mapped = res.data.map((entry, index) => ({
            position: entry.position || index + 1,
            userId: entry.userId,
            userName: entry.userName,
            userAvatar: entry.userAvatar,
            points: entry.points,
            checkins: entry.checkins,
            streak: entry.streak,
            level: 1,
            change: 0,
          }))
          setRankingData(mapped)
        }
      } catch (error) {
        console.error("Erro ao carregar ranking:", error)
      }
    }
    if (isAuthenticated) loadRanking()
  }, [isAuthenticated])

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <AppShell>
      <div className="min-h-screen bg-background pb-20 lg:pb-8">
        <Header />

        <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Trophy className="h-6 w-6 text-primary" />
              FitRank Global
            </h1>
            <p className="text-sm text-muted-foreground">Compita com usuarios de todo o Brasil</p>
          </div>

          {/* Current User Card */}
          {currentUserEntry && (
            <Card className="mb-6 border-primary/50 bg-gradient-to-r from-primary/10 to-transparent">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-full border-2",
                    getMedalStyle(currentUserEntry.position).bg,
                    getMedalStyle(currentUserEntry.position).border
                  )}>
                    <span className={cn("text-xl font-bold", getMedalStyle(currentUserEntry.position).text)}>
                      {currentUserEntry.position}
                    </span>
                  </div>
                  <Avatar className="h-14 w-14 border-2 border-primary">
                    <AvatarImage src={currentUserEntry.userAvatar || "/placeholder.svg"} alt={currentUserEntry.userName} />
                    <AvatarFallback>{currentUserEntry.userName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{currentUserEntry.userName}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="font-medium text-primary">{currentUserEntry.points} pts</span>
                      <span className="flex items-center gap-1">
                        <Flame className="h-4 w-4 text-primary" />
                        {currentUserEntry.streak} dias
                      </span>
                      <span>Nivel {currentUserEntry.level}</span>
                    </div>
                  </div>
                  {currentUserEntry.change !== 0 && (
                    <Badge variant={currentUserEntry.change > 0 ? "default" : "destructive"} className="flex items-center gap-1">
                      <TrendingUp className={cn("h-3 w-3", currentUserEntry.change < 0 && "rotate-180")} />
                      {Math.abs(currentUserEntry.change)}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="ranking" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="ranking">Ranking</TabsTrigger>
              <TabsTrigger value="desafios">Desafios</TabsTrigger>
              <TabsTrigger value="recompensas">Recompensas</TabsTrigger>
            </TabsList>

            <TabsContent value="ranking" className="space-y-6">
              {/* Period Filter */}
              <div className="flex gap-2">
                {["monthly", "quarterly", "annual", "alltime"].map((p) => (
                  <Button
                    key={p}
                    variant={period === p ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPeriod(p)}
                    className={period !== p ? "bg-transparent" : ""}
                  >
                    {p === "monthly" && "Mensal"}
                    {p === "quarterly" && "Trimestral"}
                    {p === "annual" && "Anual"}
                    {p === "alltime" && "Geral"}
                  </Button>
                ))}
              </div>

              {/* Top 3 Podium */}
              <div className="flex justify-center items-end gap-4 py-6">
                {[1, 0, 2].map((index) => {
                  const entry = rankingData[index]
                  if (!entry) return null
                  const style = getMedalStyle(entry.position)
                  const sizes = {
                    0: { avatar: "h-20 w-20", podium: "h-32", crown: true },
                    1: { avatar: "h-16 w-16", podium: "h-24", crown: false },
                    2: { avatar: "h-14 w-14", podium: "h-20", crown: false },
                  }
                  const size = sizes[index as keyof typeof sizes]
                  
                  return (
                    <div key={entry.userId} className="flex flex-col items-center gap-2">
                      <div className="relative">
                        {size.crown && (
                          <Crown className="absolute -top-6 left-1/2 -translate-x-1/2 h-8 w-8 text-amber-400" />
                        )}
                        <Avatar className={cn(size.avatar, "border-2", style.border)}>
                          <AvatarImage src={entry.userAvatar || "/placeholder.svg"} alt={entry.userName} />
                          <AvatarFallback>{entry.userName.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </div>
                      <p className="text-sm font-medium text-foreground text-center max-w-[80px] truncate">
                        {entry.userName}
                      </p>
                      <p className="text-xs text-primary font-semibold">{entry.points} pts</p>
                      <div className={cn(
                        "w-24 rounded-t-lg flex flex-col items-center justify-end pb-3",
                        style.bg,
                        size.podium
                      )}>
                        <Medal className={cn("h-6 w-6", style.text)} />
                        <span className={cn("text-2xl font-bold mt-1", style.text)}>{entry.position}</span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Rest of Ranking */}
              <div className="space-y-2">
                {rankingData.slice(3).map((entry) => {
                  const style = getMedalStyle(entry.position)
                  const isCurrentUser = entry.userId === "u1"
                  
                  return (
                    <Card key={entry.userId} className={cn(isCurrentUser && "border-primary/50 bg-primary/5")}>
                      <CardContent className="flex items-center gap-3 p-3">
                        <div className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full shrink-0",
                          style.bg
                        )}>
                          <span className={cn("font-bold", style.text)}>{entry.position}</span>
                        </div>
                        <Avatar className="h-10 w-10 shrink-0">
                          <AvatarImage src={entry.userAvatar || "/placeholder.svg"} alt={entry.userName} />
                          <AvatarFallback>{entry.userName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">{entry.userName}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{entry.checkins} check-ins</span>
                            <span className="flex items-center gap-0.5">
                              <Flame className="h-3 w-3 text-primary" />
                              {entry.streak}
                            </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-bold text-foreground">{entry.points}</p>
                          <p className="text-xs text-muted-foreground">pontos</p>
                        </div>
                        {entry.change !== 0 && (
                          <TrendingUp className={cn(
                            "h-4 w-4 shrink-0",
                            entry.change > 0 ? "text-green-500" : "text-red-500 rotate-180"
                          )} />
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Points Info */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    Como ganhar pontos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                    {[
                      { action: "Check-in", points: 10, icon: Target },
                      { action: "Aula coletiva", points: 15, icon: Target },
                      { action: "Streak 7 dias", points: 50, icon: Flame },
                      { action: "Indicacao", points: 100, icon: Gift },
                      { action: "Desafio", points: 200, icon: Trophy },
                    ].map((info) => (
                      <div
                        key={info.action}
                        className="flex items-center gap-2 rounded-lg bg-secondary p-3"
                      >
                        <info.icon className="h-4 w-4 text-primary shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-foreground">+{info.points}</p>
                          <p className="text-xs text-muted-foreground">{info.action}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="desafios" className="space-y-4">
              <div className="mb-2">
                <h2 className="text-lg font-semibold text-foreground">Desafios Ativos</h2>
                <p className="text-sm text-muted-foreground">Complete desafios e ganhe pontos extras</p>
              </div>

              {challenges.map((challenge) => {
                const Icon = challenge.icon
                const progressPercent = (challenge.progress / challenge.total) * 100
                const daysLeft = Math.ceil((new Date(challenge.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))

                return (
                  <Card key={challenge.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 shrink-0">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-semibold text-foreground">{challenge.title}</h3>
                              <p className="text-sm text-muted-foreground">{challenge.description}</p>
                            </div>
                            <Badge variant="outline" className="shrink-0">
                              <Gift className="mr-1 h-3 w-3 text-primary" />
                              {challenge.reward} pts
                            </Badge>
                          </div>
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-muted-foreground">
                                {challenge.progress}/{challenge.total}
                              </span>
                              <span className="text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                {daysLeft} dias restantes
                              </span>
                            </div>
                            <Progress value={progressPercent} className="h-2" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}

              <Button variant="outline" className="w-full bg-transparent">
                Ver desafios concluidos
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </TabsContent>

            <TabsContent value="recompensas" className="space-y-4">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Recompensas</h2>
                  <p className="text-sm text-muted-foreground">Troque seus pontos por premios</p>
                </div>
                <Badge className="bg-primary text-primary-foreground">
                  {user?.xp || 0} pts disponiveis
                </Badge>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {rewards.map((reward) => {
                  const canRedeem = (user?.xp || 0) >= reward.points
                  return (
                    <Card key={reward.id} className={cn(!canRedeem && "opacity-60")}>
                      <CardContent className="p-0">
                        <div className="relative h-32 overflow-hidden rounded-t-lg">
                          <Image
                            src={reward.image || "/placeholder.svg"}
                            alt={reward.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-foreground">{reward.title}</h3>
                          <div className="mt-2 flex items-center justify-between">
                            <Badge variant="outline" className="text-primary border-primary">
                              {reward.points} pts
                            </Badge>
                            <Button size="sm" disabled={!canRedeem}>
                              {canRedeem ? "Resgatar" : "Pontos insuficientes"}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              <Button variant="outline" className="w-full bg-transparent">
                Ver todas as recompensas
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </AppShell>
  )
}
