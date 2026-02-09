"use client"

import { useState } from "react"
import { Gift, Star, Trophy, Crown, Users, TrendingUp, Plus, Search, Settings, Award } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const tiers = [
  { name: "Bronze", icon: Award, color: "text-orange-700", bg: "bg-orange-700/10", minPoints: 0, members: 45 },
  { name: "Prata", icon: Star, color: "text-zinc-300", bg: "bg-zinc-400/10", minPoints: 500, members: 28 },
  { name: "Ouro", icon: Trophy, color: "text-yellow-400", bg: "bg-yellow-400/10", minPoints: 1500, members: 12 },
  { name: "Diamante", icon: Crown, color: "text-cyan-400", bg: "bg-cyan-400/10", minPoints: 5000, members: 3 },
]

const mockRewards = [
  { id: "1", name: "Day Use Gratuito", points: 200, category: "Experiencia", redeemed: 45, available: true },
  { id: "2", name: "Camiseta FitApp", points: 350, category: "Produto", redeemed: 23, available: true },
  { id: "3", name: "1 Sessao Personal", points: 500, category: "Servico", redeemed: 18, available: true },
  { id: "4", name: "Desconto 20% no Plano", points: 800, category: "Desconto", redeemed: 12, available: true },
  { id: "5", name: "Squeeze Premium", points: 250, category: "Produto", redeemed: 34, available: true },
  { id: "6", name: "Semana Gratis", points: 1000, category: "Experiencia", redeemed: 8, available: true },
]

const mockTopMembers = [
  { id: "1", name: "Maria Silva", points: 5230, tier: "Diamante", avatar: "MS", streak: 45 },
  { id: "2", name: "Joao Santos", points: 3800, tier: "Ouro", avatar: "JS", streak: 30 },
  { id: "3", name: "Ana Costa", points: 2100, tier: "Ouro", avatar: "AC", streak: 22 },
  { id: "4", name: "Pedro Alves", points: 1200, tier: "Prata", avatar: "PA", streak: 15 },
  { id: "5", name: "Lucia Fernandes", points: 890, tier: "Prata", avatar: "LF", streak: 12 },
]

export default function RecompensasPage() {
  const [search, setSearch] = useState("")

  const totalMembers = tiers.reduce((a, b) => a + b.members, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Clube de Recompensas</h1>
          <p className="text-zinc-400 text-sm">Fidelize seus clientes com pontos e premios</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-zinc-800 text-zinc-400 hover:text-white"><Settings className="mr-2 h-4 w-4" /> Regras</Button>
          <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white"><Plus className="mr-2 h-4 w-4" /> Nova Recompensa</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-5">
            <p className="text-xs text-zinc-500 uppercase">Membros Ativos</p>
            <p className="text-2xl font-bold text-white mt-1">{totalMembers}</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-5">
            <p className="text-xs text-zinc-500 uppercase">Pontos Distribuidos</p>
            <p className="text-2xl font-bold text-orange-400 mt-1">48.5K</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-5">
            <p className="text-xs text-zinc-500 uppercase">Resgates no Mes</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">32</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-5">
            <p className="text-xs text-zinc-500 uppercase">Retencao</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1 flex items-center gap-1"><TrendingUp className="h-5 w-5" /> 94%</p>
          </CardContent>
        </Card>
      </div>

      {/* Tier Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {tiers.map((tier) => {
          const TierIcon = tier.icon
          return (
            <Card key={tier.name} className="bg-zinc-900/50 border-zinc-800/50 hover:border-zinc-700/50 transition-colors">
              <CardContent className="p-5 text-center">
                <div className={`h-14 w-14 rounded-2xl ${tier.bg} flex items-center justify-center mx-auto mb-3`}>
                  <TierIcon className={`h-7 w-7 ${tier.color}`} />
                </div>
                <h3 className={`font-bold text-lg ${tier.color}`}>{tier.name}</h3>
                <p className="text-xs text-zinc-500 mt-1">{tier.minPoints}+ pontos</p>
                <p className="text-sm font-semibold text-white mt-2">{tier.members} membros</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Tabs defaultValue="recompensas" className="w-full">
        <TabsList className="bg-zinc-900/50 border border-zinc-800/50 p-1">
          <TabsTrigger value="recompensas" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-zinc-400">Recompensas</TabsTrigger>
          <TabsTrigger value="ranking" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-zinc-400">Ranking</TabsTrigger>
        </TabsList>

        <TabsContent value="recompensas" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockRewards.map((reward) => (
              <Card key={reward.id} className="bg-zinc-900/50 border-zinc-800/50 hover:border-zinc-700/50 transition-all duration-200 group">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="h-11 w-11 rounded-xl bg-orange-500/10 flex items-center justify-center">
                      <Gift className="h-5 w-5 text-orange-500" />
                    </div>
                    <Badge variant="outline" className="border-zinc-700 text-zinc-400 text-xs">{reward.category}</Badge>
                  </div>
                  <h3 className="font-semibold text-white mb-1">{reward.name}</h3>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-bold text-orange-400">{reward.points} pts</span>
                    </div>
                    <span className="text-xs text-zinc-500">{reward.redeemed} resgates</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ranking" className="mt-4 space-y-3">
          {mockTopMembers.map((member, index) => (
            <Card key={member.id} className="bg-zinc-900/50 border-zinc-800/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <span className={`text-lg font-bold w-8 text-center ${index === 0 ? "text-yellow-400" : index === 1 ? "text-zinc-300" : index === 2 ? "text-orange-700" : "text-zinc-600"}`}>
                    #{index + 1}
                  </span>
                  <Avatar className="h-10 w-10 border-2 border-zinc-700">
                    <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white text-sm font-semibold">{member.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-sm">{member.name}</h3>
                    <p className="text-xs text-zinc-500">{member.tier} - {member.streak} dias seguidos</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-orange-400">{member.points.toLocaleString("pt-BR")}</p>
                    <p className="text-xs text-zinc-500">pontos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
