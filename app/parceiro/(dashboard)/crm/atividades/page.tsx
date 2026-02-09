"use client"

import { useState } from "react"
import { Activity, CheckCircle2, Circle, Clock, Phone, Mail, Calendar, MapPin, Plus, Search, Filter } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type ActivityType = "ligacao" | "email" | "reuniao" | "visita" | "tarefa"

const typeConfig: Record<ActivityType, { label: string; icon: React.ElementType; color: string }> = {
  ligacao: { label: "Ligacao", icon: Phone, color: "text-blue-400 bg-blue-500/10" },
  email: { label: "Email", icon: Mail, color: "text-violet-400 bg-violet-500/10" },
  reuniao: { label: "Reuniao", icon: Calendar, color: "text-orange-400 bg-orange-500/10" },
  visita: { label: "Visita", icon: MapPin, color: "text-emerald-400 bg-emerald-500/10" },
  tarefa: { label: "Tarefa", icon: Activity, color: "text-yellow-400 bg-yellow-500/10" },
}

const mockActivities = [
  { id: "1", title: "Ligar para Fernando Matos", type: "ligacao" as ActivityType, contact: "Fernando Matos", date: "2026-02-09", time: "10:00", done: false, notes: "Retornar sobre plano mensal" },
  { id: "2", title: "Enviar proposta TechCorp", type: "email" as ActivityType, contact: "Ana Gerente", date: "2026-02-09", time: "14:00", done: false, notes: "Plano corporativo 50 funcionarios" },
  { id: "3", title: "Reuniao parceria escola", type: "reuniao" as ActivityType, contact: "Maria Diretora", date: "2026-02-10", time: "09:30", done: false, notes: "Discutir termos" },
  { id: "4", title: "Visita Patricia Oliveira", type: "visita" as ActivityType, contact: "Patricia Oliveira", date: "2026-02-10", time: "15:00", done: false, notes: "Tour pela academia" },
  { id: "5", title: "Follow-up Camila Rodrigues", type: "ligacao" as ActivityType, contact: "Camila Rodrigues", date: "2026-02-08", time: "11:00", done: true, notes: "Interesse em pilates confirmado" },
  { id: "6", title: "Enviar orcamento evento", type: "email" as ActivityType, contact: "Pedro Esportes", date: "2026-02-07", time: "16:00", done: true, notes: "Corrida 5K orcamento enviado" },
  { id: "7", title: "Cadastrar novos leads do site", type: "tarefa" as ActivityType, contact: "Interno", date: "2026-02-09", time: "17:00", done: false, notes: "5 novos formularios" },
]

export default function AtividadesPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activities, setActivities] = useState(mockActivities)

  const pendentes = activities.filter(a => !a.done).length
  const concluidas = activities.filter(a => a.done).length
  const hoje = activities.filter(a => a.date === "2026-02-09" && !a.done).length

  const filtered = activities.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.contact.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || (statusFilter === "pendente" && !a.done) || (statusFilter === "concluida" && a.done)
    return matchesSearch && matchesStatus
  })

  const toggleDone = (id: string) => {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, done: !a.done } : a))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Atividades</h1>
          <p className="text-zinc-400 text-sm">Acompanhe tarefas, ligacoes e compromissos</p>
        </div>
        <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white"><Plus className="mr-2 h-4 w-4" /> Nova Atividade</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-yellow-500/10 flex items-center justify-center"><Clock className="h-6 w-6 text-yellow-500" /></div>
            <div><p className="text-xs text-zinc-500 uppercase">Pendentes</p><p className="text-2xl font-bold text-yellow-400">{pendentes}</p></div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center"><Activity className="h-6 w-6 text-red-500" /></div>
            <div><p className="text-xs text-zinc-500 uppercase">Para Hoje</p><p className="text-2xl font-bold text-red-400">{hoje}</p></div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center"><CheckCircle2 className="h-6 w-6 text-emerald-500" /></div>
            <div><p className="text-xs text-zinc-500 uppercase">Concluidas</p><p className="text-2xl font-bold text-emerald-400">{concluidas}</p></div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input placeholder="Buscar atividade..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-zinc-900/50 border-zinc-800 text-white" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40 bg-zinc-900/50 border-zinc-800 text-white"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="pendente">Pendentes</SelectItem>
            <SelectItem value="concluida">Concluidas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        {filtered.map((act) => {
          const config = typeConfig[act.type]
          const TypeIcon = config.icon
          return (
            <Card key={act.id} className={`border-zinc-800/50 transition-all duration-200 ${act.done ? "bg-zinc-900/30 opacity-60" : "bg-zinc-900/50 hover:border-zinc-700/50"}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <button onClick={() => toggleDone(act.id)} className="flex-shrink-0">
                    {act.done ? (
                      <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                    ) : (
                      <Circle className="h-6 w-6 text-zinc-600 hover:text-orange-500 transition-colors" />
                    )}
                  </button>
                  <div className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${config.color}`}>
                    <TypeIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${act.done ? "line-through text-zinc-500" : "text-white"}`}>{act.title}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500">
                      <span>{act.contact}</span>
                      <span>{new Date(act.date).toLocaleDateString("pt-BR")} - {act.time}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className={`text-xs border-zinc-700 ${act.done ? "text-zinc-600" : "text-zinc-400"}`}>{config.label}</Badge>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
