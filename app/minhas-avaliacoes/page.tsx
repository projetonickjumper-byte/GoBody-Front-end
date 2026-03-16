"use client"

import { useState, useEffect } from "react"
import { AppShell } from "@/components/app-shell"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/auth-context"
import { assessmentsService } from "@/lib/api/services/assessments.service"
import { 
  Activity, 
  TrendingUp, 
  TrendingDown,
  Minus,
  Scale, 
  Ruler, 
  Percent, 
  Droplets, 
  Bone, 
  Heart,
  Flame,
  Calendar,
  ChevronRight,
  ArrowLeft,
  Target,
  Zap,
  BarChart3,
  Clock,
  ClipboardList
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Dados mockados de avaliacoes
const avaliacoes = [
  {
    id: 1,
    data: "2024-01-15",
    profissional: "Dr. Carlos Mendes",
    local: "Smart Fit - Paulista",
    peso: 78.5,
    altura: 175,
    imc: 25.6,
    gorduraCorporal: 22.3,
    massaMagra: 61.0,
    massaGorda: 17.5,
    aguaCorporal: 55.2,
    massaOssea: 3.2,
    gorduraVisceral: 8,
    taxaMetabolica: 1720,
    idadeMetabolica: 32,
    circunferencias: {
      pescoco: 38,
      ombro: 112,
      torax: 98,
      cintura: 84,
      quadril: 96,
      bracoD: 32,
      bracoE: 31.5,
      antebracoD: 27,
      antebracoE: 26.5,
      coxaD: 56,
      coxaE: 55,
      panturrilhaD: 37,
      panturrilhaE: 36.5
    }
  },
  {
    id: 2,
    data: "2023-10-20",
    profissional: "Dra. Ana Paula",
    local: "Smart Fit - Paulista",
    peso: 82.0,
    altura: 175,
    imc: 26.8,
    gorduraCorporal: 25.1,
    massaMagra: 61.4,
    massaGorda: 20.6,
    aguaCorporal: 52.8,
    massaOssea: 3.1,
    gorduraVisceral: 10,
    taxaMetabolica: 1680,
    idadeMetabolica: 35,
    circunferencias: {
      pescoco: 39,
      ombro: 110,
      torax: 100,
      cintura: 88,
      quadril: 98,
      bracoD: 31,
      bracoE: 30.5,
      antebracoD: 26.5,
      antebracoE: 26,
      coxaD: 57,
      coxaE: 56,
      panturrilhaD: 37,
      panturrilhaE: 36.5
    }
  },
  {
    id: 3,
    data: "2023-07-10",
    profissional: "Dr. Carlos Mendes",
    local: "Smart Fit - Paulista",
    peso: 85.0,
    altura: 175,
    imc: 27.8,
    gorduraCorporal: 27.5,
    massaMagra: 61.6,
    massaGorda: 23.4,
    aguaCorporal: 50.5,
    massaOssea: 3.1,
    gorduraVisceral: 12,
    taxaMetabolica: 1650,
    idadeMetabolica: 38,
    circunferencias: {
      pescoco: 40,
      ombro: 108,
      torax: 102,
      cintura: 92,
      quadril: 100,
      bracoD: 30,
      bracoE: 29.5,
      antebracoD: 26,
      antebracoE: 25.5,
      coxaD: 58,
      coxaE: 57,
      panturrilhaD: 36.5,
      panturrilhaE: 36
    }
  }
]

function getVariacao(atual: number, anterior: number) {
  const diff = atual - anterior
  const percentual = ((diff / anterior) * 100).toFixed(1)
  return { diff: diff.toFixed(1), percentual, isPositive: diff > 0 }
}

function getIMCClassificacao(imc: number) {
  if (imc < 18.5) return { label: "Abaixo do peso", color: "text-blue-400", bg: "bg-blue-500/20" }
  if (imc < 25) return { label: "Peso normal", color: "text-green-400", bg: "bg-green-500/20" }
  if (imc < 30) return { label: "Sobrepeso", color: "text-yellow-400", bg: "bg-yellow-500/20" }
  if (imc < 35) return { label: "Obesidade I", color: "text-orange-400", bg: "bg-orange-500/20" }
  if (imc < 40) return { label: "Obesidade II", color: "text-red-400", bg: "bg-red-500/20" }
  return { label: "Obesidade III", color: "text-red-500", bg: "bg-red-500/20" }
}

function getGorduraClassificacao(gordura: number, sexo: string = "M") {
  if (sexo === "M") {
    if (gordura < 6) return { label: "Essencial", color: "text-blue-400" }
    if (gordura < 14) return { label: "Atleta", color: "text-green-400" }
    if (gordura < 18) return { label: "Fitness", color: "text-green-400" }
    if (gordura < 25) return { label: "Aceitavel", color: "text-yellow-400" }
    return { label: "Obesidade", color: "text-red-400" }
  }
  if (gordura < 14) return { label: "Essencial", color: "text-blue-400" }
  if (gordura < 21) return { label: "Atleta", color: "text-green-400" }
  if (gordura < 25) return { label: "Fitness", color: "text-green-400" }
  if (gordura < 32) return { label: "Aceitavel", color: "text-yellow-400" }
  return { label: "Obesidade", color: "text-red-400" }
}

export default function MinhasAvaliacoesPage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const [allAvaliacoes, setAllAvaliacoes] = useState(avaliacoes)
  const [selectedAvaliacao, setSelectedAvaliacao] = useState(avaliacoes[0])
  const [compareMode, setCompareMode] = useState(false)
  const [compareAvaliacao, setCompareAvaliacao] = useState(avaliacoes[1])

  useEffect(() => {
    async function loadAssessments() {
      if (!user?.id) return
      try {
        const res = await assessmentsService.getByStudent(user.id)
        if (res.success && res.data && res.data.length > 0) {
          const mapped = res.data.map((a: any, index: number) => ({
            id: a.id || index + 1,
            data: a.date || a.createdAt,
            profissional: a.trainerName || "Profissional",
            local: a.local || "Academia",
            peso: a.measurements?.weight || 0,
            altura: a.measurements?.height || 0,
            imc: a.measurements?.imc || 0,
            gorduraCorporal: a.measurements?.bodyFat || 0,
            massaMagra: a.measurements?.leanMass || 0,
            massaGorda: (a.measurements?.weight || 0) - (a.measurements?.leanMass || 0),
            aguaCorporal: 0,
            massaOssea: 0,
            gorduraVisceral: 0,
            taxaMetabolica: 0,
            idadeMetabolica: 0,
            circunferencias: {
              pescoco: a.measurements?.neck || 0,
              ombro: a.measurements?.shoulders || 0,
              torax: a.measurements?.chest || 0,
              cintura: a.measurements?.waist || 0,
              quadril: a.measurements?.hips || 0,
              bracoD: a.measurements?.rightArm || 0,
              bracoE: a.measurements?.leftArm || 0,
              antebracoD: a.measurements?.rightForearm || 0,
              antebracoE: a.measurements?.leftForearm || 0,
              coxaD: a.measurements?.rightThigh || 0,
              coxaE: a.measurements?.leftThigh || 0,
              panturrilhaD: a.measurements?.rightCalf || 0,
              panturrilhaE: a.measurements?.leftCalf || 0,
            }
          }))
          setAllAvaliacoes(mapped)
          setSelectedAvaliacao(mapped[0])
          if (mapped.length > 1) setCompareAvaliacao(mapped[1])
        }
      } catch (error) {
        console.error("Erro ao carregar avaliações:", error)
      }
    }
    if (isAuthenticated) loadAssessments()
  }, [isAuthenticated, user?.id])

  if (!isAuthenticated) {
    return (
      <AppShell>
        <div className="min-h-screen bg-background pb-20 lg:pb-8">
          <Header />
          <main className="mx-auto max-w-7xl px-4 py-6">
            <Card className="border-border bg-card">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
                <h2 className="text-lg font-semibold text-foreground mb-2">Faca login para ver suas avaliacoes</h2>
                <p className="text-sm text-muted-foreground mb-4 text-center">
                  Acompanhe sua evolucao fisica com avaliacoes de bioimpedancia
                </p>
                <Button asChild>
                  <Link href="/login">Entrar</Link>
                </Button>
              </CardContent>
            </Card>
          </main>
        </div>
      </AppShell>
    )
  }

  const ultimaAvaliacao = allAvaliacoes[0]
  const avaliacaoAnterior = allAvaliacoes[1]
  const imcClass = getIMCClassificacao(ultimaAvaliacao.imc)
  const gorduraClass = getGorduraClassificacao(ultimaAvaliacao.gorduraCorporal)

  return (
    <AppShell>
      <div className="min-h-screen bg-background pb-20 lg:pb-8">
        <Header />

        <main className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-6">
          {/* Header da pagina */}
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center gap-2 mb-1">
              <button type="button" onClick={() => router.back()} className="p-1 -ml-1 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <h1 className="text-lg sm:text-2xl font-bold text-foreground">Minhas Avaliacoes</h1>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground ml-6 sm:ml-7">
              Acompanhe sua evolucao fisica
            </p>
          </div>

          {/* Resumo rapido */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
            <Card className="border-border bg-gradient-to-br from-blue-500/10 to-background">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Scale className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-400" />
                  <span className="text-[10px] sm:text-xs text-muted-foreground">Peso</span>
                </div>
                <p className="text-lg sm:text-2xl font-bold text-foreground">{ultimaAvaliacao.peso}<span className="text-xs sm:text-sm font-normal text-muted-foreground ml-0.5">kg</span></p>
                {avaliacaoAnterior && (
                  <div className="flex items-center gap-1 mt-1">
                    {getVariacao(ultimaAvaliacao.peso, avaliacaoAnterior.peso).isPositive ? (
                      <TrendingUp className="h-3 w-3 text-red-400" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-green-400" />
                    )}
                    <span className={cn(
                      "text-[10px] sm:text-xs",
                      getVariacao(ultimaAvaliacao.peso, avaliacaoAnterior.peso).isPositive ? "text-red-400" : "text-green-400"
                    )}>
                      {getVariacao(ultimaAvaliacao.peso, avaliacaoAnterior.peso).diff}kg
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-border bg-gradient-to-br from-green-500/10 to-background">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Percent className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-400" />
                  <span className="text-[10px] sm:text-xs text-muted-foreground">Gordura</span>
                </div>
                <p className="text-lg sm:text-2xl font-bold text-foreground">{ultimaAvaliacao.gorduraCorporal}<span className="text-xs sm:text-sm font-normal text-muted-foreground ml-0.5">%</span></p>
                {avaliacaoAnterior && (
                  <div className="flex items-center gap-1 mt-1">
                    {getVariacao(ultimaAvaliacao.gorduraCorporal, avaliacaoAnterior.gorduraCorporal).isPositive ? (
                      <TrendingUp className="h-3 w-3 text-red-400" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-green-400" />
                    )}
                    <span className={cn(
                      "text-[10px] sm:text-xs",
                      getVariacao(ultimaAvaliacao.gorduraCorporal, avaliacaoAnterior.gorduraCorporal).isPositive ? "text-red-400" : "text-green-400"
                    )}>
                      {getVariacao(ultimaAvaliacao.gorduraCorporal, avaliacaoAnterior.gorduraCorporal).diff}%
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-border bg-gradient-to-br from-purple-500/10 to-background">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-400" />
                  <span className="text-[10px] sm:text-xs text-muted-foreground">M. Magra</span>
                </div>
                <p className="text-lg sm:text-2xl font-bold text-foreground">{ultimaAvaliacao.massaMagra}<span className="text-xs sm:text-sm font-normal text-muted-foreground ml-0.5">kg</span></p>
                {avaliacaoAnterior && (
                  <div className="flex items-center gap-1 mt-1">
                    {getVariacao(ultimaAvaliacao.massaMagra, avaliacaoAnterior.massaMagra).isPositive ? (
                      <TrendingUp className="h-3 w-3 text-green-400" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-400" />
                    )}
                    <span className={cn(
                      "text-[10px] sm:text-xs",
                      getVariacao(ultimaAvaliacao.massaMagra, avaliacaoAnterior.massaMagra).isPositive ? "text-green-400" : "text-red-400"
                    )}>
                      {getVariacao(ultimaAvaliacao.massaMagra, avaliacaoAnterior.massaMagra).diff}kg
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-border bg-gradient-to-br from-orange-500/10 to-background">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Flame className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-orange-400" />
                  <span className="text-[10px] sm:text-xs text-muted-foreground">TMB</span>
                </div>
                <p className="text-lg sm:text-2xl font-bold text-foreground">{ultimaAvaliacao.taxaMetabolica}<span className="text-xs sm:text-sm font-normal text-muted-foreground ml-0.5">kcal</span></p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Idade met: {ultimaAvaliacao.idadeMetabolica} anos</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="detalhes" className="space-y-4">
            <TabsList className="w-full grid grid-cols-3 h-9 sm:h-10">
              <TabsTrigger value="detalhes" className="text-xs sm:text-sm">Detalhes</TabsTrigger>
              <TabsTrigger value="medidas" className="text-xs sm:text-sm">Medidas</TabsTrigger>
              <TabsTrigger value="historico" className="text-xs sm:text-sm">Historico</TabsTrigger>
            </TabsList>

            {/* Tab Detalhes */}
            <TabsContent value="detalhes" className="space-y-4">
              {/* IMC */}
              <Card className="border-border bg-card">
                <CardHeader className="pb-2 px-4 pt-4">
                  <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    Indice de Massa Corporal (IMC)
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-2xl sm:text-3xl font-bold text-foreground">{ultimaAvaliacao.imc}</span>
                      <Badge className={cn("ml-2 text-[10px]", imcClass.bg, imcClass.color)}>
                        {imcClass.label}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] sm:text-xs text-muted-foreground">
                      <span>Abaixo</span>
                      <span>Normal</span>
                      <span>Sobrepeso</span>
                      <span>Obeso</span>
                    </div>
                    <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 to-red-500 relative">
                      <div 
                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full border-2 border-foreground shadow-lg"
                        style={{ left: `${Math.min(Math.max((ultimaAvaliacao.imc - 15) / 25 * 100, 0), 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                      <span>15</span>
                      <span>18.5</span>
                      <span>25</span>
                      <span>30</span>
                      <span>40</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Composicao Corporal */}
              <Card className="border-border bg-card">
                <CardHeader className="pb-2 px-4 pt-4">
                  <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    Composicao Corporal
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 space-y-4">
                  {/* Gordura Corporal */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-500" />
                        <span className="text-xs sm:text-sm text-foreground">Gordura Corporal</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm sm:text-base font-semibold">{ultimaAvaliacao.gorduraCorporal}%</span>
                        <span className={cn("text-[10px]", gorduraClass.color)}>({gorduraClass.label})</span>
                      </div>
                    </div>
                    <Progress value={ultimaAvaliacao.gorduraCorporal} className="h-1.5" />
                    <p className="text-[10px] text-muted-foreground mt-1">{ultimaAvaliacao.massaGorda} kg de gordura</p>
                  </div>

                  {/* Massa Magra */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                        <span className="text-xs sm:text-sm text-foreground">Massa Magra</span>
                      </div>
                      <span className="text-sm sm:text-base font-semibold">{ultimaAvaliacao.massaMagra} kg</span>
                    </div>
                    <Progress value={(ultimaAvaliacao.massaMagra / ultimaAvaliacao.peso) * 100} className="h-1.5" />
                    <p className="text-[10px] text-muted-foreground mt-1">{((ultimaAvaliacao.massaMagra / ultimaAvaliacao.peso) * 100).toFixed(1)}% do peso total</p>
                  </div>

                  {/* Agua Corporal */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-xs sm:text-sm text-foreground">Agua Corporal</span>
                      </div>
                      <span className="text-sm sm:text-base font-semibold">{ultimaAvaliacao.aguaCorporal}%</span>
                    </div>
                    <Progress value={ultimaAvaliacao.aguaCorporal} className="h-1.5" />
                    <p className="text-[10px] text-muted-foreground mt-1">Ideal: 50-65% para homens</p>
                  </div>

                  {/* Massa Ossea */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gray-400" />
                        <span className="text-xs sm:text-sm text-foreground">Massa Ossea</span>
                      </div>
                      <span className="text-sm sm:text-base font-semibold">{ultimaAvaliacao.massaOssea} kg</span>
                    </div>
                    <Progress value={(ultimaAvaliacao.massaOssea / 5) * 100} className="h-1.5" />
                    <p className="text-[10px] text-muted-foreground mt-1">Ideal: 2.5-4.0 kg</p>
                  </div>
                </CardContent>
              </Card>

              {/* Gordura Visceral */}
              <Card className="border-border bg-card">
                <CardHeader className="pb-2 px-4 pt-4">
                  <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-400" />
                    Gordura Visceral
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-2xl sm:text-3xl font-bold text-foreground">{ultimaAvaliacao.gorduraVisceral}</span>
                      <Badge className={cn(
                        "ml-2 text-[10px]",
                        ultimaAvaliacao.gorduraVisceral <= 9 ? "bg-green-500/20 text-green-400" :
                        ultimaAvaliacao.gorduraVisceral <= 14 ? "bg-yellow-500/20 text-yellow-400" :
                        "bg-red-500/20 text-red-400"
                      )}>
                        {ultimaAvaliacao.gorduraVisceral <= 9 ? "Normal" : ultimaAvaliacao.gorduraVisceral <= 14 ? "Alto" : "Muito Alto"}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className={cn(
                      "rounded-lg p-2",
                      ultimaAvaliacao.gorduraVisceral <= 9 ? "bg-green-500/20" : "bg-secondary"
                    )}>
                      <p className="text-[10px] text-muted-foreground">Normal</p>
                      <p className="text-xs font-medium">1-9</p>
                    </div>
                    <div className={cn(
                      "rounded-lg p-2",
                      ultimaAvaliacao.gorduraVisceral > 9 && ultimaAvaliacao.gorduraVisceral <= 14 ? "bg-yellow-500/20" : "bg-secondary"
                    )}>
                      <p className="text-[10px] text-muted-foreground">Alto</p>
                      <p className="text-xs font-medium">10-14</p>
                    </div>
                    <div className={cn(
                      "rounded-lg p-2",
                      ultimaAvaliacao.gorduraVisceral > 14 ? "bg-red-500/20" : "bg-secondary"
                    )}>
                      <p className="text-[10px] text-muted-foreground">Muito Alto</p>
                      <p className="text-xs font-medium">15+</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-3">
                    A gordura visceral e a gordura armazenada ao redor dos orgaos internos. Niveis elevados aumentam o risco de doencas cardiovasculares.
                  </p>
                </CardContent>
              </Card>

              {/* Info da avaliacao */}
              <Card className="border-border bg-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm font-medium text-foreground">Ultima avaliacao</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">
                        {new Date(ultimaAvaliacao.data).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] sm:text-xs text-muted-foreground">{ultimaAvaliacao.profissional}</p>
                      <p className="text-[10px] text-muted-foreground">{ultimaAvaliacao.local}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab Medidas */}
            <TabsContent value="medidas" className="space-y-4">
              <Card className="border-border bg-card">
                <CardHeader className="pb-2 px-4 pt-4">
                  <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                    <Ruler className="h-4 w-4 text-primary" />
                    Circunferencias Corporais
                  </CardTitle>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Medidas em centimetros (cm)</p>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="space-y-3">
                    {/* Parte superior */}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Parte Superior</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
                          <span className="text-xs text-foreground">Pescoco</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-semibold">{ultimaAvaliacao.circunferencias.pescoco}</span>
                            {avaliacaoAnterior && (
                              <span className={cn(
                                "text-[10px]",
                                ultimaAvaliacao.circunferencias.pescoco < avaliacaoAnterior.circunferencias.pescoco ? "text-green-400" : "text-red-400"
                              )}>
                                {ultimaAvaliacao.circunferencias.pescoco < avaliacaoAnterior.circunferencias.pescoco ? "-" : "+"}
                                {Math.abs(ultimaAvaliacao.circunferencias.pescoco - avaliacaoAnterior.circunferencias.pescoco)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
                          <span className="text-xs text-foreground">Ombro</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-semibold">{ultimaAvaliacao.circunferencias.ombro}</span>
                            {avaliacaoAnterior && (
                              <span className={cn(
                                "text-[10px]",
                                ultimaAvaliacao.circunferencias.ombro > avaliacaoAnterior.circunferencias.ombro ? "text-green-400" : "text-red-400"
                              )}>
                                {ultimaAvaliacao.circunferencias.ombro > avaliacaoAnterior.circunferencias.ombro ? "+" : ""}
                                {ultimaAvaliacao.circunferencias.ombro - avaliacaoAnterior.circunferencias.ombro}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
                          <span className="text-xs text-foreground">Torax</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-semibold">{ultimaAvaliacao.circunferencias.torax}</span>
                            {avaliacaoAnterior && (
                              <span className={cn(
                                "text-[10px]",
                                ultimaAvaliacao.circunferencias.torax < avaliacaoAnterior.circunferencias.torax ? "text-green-400" : "text-yellow-400"
                              )}>
                                {ultimaAvaliacao.circunferencias.torax < avaliacaoAnterior.circunferencias.torax ? "" : "+"}
                                {ultimaAvaliacao.circunferencias.torax - avaliacaoAnterior.circunferencias.torax}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
                          <span className="text-xs text-foreground">Cintura</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-semibold">{ultimaAvaliacao.circunferencias.cintura}</span>
                            {avaliacaoAnterior && (
                              <span className={cn(
                                "text-[10px]",
                                ultimaAvaliacao.circunferencias.cintura < avaliacaoAnterior.circunferencias.cintura ? "text-green-400" : "text-red-400"
                              )}>
                                {ultimaAvaliacao.circunferencias.cintura < avaliacaoAnterior.circunferencias.cintura ? "" : "+"}
                                {ultimaAvaliacao.circunferencias.cintura - avaliacaoAnterior.circunferencias.cintura}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
                          <span className="text-xs text-foreground">Quadril</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-semibold">{ultimaAvaliacao.circunferencias.quadril}</span>
                            {avaliacaoAnterior && (
                              <span className={cn(
                                "text-[10px]",
                                ultimaAvaliacao.circunferencias.quadril < avaliacaoAnterior.circunferencias.quadril ? "text-green-400" : "text-red-400"
                              )}>
                                {ultimaAvaliacao.circunferencias.quadril < avaliacaoAnterior.circunferencias.quadril ? "" : "+"}
                                {ultimaAvaliacao.circunferencias.quadril - avaliacaoAnterior.circunferencias.quadril}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bracos */}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Bracos</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
                          <span className="text-xs text-foreground">Braco D</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-semibold">{ultimaAvaliacao.circunferencias.bracoD}</span>
                            {avaliacaoAnterior && (
                              <span className={cn(
                                "text-[10px]",
                                ultimaAvaliacao.circunferencias.bracoD > avaliacaoAnterior.circunferencias.bracoD ? "text-green-400" : "text-red-400"
                              )}>
                                {ultimaAvaliacao.circunferencias.bracoD > avaliacaoAnterior.circunferencias.bracoD ? "+" : ""}
                                {ultimaAvaliacao.circunferencias.bracoD - avaliacaoAnterior.circunferencias.bracoD}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
                          <span className="text-xs text-foreground">Braco E</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-semibold">{ultimaAvaliacao.circunferencias.bracoE}</span>
                            {avaliacaoAnterior && (
                              <span className={cn(
                                "text-[10px]",
                                ultimaAvaliacao.circunferencias.bracoE > avaliacaoAnterior.circunferencias.bracoE ? "text-green-400" : "text-red-400"
                              )}>
                                {ultimaAvaliacao.circunferencias.bracoE > avaliacaoAnterior.circunferencias.bracoE ? "+" : ""}
                                {ultimaAvaliacao.circunferencias.bracoE - avaliacaoAnterior.circunferencias.bracoE}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
                          <span className="text-xs text-foreground">Antebraco D</span>
                          <span className="text-sm font-semibold">{ultimaAvaliacao.circunferencias.antebracoD}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
                          <span className="text-xs text-foreground">Antebraco E</span>
                          <span className="text-sm font-semibold">{ultimaAvaliacao.circunferencias.antebracoE}</span>
                        </div>
                      </div>
                    </div>

                    {/* Pernas */}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Pernas</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
                          <span className="text-xs text-foreground">Coxa D</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-semibold">{ultimaAvaliacao.circunferencias.coxaD}</span>
                            {avaliacaoAnterior && (
                              <span className={cn(
                                "text-[10px]",
                                ultimaAvaliacao.circunferencias.coxaD < avaliacaoAnterior.circunferencias.coxaD ? "text-green-400" : "text-yellow-400"
                              )}>
                                {ultimaAvaliacao.circunferencias.coxaD < avaliacaoAnterior.circunferencias.coxaD ? "" : "+"}
                                {ultimaAvaliacao.circunferencias.coxaD - avaliacaoAnterior.circunferencias.coxaD}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
                          <span className="text-xs text-foreground">Coxa E</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-semibold">{ultimaAvaliacao.circunferencias.coxaE}</span>
                            {avaliacaoAnterior && (
                              <span className={cn(
                                "text-[10px]",
                                ultimaAvaliacao.circunferencias.coxaE < avaliacaoAnterior.circunferencias.coxaE ? "text-green-400" : "text-yellow-400"
                              )}>
                                {ultimaAvaliacao.circunferencias.coxaE < avaliacaoAnterior.circunferencias.coxaE ? "" : "+"}
                                {ultimaAvaliacao.circunferencias.coxaE - avaliacaoAnterior.circunferencias.coxaE}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
                          <span className="text-xs text-foreground">Panturrilha D</span>
                          <span className="text-sm font-semibold">{ultimaAvaliacao.circunferencias.panturrilhaD}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
                          <span className="text-xs text-foreground">Panturrilha E</span>
                          <span className="text-sm font-semibold">{ultimaAvaliacao.circunferencias.panturrilhaE}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Relacao Cintura-Quadril */}
              <Card className="border-border bg-card">
                <CardHeader className="pb-2 px-4 pt-4">
                  <CardTitle className="text-sm sm:text-base">Relacao Cintura-Quadril (RCQ)</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-foreground">
                        {(ultimaAvaliacao.circunferencias.cintura / ultimaAvaliacao.circunferencias.quadril).toFixed(2)}
                      </span>
                      <Badge className={cn(
                        "ml-2 text-[10px]",
                        (ultimaAvaliacao.circunferencias.cintura / ultimaAvaliacao.circunferencias.quadril) < 0.90 
                          ? "bg-green-500/20 text-green-400" 
                          : "bg-yellow-500/20 text-yellow-400"
                      )}>
                        {(ultimaAvaliacao.circunferencias.cintura / ultimaAvaliacao.circunferencias.quadril) < 0.90 ? "Baixo Risco" : "Risco Moderado"}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2">
                    Valores ideais: Homens &lt; 0.90 | Mulheres &lt; 0.85
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab Historico */}
            <TabsContent value="historico" className="space-y-3">
              {allAvaliacoes.map((avaliacao, index) => (
                <Card 
                  key={avaliacao.id} 
                  className={cn(
                    "border-border bg-card cursor-pointer transition-all",
                    index === 0 && "border-primary/50"
                  )}
                  onClick={() => setSelectedAvaliacao(avaliacao)}
                >
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          index === 0 ? "bg-primary/20" : "bg-secondary"
                        )}>
                          <Calendar className={cn("h-5 w-5", index === 0 ? "text-primary" : "text-muted-foreground")} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {new Date(avaliacao.data).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                          </p>
                          <p className="text-[10px] text-muted-foreground">{avaliacao.profissional}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-semibold text-foreground">{avaliacao.peso} kg</p>
                          <p className="text-[10px] text-muted-foreground">{avaliacao.gorduraCorporal}% gordura</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>

                    {/* Mini comparacao */}
                    {index < allAvaliacoes.length - 1 && (
                      <div className="mt-3 pt-3 border-t border-border grid grid-cols-3 gap-2">
                        <div className="text-center">
                          <p className="text-[10px] text-muted-foreground">Peso</p>
                          <p className={cn(
                            "text-xs font-medium",
                            avaliacao.peso < allAvaliacoes[index + 1].peso ? "text-green-400" : "text-red-400"
                          )}>
                            {avaliacao.peso < allAvaliacoes[index + 1].peso ? "-" : "+"}
                            {Math.abs(avaliacao.peso - allAvaliacoes[index + 1].peso).toFixed(1)} kg
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] text-muted-foreground">Gordura</p>
                          <p className={cn(
                            "text-xs font-medium",
                            avaliacao.gorduraCorporal < allAvaliacoes[index + 1].gorduraCorporal ? "text-green-400" : "text-red-400"
                          )}>
                            {avaliacao.gorduraCorporal < allAvaliacoes[index + 1].gorduraCorporal ? "-" : "+"}
                            {Math.abs(avaliacao.gorduraCorporal - allAvaliacoes[index + 1].gorduraCorporal).toFixed(1)}%
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] text-muted-foreground">M. Magra</p>
                          <p className={cn(
                            "text-xs font-medium",
                            avaliacao.massaMagra > allAvaliacoes[index + 1].massaMagra ? "text-green-400" : "text-red-400"
                          )}>
                            {avaliacao.massaMagra > allAvaliacoes[index + 1].massaMagra ? "+" : ""}
                            {(avaliacao.massaMagra - allAvaliacoes[index + 1].massaMagra).toFixed(1)} kg
                          </p>
                        </div>
                      </div>
                    )}

                    {index === 0 && (
                      <Badge className="mt-3 bg-primary/20 text-primary text-[10px]">Avaliacao mais recente</Badge>
                    )}
                  </CardContent>
                </Card>
              ))}

              {/* Evolucao geral */}
              <Card className="border-border bg-gradient-to-br from-primary/10 to-background">
                <CardHeader className="pb-2 px-4 pt-4">
                  <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    Evolucao Geral
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 rounded-lg bg-green-500/10">
                      <TrendingDown className="h-5 w-5 text-green-400 mx-auto mb-1" />
                      <p className="text-lg font-bold text-green-400">
                        -{(allAvaliacoes[allAvaliacoes.length - 1].peso - allAvaliacoes[0].peso).toFixed(1)} kg
                      </p>
                      <p className="text-[10px] text-muted-foreground">Peso perdido</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-green-500/10">
                      <TrendingDown className="h-5 w-5 text-green-400 mx-auto mb-1" />
                      <p className="text-lg font-bold text-green-400">
                        -{(allAvaliacoes[allAvaliacoes.length - 1].gorduraCorporal - allAvaliacoes[0].gorduraCorporal).toFixed(1)}%
                      </p>
                      <p className="text-[10px] text-muted-foreground">Gordura reduzida</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-purple-500/10">
                      <Activity className="h-5 w-5 text-purple-400 mx-auto mb-1" />
                      <p className="text-lg font-bold text-purple-400">
                        {(allAvaliacoes[0].massaMagra - allAvaliacoes[allAvaliacoes.length - 1].massaMagra) > 0 ? "-" : "+"}
                        {Math.abs(allAvaliacoes[0].massaMagra - allAvaliacoes[allAvaliacoes.length - 1].massaMagra).toFixed(1)} kg
                      </p>
                      <p className="text-[10px] text-muted-foreground">Massa magra</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-blue-500/10">
                      <Clock className="h-5 w-5 text-blue-400 mx-auto mb-1" />
                      <p className="text-lg font-bold text-blue-400">{allAvaliacoes.length}</p>
                      <p className="text-[10px] text-muted-foreground">Avaliacoes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </AppShell>
  )
}
