"use client"

import { useState } from "react"
import { Bot, Zap, Play, Pause, Plus, Settings, Mail, MessageSquare, Bell, Clock, Users, ArrowRight, ToggleLeft, ToggleRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const mockAutomations = [
  {
    id: "1",
    name: "Boas-vindas novo lead",
    description: "Envia email automatico quando um novo lead e cadastrado no sistema",
    trigger: "Novo lead cadastrado",
    action: "Enviar email de boas-vindas",
    actionIcon: Mail,
    active: true,
    runs: 234,
    lastRun: "2026-02-09 14:30",
  },
  {
    id: "2",
    name: "Lembrete de vencimento",
    description: "Notifica o cliente 3 dias antes do vencimento do plano",
    trigger: "3 dias antes do vencimento",
    action: "Enviar WhatsApp + Email",
    actionIcon: MessageSquare,
    active: true,
    runs: 156,
    lastRun: "2026-02-09 08:00",
  },
  {
    id: "3",
    name: "Follow-up inatividade",
    description: "Envia mensagem para clientes que nao frequentam ha 7 dias",
    trigger: "7 dias sem check-in",
    action: "Enviar notificacao push",
    actionIcon: Bell,
    active: true,
    runs: 89,
    lastRun: "2026-02-08 18:00",
  },
  {
    id: "4",
    name: "Aniversariante do mes",
    description: "Envia mensagem personalizada no aniversario do cliente",
    trigger: "Data de aniversario",
    action: "Enviar email + cupom desconto",
    actionIcon: Mail,
    active: false,
    runs: 45,
    lastRun: "2026-02-05 09:00",
  },
  {
    id: "5",
    name: "Lead sem resposta",
    description: "Lembrete para equipe quando lead nao recebe contato em 48h",
    trigger: "48h sem atividade no lead",
    action: "Alerta interno para equipe",
    actionIcon: Bell,
    active: true,
    runs: 67,
    lastRun: "2026-02-09 10:00",
  },
  {
    id: "6",
    name: "Recompensa por indicacao",
    description: "Credita bonus automaticamente quando indicacao se converte",
    trigger: "Indicacao convertida",
    action: "Creditar pontos + notificar",
    actionIcon: Users,
    active: false,
    runs: 23,
    lastRun: "2026-02-01 15:00",
  },
]

export default function AutomacoesPage() {
  const [automations, setAutomations] = useState(mockAutomations)

  const activeCount = automations.filter(a => a.active).length
  const totalRuns = automations.reduce((a, b) => a + b.runs, 0)

  const toggleAutomation = (id: string) => {
    setAutomations(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Automacoes</h1>
          <p className="text-zinc-400 text-sm">Configure fluxos automaticos para seu negocio</p>
        </div>
        <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white"><Plus className="mr-2 h-4 w-4" /> Nova Automacao</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center"><Zap className="h-6 w-6 text-emerald-500" /></div>
            <div><p className="text-xs text-zinc-500 uppercase">Ativas</p><p className="text-2xl font-bold text-emerald-400">{activeCount}</p></div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center"><Bot className="h-6 w-6 text-orange-500" /></div>
            <div><p className="text-xs text-zinc-500 uppercase">Total</p><p className="text-2xl font-bold text-white">{automations.length}</p></div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center"><Play className="h-6 w-6 text-blue-500" /></div>
            <div><p className="text-xs text-zinc-500 uppercase">Execucoes</p><p className="text-2xl font-bold text-blue-400">{totalRuns}</p></div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        {automations.map((auto) => {
          const ActionIcon = auto.actionIcon
          return (
            <Card key={auto.id} className={`border-zinc-800/50 transition-all duration-200 ${auto.active ? "bg-zinc-900/50 hover:border-zinc-700/50" : "bg-zinc-900/30 opacity-70"}`}>
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 ${auto.active ? "bg-emerald-500/10" : "bg-zinc-800"}`}>
                    <Bot className={`h-5 w-5 ${auto.active ? "text-emerald-500" : "text-zinc-600"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white">{auto.name}</h3>
                      <Badge variant="outline" className={`text-xs ${auto.active ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-zinc-500 border-zinc-700"}`}>
                        {auto.active ? "Ativa" : "Inativa"}
                      </Badge>
                    </div>
                    <p className="text-sm text-zinc-500 mb-3">{auto.description}</p>
                    <div className="flex items-center gap-2 text-xs text-zinc-600">
                      <Badge variant="outline" className="border-zinc-700 text-zinc-500 text-xs flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {auto.trigger}
                      </Badge>
                      <ArrowRight className="h-3 w-3 text-zinc-700" />
                      <Badge variant="outline" className="border-zinc-700 text-zinc-500 text-xs flex items-center gap-1">
                        <ActionIcon className="h-3 w-3" /> {auto.action}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-zinc-600">
                      <span>{auto.runs} execucoes</span>
                      <span>Ultima: {auto.lastRun}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white"><Settings className="h-4 w-4" /></Button>
                    <button onClick={() => toggleAutomation(auto.id)} className="flex-shrink-0">
                      {auto.active ? (
                        <ToggleRight className="h-8 w-8 text-emerald-500" />
                      ) : (
                        <ToggleLeft className="h-8 w-8 text-zinc-600" />
                      )}
                    </button>
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
