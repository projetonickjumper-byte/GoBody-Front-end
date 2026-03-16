"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Calendar, MapPin, Clock, Star, Filter } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppShell } from "@/components/app-shell";
import { checkinsService } from "@/lib/api/services/checkins.service";
import { useAuth } from "@/lib/auth-context";

const historyData = [
  {
    id: "1",
    gymName: "Iron Temple Fitness",
    gymImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop",
    date: "2026-01-28",
    time: "07:30",
    duration: "1h 45min",
    type: "check-in",
    xpEarned: 150,
    rating: 5,
  },
  {
    id: "2",
    gymName: "CrossFit Arena",
    gymImage: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=200&h=200&fit=crop",
    date: "2026-01-26",
    time: "18:00",
    duration: "1h 20min",
    type: "day-use",
    xpEarned: 200,
    rating: 4,
  },
  {
    id: "3",
    gymName: "Zen Yoga Studio",
    gymImage: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=200&h=200&fit=crop",
    date: "2026-01-24",
    time: "06:00",
    duration: "1h 00min",
    type: "aula",
    className: "Yoga Flow",
    xpEarned: 100,
    rating: 5,
  },
  {
    id: "4",
    gymName: "Iron Temple Fitness",
    gymImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop",
    date: "2026-01-22",
    time: "08:00",
    duration: "2h 00min",
    type: "check-in",
    xpEarned: 175,
    rating: 5,
  },
  {
    id: "5",
    gymName: "PowerLift Gym",
    gymImage: "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=200&h=200&fit=crop",
    date: "2026-01-20",
    time: "19:30",
    duration: "1h 30min",
    type: "day-use",
    xpEarned: 180,
    rating: 4,
  },
];

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Hoje";
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return "Ontem";
  }

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

function getTypeLabel(type: string) {
  switch (type) {
    case "check-in":
      return "Check-in";
    case "day-use":
      return "Day Use";
    case "aula":
      return "Aula";
    default:
      return type;
  }
}

function getTypeColor(type: string) {
  switch (type) {
    case "check-in":
      return "bg-primary/20 text-primary";
    case "day-use":
      return "bg-blue-500/20 text-blue-400";
    case "aula":
      return "bg-green-500/20 text-green-400";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export default function HistoricoPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState("all");
  const [history, setHistory] = useState(historyData);

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await checkinsService.getHistory(user?.id || "");
        if (res.success && res.data && res.data.length > 0) {
          setHistory(res.data as any);
        }
      } catch (error) {
        console.error("Erro ao carregar histórico:", error);
      }
    }
    if (user?.id) loadHistory();
  }, [user?.id]);

  const filteredHistory =
    filter === "all"
      ? history
      : history.filter((item) => item.type === filter);

  const totalXP = filteredHistory.reduce((sum, item) => sum + item.xpEarned, 0);
  const totalVisits = filteredHistory.length;

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
            <h1 className="text-xl font-bold">Historico de Atividades</h1>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="p-4 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-card rounded-xl p-4 border border-border">
              <p className="text-muted-foreground text-sm">Total de Visitas</p>
              <p className="text-2xl font-bold text-foreground">{totalVisits}</p>
            </div>
            <div className="bg-card rounded-xl p-4 border border-border">
              <p className="text-muted-foreground text-sm">XP Ganho</p>
              <p className="text-2xl font-bold text-primary">+{totalXP}</p>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="px-4 pb-4 max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px] bg-card border-border">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="check-in">Check-ins</SelectItem>
                <SelectItem value="day-use">Day Use</SelectItem>
                <SelectItem value="aula">Aulas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* History List */}
        <div className="px-4 space-y-3 max-w-4xl mx-auto lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="bg-card rounded-xl p-4 border border-border"
            >
              <div className="flex gap-3">
                <div className="relative h-16 w-16 rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={item.gymImage || "/placeholder.svg"}
                    alt={item.gymName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-foreground truncate">
                        {item.gymName}
                      </h3>
                      {item.className && (
                        <p className="text-sm text-muted-foreground">
                          {item.className}
                        </p>
                      )}
                    </div>
                    <Badge className={getTypeColor(item.type)}>
                      {getTypeLabel(item.type)}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{formatDate(item.date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{item.time}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < item.rating
                              ? "fill-primary text-primary"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-1 text-primary font-medium">
                      <span>+{item.xpEarned} XP</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredHistory.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhuma atividade encontrada</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
