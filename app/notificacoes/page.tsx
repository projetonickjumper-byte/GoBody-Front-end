"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Bell, Check, Trash2, Gift, Calendar, Trophy, Users, Zap, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AppShell } from "@/components/app-shell"
import { cn } from "@/lib/utils"
import { notificationsService } from "@/lib/api"

interface Notification {
  id: string
  type: "promo" | "reserva" | "conquista" | "social" | "sistema"
  title: string
  message: string
  time: string
  read: boolean
  actionUrl?: string
  image?: string
}

const initialNotifications: Notification[] = [
  {
    id: "1",
    type: "promo",
    title: "Oferta Relampago!",
    message: "50% OFF no Day Use da PowerFit Academia. Valido apenas hoje!",
    time: "Há 5 min",
    read: false,
    actionUrl: "/academia/powerfit",
  },
  {
    id: "2",
    type: "reserva",
    title: "Lembrete de Aula",
    message: "Sua aula de Spinning comeca em 1 hora. Nao se atrase!",
    time: "Há 30 min",
    read: false,
    actionUrl: "/perfil/reservas",
  },
  {
    id: "3",
    type: "conquista",
    title: "Nova Conquista!",
    message: "Voce desbloqueou a conquista 'Primeiro Check-in'. +50 XP",
    time: "Há 2 horas",
    read: false,
    actionUrl: "/perfil/conquistas",
  },
  {
    id: "4",
    type: "social",
    title: "Amigo Indicado",
    message: "Maria Silva se cadastrou usando seu codigo! Voce ganhou +100 XP",
    time: "Ontem",
    read: true,
    actionUrl: "/perfil/indicar",
  },
  {
    id: "5",
    type: "sistema",
    title: "Atualizacao do App",
    message: "Nova versao disponivel com melhorias de desempenho.",
    time: "2 dias atras",
    read: true,
  },
  {
    id: "6",
    type: "promo",
    title: "Plano Anual com 40% OFF",
    message: "Elite Fitness esta com promocao especial no plano anual.",
    time: "3 dias atras",
    read: true,
    actionUrl: "/academia/elite-fitness",
  },
]

const typeConfig = {
  promo: { icon: Zap, color: "bg-primary/20 text-primary" },
  reserva: { icon: Calendar, color: "bg-blue-500/20 text-blue-500" },
  conquista: { icon: Trophy, color: "bg-yellow-500/20 text-yellow-500" },
  social: { icon: Users, color: "bg-green-500/20 text-green-500" },
  sistema: { icon: Bell, color: "bg-muted text-muted-foreground" },
}

export default function NotificacoesPage() {
  const [notifications, setNotifications] = useState(initialNotifications)

  useEffect(() => {
    async function loadNotifications() {
      try {
        const res = await notificationsService.getAll()
        if (res.success && res.data && res.data.length > 0) {
          setNotifications(res.data as Notification[])
        }
      } catch (error) {
        console.error("Erro ao carregar notificações:", error)
      }
    }
    loadNotifications()
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  return (
    <AppShell>
      <div className="min-h-screen bg-background pb-20 lg:pb-6">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between p-4 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
              <Link href="/" className="lg:hidden">
                <Button variant="ghost" size="icon" className="shrink-0">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold">Notificacoes</h1>
                {unreadCount > 0 && (
                  <p className="text-sm text-muted-foreground">{unreadCount} nao lida(s)</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  <Check className="h-4 w-4 mr-1" />
                  Marcar todas
                </Button>
              )}
              <Link href="/perfil/notificacoes">
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="p-4 max-w-4xl mx-auto">
          {notifications.length > 0 ? (
            <div className="space-y-2">
              {notifications.map((notification) => {
                const config = typeConfig[notification.type]
                const Icon = config.icon

                const content = (
                  <div
                    className={cn(
                      "flex items-start gap-3 rounded-xl bg-card border p-4 transition-colors",
                      !notification.read
                        ? "border-primary/50 bg-primary/5"
                        : "border-border"
                    )}
                  >
                    <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", config.color)}>
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className={cn(
                            "font-medium text-foreground",
                            !notification.read && "font-semibold"
                          )}>
                            {notification.title}
                          </p>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {notification.message}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="h-2 w-2 shrink-0 rounded-full bg-primary mt-2" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        deleteNotification(notification.id)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )

                if (notification.actionUrl) {
                  return (
                    <Link
                      key={notification.id}
                      href={notification.actionUrl}
                      onClick={() => markAsRead(notification.id)}
                      className="block"
                    >
                      {content}
                    </Link>
                  )
                }

                return (
                  <div
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    className="cursor-pointer"
                  >
                    {content}
                  </div>
                )
              })}

              {notifications.length > 0 && (
                <div className="pt-4 text-center">
                  <Button variant="outline" onClick={clearAll} className="bg-transparent text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Limpar Todas
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Bell className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-foreground mb-2">Nenhuma notificacao</h3>
              <p className="text-sm text-muted-foreground">
                Voce esta em dia! Novas notificacoes aparecerao aqui.
              </p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
