"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { 
  Calendar,
  Clock,
  MapPin,
  Plus,
  Filter,
  ChevronRight,
  Users,
  Dumbbell,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AppShell } from "@/components/app-shell"
import { Header } from "@/components/header"
import { reservationsService } from "@/lib/api/services/reservations.service"
import { gymsService } from "@/lib/api/services/gyms.service"
import { useAuth } from "@/lib/auth-context"
import type { Gym } from "@/lib/types"

interface Reservation {
  id: string
  type: "aula" | "personal" | "day-use" | "espaco"
  title: string
  gymId: string
  gymName: string
  gymImage: string
  date: string
  time: string
  duration: string
  status: "confirmada" | "pendente" | "cancelada" | "concluida"
  instructor?: string
  participants?: number
  maxParticipants?: number
  price?: number
}

const reservations: Reservation[] = [
  {
    id: "r1",
    type: "aula",
    title: "Spinning Avancado",
    gymId: "1",
    gymName: "Academia Elite Fitness",
    gymImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400",
    date: "2026-01-31",
    time: "07:00",
    duration: "45min",
    status: "confirmada",
    instructor: "Prof. Carlos",
    participants: 12,
    maxParticipants: 15
  },
  {
    id: "r2",
    type: "personal",
    title: "Treino Personal",
    gymId: "2",
    gymName: "CrossFit Box SP",
    gymImage: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400",
    date: "2026-02-01",
    time: "18:00",
    duration: "1h",
    status: "pendente",
    instructor: "Personal Marina"
  },
  {
    id: "r3",
    type: "day-use",
    title: "Day Use",
    gymId: "3",
    gymName: "Yoga Flow Studio",
    gymImage: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400",
    date: "2026-02-03",
    time: "10:00",
    duration: "Dia inteiro",
    status: "confirmada",
    price: 39.90
  },
  {
    id: "r4",
    type: "aula",
    title: "Yoga Matinal",
    gymId: "3",
    gymName: "Yoga Flow Studio",
    gymImage: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400",
    date: "2026-01-28",
    time: "06:30",
    duration: "1h",
    status: "concluida",
    instructor: "Prof. Ana"
  },
  {
    id: "r5",
    type: "espaco",
    title: "Quadra de Beach Tennis",
    gymId: "1",
    gymName: "Academia Elite Fitness",
    gymImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400",
    date: "2026-01-25",
    time: "14:00",
    duration: "1h",
    status: "cancelada",
    price: 60.00
  }
]

// Classes são carregadas dinamicamente
const defaultClasses = [
  {
    id: "c1",
    title: "HIIT Extreme",
    gymName: "Academia",
    gymImage: "/placeholder.svg",
    gymSlug: "",
    date: "2026-01-31",
    time: "19:00",
    duration: "30min",
    instructor: "Prof. Ricardo",
    spots: 5,
    maxSpots: 20
  },
  {
    id: "c2",
    title: "Pilates Reformer",
    gymName: "Academia",
    gymImage: "/placeholder.svg",
    gymSlug: "",
    date: "2026-01-31",
    time: "20:00",
    duration: "50min",
    instructor: "Prof. Julia",
    spots: 2,
    maxSpots: 8
  },
  {
    id: "c3",
    title: "Muay Thai",
    gymName: "Academia",
    gymImage: "/placeholder.svg",
    gymSlug: "",
    date: "2026-02-01",
    time: "18:30",
    duration: "1h",
    instructor: "Prof. Diego",
    spots: 8,
    maxSpots: 15
  }
]

function getStatusInfo(status: Reservation["status"]) {
  switch (status) {
    case "confirmada":
      return { label: "Confirmada", color: "bg-green-500/20 text-green-400", icon: CheckCircle }
    case "pendente":
      return { label: "Pendente", color: "bg-yellow-500/20 text-yellow-400", icon: AlertCircle }
    case "cancelada":
      return { label: "Cancelada", color: "bg-red-500/20 text-red-400", icon: XCircle }
    case "concluida":
      return { label: "Concluida", color: "bg-muted text-muted-foreground", icon: CheckCircle }
    default:
      return { label: status, color: "bg-muted text-muted-foreground", icon: AlertCircle }
  }
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (date.toDateString() === today.toDateString()) return "Hoje"
  if (date.toDateString() === tomorrow.toDateString()) return "Amanha"

  return date.toLocaleDateString("pt-BR", { weekday: "short", day: "numeric", month: "short" })
}

