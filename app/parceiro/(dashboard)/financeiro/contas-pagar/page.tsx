"use client"

import { useState } from "react"
import { Receipt, AlertTriangle, CheckCircle2, Clock, Search, Plus, Download } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const mockBills = [
  { id: "1", description: "Aluguel do espaco", vendor: "Imobiliaria Centro", value: 5500, dueDate: "2026-02-15", status: "pendente", category: "Aluguel" },
  { id: "2", description: "Conta de energia", vendor: "CEMIG", value: 850, dueDate: "2026-02-10", status: "vencido", category: "Utilidades" },
  { id: "3", description: "Internet fibra optica", vendor: "Vivo", value: 199.90, dueDate: "2026-02-20", status: "pendente", category: "Utilidades" },
  { id: "4", description: "Software de gestao", vendor: "FitApp Pro", value: 299, dueDate: "2026-02-05", status: "pago", category: "Software" },
  { id: "5", description: "Seguro do imovel", vendor: "Porto Seguro", value: 450, dueDate: "2026-02-28", status: "pendente", category: "Seguros" },
  { id: "6", description: "Manutencao ar condicionado", vendor: "ClimaTech", value: 600, dueDate: "2026-02-01", status: "pago", category: "Manutencao" },
  { id: "7", description: "Agua", vendor: "SABESP", value: 320, dueDate: "2026-02-12", status: "vencido", category: "Utilidades" },
]

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pendente: { label: "Pendente", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20", icon: Clock },
  vencido: { label: "Vencido", color: "text-red-400 bg-red-500/10 border-red-500/20", icon: AlertTriangle },
  pago: { label: "Pago", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", icon: CheckCircle2 },
}

export default function ContasPagarPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const totalPendente = mockBills.filter(b => b.status === "pendente").reduce((a, b) => a + b.value, 0)
  const totalVencido = mockBills.filter(b => b.status === "vencido").reduce((a, b) => a + b.value, 0)
  const totalPago = mockBills.filter(b => b.status === "pago").reduce((a, b) => a + b.value, 0)

  const filtered = mockBills.filter(b => {
    const matchesSearch = b.description.toLowerCase().includes(search.toLowerCase()) || b.vendor.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || b.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Contas a Pagar</h1>
          <p className="text-zinc-400 text-sm">Gerencie suas despesas e pagamentos</p>
        </div>
        <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
          <Plus className="mr-2 h-4 w-4" /> Nova Conta
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider">Pendente</p>
                <p className="text-2xl font-bold text-yellow-400 mt-1">R$ {totalPendente.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-yellow-500/10 flex items-center justify-center"><Clock className="h-6 w-6 text-yellow-500" /></div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800/50 border-red-500/20">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider">Vencido</p>
                <p className="text-2xl font-bold text-red-400 mt-1">R$ {totalVencido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center"><AlertTriangle className="h-6 w-6 text-red-500" /></div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider">Pago</p>
                <p className="text-2xl font-bold text-emerald-400 mt-1">R$ {totalPago.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center"><CheckCircle2 className="h-6 w-6 text-emerald-500" /></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input placeholder="Buscar conta..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-zinc-900/50 border-zinc-800 text-white" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40 bg-zinc-900/50 border-zinc-800 text-white"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="vencido">Vencido</SelectItem>
            <SelectItem value="pago">Pago</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-zinc-900/50 border-zinc-800/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800/50">
                  <th className="text-left text-xs text-zinc-500 font-medium uppercase tracking-wider p-4">Descricao</th>
                  <th className="text-left text-xs text-zinc-500 font-medium uppercase tracking-wider p-4">Fornecedor</th>
                  <th className="text-left text-xs text-zinc-500 font-medium uppercase tracking-wider p-4">Vencimento</th>
                  <th className="text-left text-xs text-zinc-500 font-medium uppercase tracking-wider p-4">Status</th>
                  <th className="text-right text-xs text-zinc-500 font-medium uppercase tracking-wider p-4">Valor</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => {
                  const config = statusConfig[b.status]
                  const StatusIcon = config.icon
                  return (
                    <tr key={b.id} className="border-b border-zinc-800/30 hover:bg-zinc-800/20 transition-colors">
                      <td className="p-4">
                        <p className="text-sm text-white font-medium">{b.description}</p>
                        <p className="text-xs text-zinc-500">{b.category}</p>
                      </td>
                      <td className="p-4 text-sm text-zinc-400">{b.vendor}</td>
                      <td className="p-4 text-sm text-zinc-400">{new Date(b.dueDate).toLocaleDateString("pt-BR")}</td>
                      <td className="p-4">
                        <Badge variant="outline" className={`text-xs ${config.color}`}>
                          <StatusIcon className="mr-1 h-3 w-3" /> {config.label}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm font-semibold text-right text-white">R$ {b.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
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
