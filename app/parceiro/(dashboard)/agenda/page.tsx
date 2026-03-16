"use client"

import { useState, useEffect } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  User,
  X,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { reservationsService } from "@/lib/api/services/reservations.service"
import { useAuth } from "@/lib/auth-context"

interface Appointment {
  id: string
  clientName: string
  clientAvatar: string | null
  service: string
  date: string
  time: string
  duration: number
  status: "confirmed" | "pending" | "cancelled" | "completed"
  notes?: string
}

const mockAppointments: Appointment[] = [
  {
    id: "1",
    clientName: "Maria Santos",
    clientAvatar: null,
    service: "Personal Trainer",
    date: "2024-01-15",
    time: "08:00",
    duration: 60,
    status: "confirmed",
  },
  {
    id: "2",
    clientName: "Pedro Lima",
    clientAvatar: null,
    service: "CrossFit",
    date: "2024-01-15",
    time: "09:00",
    duration: 60,
    status: "confirmed",
  },
  {
    id: "3",
    clientName: "Ana Costa",
    clientAvatar: null,
    service: "Yoga",
    date: "2024-01-15",
    time: "10:00",
    duration: 60,
    status: "pending",
  },
  {
    id: "4",
    clientName: "Lucas Oliveira",
    clientAvatar: null,
    service: "Personal Trainer",
    date: "2024-01-15",
    time: "14:00",
    duration: 60,
    status: "confirmed",
  },
  {
    id: "5",
    clientName: "Julia Ferreira",
    clientAvatar: null,
    service: "Musculacao",
    date: "2024-01-15",
    time: "15:00",
    duration: 60,
    status: "completed",
  },
  {
    id: "6",
    clientName: "Roberto Alves",
    clientAvatar: null,
    service: "Spinning",
    date: "2024-01-16",
    time: "07:00",
    duration: 45,
    status: "confirmed",
  },
]

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"]
const timeSlots = Array.from({ length: 14 }, (_, i) => `${String(i + 6).padStart(2, "0")}:00`)

