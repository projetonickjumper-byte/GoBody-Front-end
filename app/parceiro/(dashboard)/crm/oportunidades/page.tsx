"use client"

import { useState } from "react"
import { Lightbulb, DollarSign, TrendingUp, Clock, Search, Plus, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const stages = [
  { key: "prospeccao", label: "Prospeccao", color: "bg-blue-500" },
  { key: "qualificacao", label: "Qualificacao", color: "bg-yellow-500" },
  { key: "proposta", label: "Proposta", color: "bg-orange-500" },
  { key: "negociacao", label: "Negociacao", color: "bg-violet-500" },
  { key: "fechamento", label: "Fechamento", color: "bg-emerald-500" },
]

const mockOpportunities = [
  { id: "1", title: "Plano Corporativo - TechCorp", contact: "Ana Gerente", value: 15000, stage: "negociacao", probability: 80, daysOpen: 12, nextAction: "Enviar proposta final" },
  { id: "2", title: "Evento Corrida 5K", contact: "Pedro Esportes", value: 8500, stage: "proposta", probability: 60, daysOpen: 8, nextAction: "Agendar reuniao" },
  { id: "3", title: "Parceria Escola Fitness", contact: "Maria Diretora", value: 5000, stage: "qualificacao", probability: 40, daysOpen: 3, nextAction: "Levantar necessidades" },
  { id: "4", title: "Plano Familia Premium", contact: "Roberto Silva", value: 3600, stage: "fechamento", probability: 95, daysOpen: 20, nextAction: "Assinar contrato" },
  { id: "5", title: "Aulas coletivas empresa", contact: "Julia RH", value: 12000, stage: "prospeccao", probability: 20, daysOpen: 1, nextAction: "Primeiro contato" },
]

export default function OportunidadesPage() {
  const [search, setSearch] = useState("")

  const totalValue = mockOpportunities.reduce((a, b) => a + b.value, 0)
  const weightedValue = mockOpportunities.reduce((a, b) => a + (b.value * b.probability / 100), 0)

  const filtered = mockOpportunities.filter(o => o.title.toLowerCase().includes(search.toLowerCase()) || o.contact.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Oportunidades</h1>
          <p className="text-zinc-400 text-sm">Pipeline de vendas e negociacoes</p>
        </div>
        <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white"><Plus className="mr-2 h-4 w-4" /> Nova Oportunidade</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-5">
            <p className="text-xs text-zinc-500 uppercase tracking-wider">Pipeline Total</p>
            <p className="text-2xl font-bold text-white mt-1">R$ {totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-5">
            <p className="text-xs text-zinc-500 uppercase tracking-wider">Valor Ponderado</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">R$ {weightedValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-5">
            <p className="text-xs text-zinc-500 uppercase tracking-wider">Oportunidades Ativas</p>
            <p className="text-2xl font-bold text-orange-400 mt-1">{mockOpportunities.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline visual */}
      <div className="flex gap-1 rounded-xl overflow-hidden">
        {stages.map((stage) => {
          const count = mockOpportunities.filter(o => o.stage === stage.key).length
          const width = Math.max((count / mockOpportunities.length) * 100, 10)
          return (
            <div key={stage.key} className={`${stage.color} py-2 px-3 text-center`} style={{ width: `${width}%` }}>
              <p className="text-xs font-bold text-white">{count}</p>
              <p className="text-[10px] text-white/70 truncate">{stage.label}</p>
            </div>
          )
        })}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <Input placeholder="Buscar oportunidade..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-zinc-900/50 border-zinc-800 text-white" />
      </div>

      <div className="space-y-3">
        {filtered.map((opp) => {
          const stage = stages.find(s => s.key === opp.stage)!
          return (
            <Card key={opp.id} className="bg-zinc-900/50 border-zinc-800/50 hover:border-zinc-700/50 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-white">{opp.title}</h3>
                      <Badge variant="outline" className="text-xs border-zinc-700 text-zinc-400">{stage.label}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-zinc-500 mb-3">
                      <span>{opp.contact}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {opp.daysOpen} dias</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={opp.probability} className="h-2 flex-1 bg-zinc-800 [&>div]:bg-gradient-to-r [&>div]:from-orange-500 [&>div]:to-orange-600" />
                      <span className="text-xs font-medium text-orange-400">{opp.probability}%</span>
                    </div>
                    <p className="text-xs text-zinc-600 mt-2 flex items-center gap-1"><ArrowRight className="h-3 w-3" /> {opp.nextAction}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-emerald-400">R$ {opp.value.toLocaleString("pt-BR")}</p>
                    <p className="text-xs text-zinc-600">ponderado: R$ {(opp.value * opp.probability / 100).toLocaleString("pt-BR")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
