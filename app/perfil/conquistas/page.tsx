"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Trophy, Lock, Star, Flame, Target, Zap, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AppShell } from "@/components/app-shell";
import { rankingService } from "@/lib/api/services/ranking.service";

const allAchievements = [
  {
    id: "first-checkin",
    name: "Primeiro Passo",
    description: "Faca seu primeiro check-in",
    icon: Star,
    xp: 50,
    unlocked: true,
    unlockedAt: "2025-06-15",
  },
  {
    id: "streak-7",
    name: "Semana de Fogo",
    description: "Mantenha uma sequencia de 7 dias",
    icon: Flame,
    xp: 200,
    unlocked: true,
    unlockedAt: "2025-07-20",
  },
  {
    id: "gyms-5",
    name: "Explorador",
    description: "Visite 5 academias diferentes",
    icon: Target,
    xp: 150,
    unlocked: true,
    unlockedAt: "2025-08-10",
  },
  {
    id: "streak-30",
    name: "Dedicacao Total",
    description: "Mantenha uma sequencia de 30 dias",
    icon: Zap,
    xp: 500,
    unlocked: false,
    progress: 23,
    total: 30,
  },
  {
    id: "reviews-10",
    name: "Critico Fitness",
    description: "Escreva 10 avaliacoes",
    icon: Star,
    xp: 300,
    unlocked: false,
    progress: 6,
    total: 10,
  },
  {
    id: "gyms-20",
    name: "Nomade Fitness",
    description: "Visite 20 academias diferentes",
    icon: Target,
    xp: 400,
    unlocked: false,
    progress: 12,
    total: 20,
  },
  {
    id: "early-bird",
    name: "Madrugador",
    description: "Faca 10 check-ins antes das 7h",
    icon: Flame,
    xp: 250,
    unlocked: false,
    progress: 3,
    total: 10,
  },
  {
    id: "night-owl",
    name: "Coruja Noturna",
    description: "Faca 10 check-ins apos as 21h",
    icon: Zap,
    xp: 250,
    unlocked: false,
    progress: 1,
    total: 10,
  },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ConquistasPage() {
  const [achievements, setAchievements] = useState(allAchievements);

  useEffect(() => {
    async function loadAchievements() {
      try {
        const res = await rankingService.getAchievements();
        if (res.success && res.data && res.data.length > 0) {
          setAchievements(res.data as any);
        }
      } catch (error) {
        console.error("Erro ao carregar conquistas:", error);
      }
    }
    loadAchievements();
  }, []);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalXPFromAchievements = achievements
    .filter((a) => a.unlocked)
    .reduce((sum, a) => sum + a.xp, 0);

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
            <h1 className="text-xl font-bold">Conquistas</h1>
          </div>
        </div>

        {/* Stats */}
        <div className="p-4 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl p-5 border border-primary/20">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                <Trophy className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Conquistas Desbloqueadas</p>
                <p className="text-3xl font-bold text-foreground">
                  {unlockedCount}/{achievements.length}
                </p>
                <p className="text-sm text-primary">+{totalXPFromAchievements} XP ganhos</p>
              </div>
            </div>
            <div className="mt-4">
              <Progress
                value={(unlockedCount / achievements.length) * 100}
                className="h-2"
              />
            </div>
          </div>
        </div>

        {/* Unlocked Achievements */}
        <div className="px-4 mb-6 max-w-4xl mx-auto">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Desbloqueadas
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {achievements
              .filter((a) => a.unlocked)
              .map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <div
                    key={achievement.id}
                    className="bg-card rounded-xl p-4 border border-border"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                        <Icon className="h-7 w-7 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-foreground">
                            {achievement.name}
                          </h3>
                          <span className="text-primary font-medium">
                            +{achievement.xp} XP
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {achievement.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Desbloqueada em {formatDate(achievement.unlockedAt!)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Locked Achievements */}
        <div className="px-4 max-w-4xl mx-auto">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Lock className="h-5 w-5 text-muted-foreground" />
            Em Progresso
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {achievements
              .filter((a) => !a.unlocked)
              .map((achievement) => {
                const Icon = achievement.icon;
                const progressPercent = achievement.progress && achievement.total
                  ? (achievement.progress / achievement.total) * 100
                  : 0;
                return (
                  <div
                    key={achievement.id}
                    className="bg-card rounded-xl p-4 border border-border opacity-80"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <Icon className="h-7 w-7 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-foreground">
                            {achievement.name}
                          </h3>
                          <span className="text-muted-foreground text-sm">
                            +{achievement.xp} XP
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {achievement.description}
                        </p>
                        {achievement.progress !== undefined && (
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-muted-foreground">Progresso</span>
                              <span className="text-foreground">
                                {achievement.progress}/{achievement.total}
                              </span>
                            </div>
                            <Progress value={progressPercent} className="h-1.5" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