export default function AgendaPage() {
  const { user } = useAuth()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [allAppointments, setAllAppointments] = useState<Appointment[]>(mockAppointments)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [view, setView] = useState<"week" | "day">("week")

  useEffect(() => {
    async function loadAppointments() {
      try {
        const res = await reservationsService.getAll()
        if (res.success && res.data && res.data.length > 0) {
          const mapped: Appointment[] = res.data.map((r: any) => ({
            id: r.id,
            clientName: r.gymName || "Cliente",
            clientAvatar: null,
            service: r.className || r.type || "Serviço",
            date: r.date,
            time: r.time,
            duration: 60,
            status: r.status,
            notes: "",
          }))
          setAllAppointments(mapped)
        }
      } catch (error) {
        console.error("Erro ao carregar agenda:", error)
      }
    }
    loadAppointments()
  }, [user?.id])

  const getWeekDates = () => {
    const dates = []
    const startOfWeek = new Date(currentDate)
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const weekDates = getWeekDates()

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  const getAppointmentsForDate = (date: Date) => {
    return allAppointments.filter(a => a.date === formatDate(date))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/20 text-green-500 border-green-500/30"
      case "pending":
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
      case "cancelled":
        return "bg-red-500/20 text-red-500 border-red-500/30"
      case "completed":
        return "bg-blue-500/20 text-blue-500 border-blue-500/30"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmado"
      case "pending":
        return "Pendente"
      case "cancelled":
        return "Cancelado"
      case "completed":
        return "Concluido"
      default:
        return status
    }
  }

  const navigateWeek = (direction: number) => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + direction * 7)
    setCurrentDate(newDate)
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return formatDate(date) === formatDate(today)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Agenda</h1>
          <p className="text-muted-foreground">Gerencie seus agendamentos</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className={view === "day" ? "bg-secondary" : "bg-transparent"} onClick={() => setView("day")}>
            Dia
          </Button>
          <Button variant="outline" size="sm" className={view === "week" ? "bg-secondary" : "bg-transparent"} onClick={() => setView("week")}>
            Semana
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Agendamento
          </Button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => navigateWeek(-1)}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-lg font-semibold text-foreground">
          {weekDates[0].toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
        </h2>
        <Button variant="ghost" size="icon" onClick={() => navigateWeek(1)}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Week View */}
      {view === "week" && (
        <div className="grid grid-cols-7 gap-2">
          {weekDates.map((date, index) => {
            const appointments = getAppointmentsForDate(date)
            const dayIsToday = isToday(date)
            
            return (
              <Card 
                key={index} 
                className={cn(
                  "bg-card border-border min-h-[200px]",
                  dayIsToday && "border-primary"
                )}
              >
                <CardHeader className="p-3 pb-2">
                  <div className={cn(
                    "text-center",
                    dayIsToday && "text-primary"
                  )}>
                    <p className="text-xs text-muted-foreground">{weekDays[index]}</p>
                    <p className={cn(
                      "text-lg font-bold",
                      dayIsToday && "bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center mx-auto"
                    )}>
                      {date.getDate()}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="p-2 space-y-1">
                  {appointments.slice(0, 3).map((apt) => (
                    <button
                      key={apt.id}
                      onClick={() => setSelectedAppointment(apt)}
                      className={cn(
                        "w-full text-left rounded-md p-2 text-xs border transition-colors hover:opacity-80",
                        getStatusColor(apt.status)
                      )}
                    >
                      <p className="font-medium truncate">{apt.time} - {apt.service}</p>
                      <p className="truncate opacity-80">{apt.clientName}</p>
                    </button>
                  ))}
                  {appointments.length > 3 && (
                    <p className="text-xs text-muted-foreground text-center py-1">
                      +{appointments.length - 3} mais
                    </p>
                  )}
                  {appointments.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-4">
                      Sem agendamentos
                    </p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Day View */}
      {view === "day" && (
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              {currentDate.toLocaleDateString("pt-BR", { 
                weekday: "long", 
                day: "numeric",
                month: "long" 
              })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {timeSlots.map((time) => {
                const appointments = mockAppointments.filter(
                  a => a.date === formatDate(currentDate) && a.time === time
                )
                
                return (
                  <div key={time} className="flex gap-4 py-2 border-b border-border last:border-0">
                    <span className="w-16 text-sm text-muted-foreground shrink-0">{time}</span>
                    <div className="flex-1 space-y-2">
                      {appointments.map((apt) => (
                        <button
                          key={apt.id}
                          onClick={() => setSelectedAppointment(apt)}
                          className={cn(
                            "w-full text-left rounded-lg p-3 border transition-colors hover:opacity-80",
                            getStatusColor(apt.status)
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={apt.clientAvatar || undefined} />
                                <AvatarFallback className="text-xs">
                                  {apt.clientName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{apt.clientName}</p>
                                <p className="text-sm opacity-80">{apt.service}</p>
                              </div>
                            </div>
                            <div className="text-right text-sm">
                              <p>{apt.duration} min</p>
                            </div>
                          </div>
                        </button>
                      ))}
                      {appointments.length === 0 && (
                        <div className="h-8 rounded-lg border-2 border-dashed border-border" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Appointment Detail Dialog */}
      <Dialog open={!!selectedAppointment} onOpenChange={() => setSelectedAppointment(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do Agendamento</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedAppointment.clientAvatar || undefined} />
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {selectedAppointment.clientName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">{selectedAppointment.clientName}</p>
                  <p className="text-sm text-muted-foreground">{selectedAppointment.service}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Data</p>
                  <p className="font-medium text-foreground">
                    {new Date(selectedAppointment.date).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Horario</p>
                  <p className="font-medium text-foreground">{selectedAppointment.time}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Duracao</p>
                  <p className="font-medium text-foreground">{selectedAppointment.duration} min</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge className={getStatusColor(selectedAppointment.status)}>
                    {getStatusLabel(selectedAppointment.status)}
                  </Badge>
                </div>
              </div>

              {selectedAppointment.status === "pending" && (
                <div className="flex gap-3 pt-4 border-t border-border">
                  <Button className="flex-1 bg-transparent" variant="outline">
                    <X className="mr-2 h-4 w-4" />
                    Recusar
                  </Button>
                  <Button className="flex-1">
                    <Check className="mr-2 h-4 w-4" />
                    Confirmar
                  </Button>
                </div>
              )}

              {selectedAppointment.status === "confirmed" && (
                <div className="flex gap-3 pt-4 border-t border-border">
                  <Button className="flex-1 bg-transparent" variant="outline">
                    Cancelar
                  </Button>
                  <Button className="flex-1">
                    Marcar como concluido
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
