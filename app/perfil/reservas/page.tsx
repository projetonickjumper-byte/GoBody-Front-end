"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Calendar, Clock, MapPin, X, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AppShell } from "@/components/app-shell"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { reservationsService } from "@/lib/api/services/reservations.service"

interface Reservation {
  id: string
  gymId: string
  gymName?: string
  gymImage?: string
  type: "aula" | "personal" | "espaco"
  title: string
  date: string
  time: string
  status: "confirmada" | "pendente" | "cancelada" | "concluida"
  instructor?: string
}

const mockReservations: Reservation[] = [
  {
    id: "1",
    gymId: "1",
    type: "aula",
    title: "Spinning Intenso",
    date: "2026-02-01",
    time: "07:00",
    status: "confirmada",
    instructor: "Carlos Silva",
  },
  {
    id: "2",
    gymId: "2",
    type: "personal",
    title: "Treino Funcional",
    date: "2026-02-02",
    time: "18:00",
    status: "pendente",
    instructor: "Ana Costa",
  },
  {
    id: "3",
    gymId: "1",
    type: "aula",
    title: "Yoga Flow",
    date: "2026-01-28",
    time: "09:00",
    status: "concluida",
    instructor: "Marina Santos",
  },
  {
    id: "4",
    gymId: "3",
    type: "aula",
    title: "CrossFit WOD",
    date: "2026-01-25",
    time: "06:00",
    status: "cancelada",
    instructor: "Pedro Oliveira",
  },
]

const statusConfig = {
  confirmada: { label: "Confirmada", color: "bg-success text-success-foreground", icon: CheckCircle },
  pendente: { label: "Pendente", color: "bg-warning text-warning-foreground", icon: AlertCircle },
  cancelada: { label: "Cancelada", color: "bg-destructive text-destructive-foreground", icon: X },
  concluida: { label: "Concluida", color: "bg-muted text-muted-foreground", icon: CheckCircle },
}

export default function ReservasPage() {
  const [reservations, setReservations] = useState(mockReservations)

  useEffect(() => {
    async function loadReservations() {
      try {
        const res = await reservationsService.getAll()
        if (res.success && res.data && res.data.length > 0) {
          const mapped: Reservation[] = res.data.map((r: any) => ({
            id: r.id,
            gymId: r.gymId,
            type: r.type || "aula",
            title: r.className || r.type || "Reserva",
            date: r.date,
            time: r.time,
            status: r.status === "confirmed" ? "confirmada" : r.status === "pending" ? "pendente" : r.status === "cancelled" ? "cancelada" : "concluida",
            instructor: r.instructorName,
          }))
          setReservations(mapped)
        }
      } catch (error) {
        console.error("Erro ao carregar reservas:", error)
      }
    }
    loadReservations()
  }, [])

  const upcomingReservations = reservations.filter(
    (r) => r.status === "confirmada" || r.status === "pendente"
  )
  const pastReservations = reservations.filter(
    (r) => r.status === "concluida" || r.status === "cancelada"
  )

  const handleCancel = async (id: string) => {
    try {
      await reservationsService.cancel(id)
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "cancelada" as const } : r))
      )
    } catch (error) {
      console.error("Erro ao cancelar reserva:", error)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("pt-BR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    })
  }

  return (
    <AppShell>
      <div className="min-h-screen bg-background pb-20 lg:pb-6">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="flex items-center gap-4 p-4 max-w-4xl mx-auto">
            <Link href="/perfil" className="lg:hidden">
              <Button variant="ghost" size="icon" className="shrink-0">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Minhas Reservas</h1>
          </div>
        </div>

        <div className="p-4 max-w-4xl mx-auto">
          <Tabs defaultValue="proximas" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="proximas">
                Proximas ({upcomingReservations.length})
              </TabsTrigger>
              <TabsTrigger value="historico">
                Historico ({pastReservations.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="proximas" className="space-y-4">
              {upcomingReservations.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {upcomingReservations.map((reservation) => {
                    const status = statusConfig[reservation.status]
                    const StatusIcon = status.icon

                    return (
                      <div
                        key={reservation.id}
                        className="rounded-xl bg-card border border-border overflow-hidden"
                      >
                        <div className="relative h-32">
                          <Image
                            src={reservation.gymImage || "/placeholder.svg"}
                            alt={reservation.gymName || "Academia"}
                            fill
                            className="object-cover"
                          />
                          <Badge className={`absolute top-2 right-2 ${status.color}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {status.label}
                          </Badge>
                        </div>

                        <div className="p-4">
                          <h3 className="font-semibold text-foreground">{reservation.title}</h3>
                          <p className="text-sm text-muted-foreground">{reservation.gymName}</p>

                          <div className="mt-3 space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(reservation.date)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>{reservation.time}</span>
                            </div>
                            {reservation.instructor && (
                              <p className="text-sm text-muted-foreground">
                                Instrutor: {reservation.instructor}
                              </p>
                            )}
                          </div>

                          <div className="mt-4 flex gap-2">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                                  Cancelar
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Cancelar Reserva</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja cancelar esta reserva? Esta acao nao pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Voltar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleCancel(reservation.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Confirmar Cancelamento
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                            <Button size="sm" className="flex-1">
                              Ver Detalhes
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium text-foreground mb-2">Nenhuma reserva ativa</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Voce ainda nao tem reservas agendadas
                  </p>
                  <Button asChild>
                    <Link href="/explorar">Explorar Academias</Link>
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="historico" className="space-y-4">
              {pastReservations.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {pastReservations.map((reservation) => {
                    const status = statusConfig[reservation.status]
                    const StatusIcon = status.icon

                    return (
                      <div
                        key={reservation.id}
                        className="rounded-xl bg-card border border-border p-4 opacity-75"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground">{reservation.title}</h3>
                            <p className="text-sm text-muted-foreground">{reservation.gymName}</p>
                          </div>
                          <Badge className={status.color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {status.label}
                          </Badge>
                        </div>

                        <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(reservation.date)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{reservation.time}</span>
                          </div>
                        </div>

                        {reservation.status === "concluida" && (
                          <Button variant="outline" size="sm" className="mt-3 w-full bg-transparent">
                            Reservar Novamente
                          </Button>
                        )}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-sm text-muted-foreground">
                    Nenhuma reserva no historico
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppShell>
  )
}
