"use client"

import { useState } from "react"
import { Target, Plus, Search, Phone, Mail, MessageSquare, MoreVertical, ArrowRight, User, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const statusStages = [
  { key: "novo", label: "Novo", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  { key: "contato", label: "Contato Feito", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" },
  { key: "interesse", label: "Interessado", color: "text-orange-400 bg-orange-500/10 border-orange-500/20" },
  { key: "visita", label: "Agendou Visita", color: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
  { key: "convertido", label: "Convertido", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  { key: "perdido", label: "Perdido", color: "text-red-400 bg-red-500/10 border-red-500/20" },
]

const mockLeads = [
  { id: "1", name: "Fernando Matos", email: "fernando@email.com", phone: "(11) 99999-1234", source: "Instagram", status: "novo", date: "2026-02-09", interest: "Musculacao", notes: "Viu anuncio no Instagram" },
  { id: "2", name: "Camila Rodrigues", email: "camila@email.com", phone: "(11) 98888-5678", source: "Google", status: "contato", date: "2026-02-08", interest: "Pilates", notes: "Ligou pedindo informacoes" },
  { id: "3", name: "Lucas Mendes", email: "lucas@email.com", phone: "(11) 97777-9012", source: "Indicacao", status: "interesse", date: "2026-02-07", interest: "Crossfit", notes: "Amigo ja e aluno" },
  { id: "4", name: "Patricia Oliveira", email: "patricia@email.com", phone: "(11) 96666-3456", source: "Site", status: "visita", date: "2026-02-06", interest: "Personal", notes: "Visita agendada para quinta" },
  { id: "5", name: "Diego Almeida", email: "diego@email.com", phone: "(11) 95555-7890", source: "Facebook", status: "convertido", date: "2026-02-05", interest: "Plano Anual", notes: "Fechou plano anual" },
  { id: "6", name: "Renata Souza", email: "renata@email.com", phone: "(11) 94444-1234", source: "Instagram", status: "perdido", date: "2026-02-04", interest: "Musculacao", notes: "Achou caro" },
  { id: "7", name: "Bruno Santos", email: "bruno@email.com", phone: "(11) 93333-5678", source: "WhatsApp", status: "novo", date: "2026-02-09", interest: "Day Use", notes: "" },
]

export default function LeadsPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddOpen, setIsAddOpen] = useState(false)

  const filtered = mockLeads.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.email.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || l.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusConfig = (status: string) => statusStages.find(s => s.key === status) || statusStages[0]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Leads</h1>
          <p className="text-zinc-400 text-sm">Gerencie seus potenciais clientes</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white"><Plus className="mr-2 h-4 w-4" /> Novo Lead</Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-800">
            <DialogHeader><DialogTitle className="text-white">Novo Lead</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label className="text-zinc-300">Nome</Label><Input className="bg-zinc-800 border-zinc-700 text-white" /></div>
                <div className="space-y-2"><Label className="text-zinc-300">Telefone</Label><Input className="bg-zinc-800 border-zinc-700 text-white" /></div>
              </div>
              <div className="space-y-2"><Label className="text-zinc-300">Email</Label><Input type="email" className="bg-zinc-800 border-zinc-700 text-white" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-zinc-300">Origem</Label>
                  <Select defaultValue="instagram">
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="google">Google</SelectItem>
                      <SelectItem value="site">Site</SelectItem>
                      <SelectItem value="indicacao">Indicacao</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label className="text-zinc-300">Interesse</Label><Input className="bg-zinc-800 border-zinc-700 text-white" placeholder="Ex: Musculacao" /></div>
              </div>
              <div className="space-y-2"><Label className="text-zinc-300">Observacoes</Label><Textarea className="bg-zinc-800 border-zinc-700 text-white" /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)} className="border-zinc-700 text-zinc-300">Cancelar</Button>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => setIsAddOpen(false)}>Salvar Lead</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Pipeline overview */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {statusStages.map((stage) => {
          const count = mockLeads.filter(l => l.status === stage.key).length
          return (
            <Card key={stage.key} className="bg-zinc-900/50 border-zinc-800/50 cursor-pointer hover:border-zinc-700/50 transition-colors" onClick={() => setStatusFilter(statusFilter === stage.key ? "all" : stage.key)}>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-white">{count}</p>
                <p className="text-xs text-zinc-500 mt-1">{stage.label}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input placeholder="Buscar lead..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-zinc-900/50 border-zinc-800 text-white" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48 bg-zinc-900/50 border-zinc-800 text-white"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">
            <SelectItem value="all">Todos</SelectItem>
            {statusStages.map((s) => <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filtered.map((lead) => {
          const config = getStatusConfig(lead.status)
          return (
            <Card key={lead.id} className="bg-zinc-900/50 border-zinc-800/50 hover:border-zinc-700/50 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <Avatar className="h-11 w-11 border-2 border-zinc-700">
                    <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white font-semibold text-sm">
                      {lead.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div>
                        <h3 className="font-semibold text-white">{lead.name}</h3>
                        <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500">
                          <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {lead.email}</span>
                          <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {lead.phone}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className={`text-xs ${config.color}`}>{config.label}</Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-3 flex-wrap">
                      <Badge variant="outline" className="border-zinc-700 text-zinc-400 text-xs">{lead.source}</Badge>
                      <Badge variant="outline" className="border-zinc-700 text-zinc-400 text-xs">{lead.interest}</Badge>
                      <span className="text-xs text-zinc-600 flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(lead.date).toLocaleDateString("pt-BR")}</span>
                    </div>
                    {lead.notes && <p className="text-xs text-zinc-500 mt-2 italic">{lead.notes}</p>}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-emerald-400 hover:bg-emerald-500/10"><Phone className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-blue-400 hover:bg-blue-500/10"><MessageSquare className="h-4 w-4" /></Button>
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
