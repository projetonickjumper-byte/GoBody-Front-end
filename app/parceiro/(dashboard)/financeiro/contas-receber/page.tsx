"use client"

import { useState, useEffect } from "react"
import { CreditCard, CheckCircle2, Clock, AlertTriangle, Search, Plus, Send } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { billingService } from "@/lib/api/services/billing.service"

const mockReceivables = [
  { id: "1", client: "Maria Silva", description: "Plano Mensal Premium", value: 199.90, dueDate: "2026-02-15", status: "pendente" },
  { id: "2", client: "Joao Santos", description: "Plano Trimestral", value: 449.70, dueDate: "2026-02-10", status: "recebido" },
  { id: "3", client: "Ana Costa", description: "Personal 8 sessoes", value: 800, dueDate: "2026-02-08", status: "atrasado" },
  { id: "4", client: "Pedro Alves", description: "Plano Mensal Basico", value: 99.90, dueDate: "2026-02-20", status: "pendente" },
  { id: "5", client: "Lucia Fernandes", description: "Plano Anual", value: 1799.00, dueDate: "2026-02-01", status: "recebido" },
  { id: "6", client: "Roberto Lima", description: "Day Use + Personal", value: 89.90, dueDate: "2026-02-05", status: "atrasado" },
]

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pendente: { label: "Pendente", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20", icon: Clock },
  atrasado: { label: "Atrasado", color: "text-red-400 bg-red-500/10 border-red-500/20", icon: AlertTriangle },
  recebido: { label: "Recebido", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", icon: CheckCircle2 },
}

export default function ContasReceberPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [receivables, setReceivables] = useState(mockReceivables)

  useEffect(() => {
    async function loadReceivables() {
      try {
        const res = await billingService.getTransactions({ type: "receivable" })
        if (res.success && res.data && res.data.length > 0) {
          setReceivables(res.data as any)
        }
      } catch (error) {
        console.error("Erro ao carregar contas a receber:", error)
      }
    }
    loadReceivables()
  }, [])

  const totalPendente = receivables.filter(r => r.status === "pendente").reduce((a, b) => a + b.value, 0)
  const totalAtrasado = receivables.filter(r => r.status === "atrasado").reduce((a, b) => a + b.value, 0)
  const totalRecebido = receivables.filter(r => r.status === "recebido").reduce((a, b) => a + b.value, 0)

  const filtered = receivables.filter(r => {
    const matchesSearch = r.client.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || r.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Contas a Receber</h1>
          <p className="text-zinc-400 text-sm">Gerencie os recebimentos dos seus clientes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-zinc-800 text-zinc-400 hover:text-white"><Send className="mr-2 h-4 w-4" /> Cobrar</Button>
          <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white"><Plus className="mr-2 h-4 w-4" /> Nova Cobranca</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-5">
            <p className="text-xs text-zinc-500 uppercase tracking-wider">A Receber</p>
            <p className="text-2xl font-bold text-yellow-400 mt-1">R$ {totalPendente.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800/50 border-red-500/20">
          <CardContent className="p-5">
            <p className="text-xs text-zinc-500 uppercase tracking-wider">Atrasado</p>
            <p className="text-2xl font-bold text-red-400 mt-1">R$ {totalAtrasado.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-5">
            <p className="text-xs text-zinc-500 uppercase tracking-wider">Recebido</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">R$ {totalRecebido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input placeholder="Buscar cliente ou descricao..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-zinc-900/50 border-zinc-800 text-white" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40 bg-zinc-900/50 border-zinc-800 text-white"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="atrasado">Atrasado</SelectItem>
            <SelectItem value="recebido">Recebido</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-zinc-900/50 border-zinc-800/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800/50">
                  <th className="text-left text-xs text-zinc-500 font-medium uppercase tracking-wider p-4">Cliente</th>
                  <th className="text-left text-xs text-zinc-500 font-medium uppercase tracking-wider p-4">Descricao</th>
                  <th className="text-left text-xs text-zinc-500 font-medium uppercase tracking-wider p-4">Vencimento</th>
                  <th className="text-left text-xs text-zinc-500 font-medium uppercase tracking-wider p-4">Status</th>
                  <th className="text-right text-xs text-zinc-500 font-medium uppercase tracking-wider p-4">Valor</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const config = statusConfig[r.status]
                  const StatusIcon = config.icon
                  return (
                    <tr key={r.id} className="border-b border-zinc-800/30 hover:bg-zinc-800/20 transition-colors">
                      <td className="p-4 text-sm text-white font-medium">{r.client}</td>
                      <td className="p-4 text-sm text-zinc-400">{r.description}</td>
                      <td className="p-4 text-sm text-zinc-400">{new Date(r.dueDate).toLocaleDateString("pt-BR")}</td>
                      <td className="p-4"><Badge variant="outline" className={`text-xs ${config.color}`}><StatusIcon className="mr-1 h-3 w-3" /> {config.label}</Badge></td>
                      <td className="p-4 text-sm font-semibold text-right text-white">R$ {r.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