export default function ReservasPage() {
  const [filter, setFilter] = useState("all")
  const [apiReservations, setApiReservations] = useState<Reservation[]>(reservations)
  const [availableGyms, setAvailableGyms] = useState<Gym[]>([])
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    async function loadReservations() {
      try {
        const [resReservations, resGyms] = await Promise.all([
          reservationsService.getAll(),
          gymsService.getAll({ pageSize: 3 }),
        ])
        if (resReservations.success && resReservations.data && resReservations.data.length > 0) {
          const mapped: Reservation[] = resReservations.data.map((r: any) => ({
            id: r.id,
            type: r.type || "aula",
            title: r.className || r.type || "Reserva",
            gymId: r.gymId,
            gymName: r.gymName || "Academia",
            gymImage: r.gymImage || "/placeholder.svg",
            date: r.date,
            time: r.time,
            duration: "1h",
            status: r.status === "confirmed" ? "confirmada" : r.status === "pending" ? "pendente" : r.status === "cancelled" ? "cancelada" : "concluida",
            instructor: r.instructorName,
          }))
          setApiReservations(mapped)
        }
        if (resGyms.success && resGyms.data) {
          setAvailableGyms(resGyms.data)
        }
      } catch (error) {
        console.error("Erro ao carregar reservas:", error)
      }
    }
    if (isAuthenticated) loadReservations()
  }, [isAuthenticated])

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  const activeReservations = apiReservations.filter(r => r.status === "confirmada" || r.status === "pendente")
  const pastReservations = apiReservations.filter(r => r.status === "concluida" || r.status === "cancelada")

  const filteredActive = filter === "all" 
    ? activeReservations 
    : activeReservations.filter(r => r.type === filter)

  return (
    <AppShell>
      <div className="min-h-screen bg-background pb-24 lg:pb-8">
        <Header />

        <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Minhas Reservas</h1>
              <p className="text-sm text-muted-foreground">Gerencie suas aulas e agendamentos</p>
            </div>
            <Button asChild>
              <Link href="/explorar">
                <Plus className="mr-2 h-4 w-4" />
                Nova Reserva
              </Link>
            </Button>
          </div>

          <Tabs defaultValue="minhas" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="minhas">Minhas Reservas</TabsTrigger>
              <TabsTrigger value="agendar">Agendar</TabsTrigger>
            </TabsList>

            <TabsContent value="minhas" className="space-y-6">
              {/* Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-[180px] bg-card border-border">
                    <SelectValue placeholder="Filtrar por tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="aula">Aulas</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="day-use">Day Use</SelectItem>
                    <SelectItem value="espaco">Espacos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Active Reservations */}
              <div>
                <h2 className="mb-3 text-lg font-semibold text-foreground">Proximas</h2>
                {filteredActive.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Nenhuma reserva encontrada</p>
                      <Button variant="link" asChild className="mt-2">
                        <Link href="/explorar">Explorar academias</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {filteredActive.map((reservation) => {
                      const statusInfo = getStatusInfo(reservation.status)
                      const StatusIcon = statusInfo.icon
                      return (
                        <Card key={reservation.id} className="overflow-hidden">
                          <CardContent className="p-0">
                            <div className="flex gap-4 p-4">
                              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                                <Image
                                  src={reservation.gymImage || "/placeholder.svg"}
                                  alt={reservation.gymName}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <h3 className="font-semibold text-foreground">{reservation.title}</h3>
                                    <p className="text-sm text-muted-foreground">{reservation.gymName}</p>
                                  </div>
                                  <Badge className={statusInfo.color}>
                                    <StatusIcon className="mr-1 h-3 w-3" />
                                    {statusInfo.label}
                                  </Badge>
                                </div>
                                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3.5 w-3.5" />
                                    {formatDate(reservation.date)}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5" />
                                    {reservation.time} ({reservation.duration})
                                  </span>
                                  {reservation.instructor && (
                                    <span className="flex items-center gap-1">
                                      <Users className="h-3.5 w-3.5" />
                                      {reservation.instructor}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex border-t border-border">
                              <Link
                                href={`/academia/${reservation.gymId}`}
                                className="flex-1 py-3 text-center text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                              >
                                Ver Academia
                              </Link>
                              {reservation.status === "pendente" && (
                                <button
                                  type="button"
                                  className="flex-1 border-l border-border py-3 text-center text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                                >
                                  Cancelar
                                </button>
                              )}
                              {reservation.status === "confirmada" && (
                                <button
                                  type="button"
                                  className="flex-1 border-l border-border py-3 text-center text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
                                >
                                  Check-in
                                </button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Past Reservations */}
              <div>
                <h2 className="mb-3 text-lg font-semibold text-foreground">Historico</h2>
                <div className="space-y-3">
                  {pastReservations.map((reservation) => {
                    const statusInfo = getStatusInfo(reservation.status)
                    const StatusIcon = statusInfo.icon
                    return (
                      <Card key={reservation.id} className="opacity-70">
                        <CardContent className="flex items-center gap-4 p-4">
                          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                            <Image
                              src={reservation.gymImage || "/placeholder.svg"}
                              alt={reservation.gymName}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-foreground">{reservation.title}</h3>
                            <p className="text-sm text-muted-foreground">{reservation.gymName}</p>
                            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{formatDate(reservation.date)}</span>
                              <span>{reservation.time}</span>
                            </div>
                          </div>
                          <Badge variant="outline" className={statusInfo.color}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {statusInfo.label}
                          </Badge>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="agendar" className="space-y-6">
              <div>
                <h2 className="mb-3 text-lg font-semibold text-foreground">Aulas Disponiveis</h2>
                <p className="mb-4 text-sm text-muted-foreground">Agende sua proxima aula nas academias parceiras</p>
                
                <div className="space-y-3">
                  {defaultClasses.map((cls, i) => {
                    const gym = availableGyms[i]
                    return (
                      <Card key={cls.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex gap-4 p-4">
                            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                              <Image
                                src={gym?.images?.[0] || cls.gymImage}
                                alt={gym?.name || cls.gymName}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h3 className="font-semibold text-foreground">{cls.title}</h3>
                                  <p className="text-sm text-muted-foreground">{gym?.name || cls.gymName}</p>
                                </div>
                                <Badge variant="outline" className={cls.spots <= 3 ? "border-primary text-primary" : ""}>
                                  {cls.spots} vagas
                                </Badge>
                              </div>
                              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3.5 w-3.5" />
                                  {formatDate(cls.date)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5" />
                                  {cls.time} ({cls.duration})
                                </span>
                                <span className="flex items-center gap-1">
                                  <Dumbbell className="h-3.5 w-3.5" />
                                  {cls.instructor}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex border-t border-border">
                            <Link
                              href={`/academia/${gym?.slug || cls.gymSlug}`}
                              className="flex-1 py-3 text-center text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                            >
                              Ver Academia
                            </Link>
                            <button
                              type="button"
                              className="flex-1 border-l border-border py-3 text-center text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
                            >
                              Reservar
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>

              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/explorar">
                  Ver todas as academias
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </AppShell>
  )
}
