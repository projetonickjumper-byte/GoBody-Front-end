"use client"

import { useState, useEffect } from "react"
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Filter, Download, Plus, Search, Calendar, Eye, MoreVertical } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { billingService } from "@/lib/api/services/billing.service"

const mockTransactions = [
  { id: "1", type: "entrada", description: "Mensalidade - Maria Silva", value: 149.90, date: "2026-02-09", category: "Mensalidade", method: "PIX" },
  { id: "2", type: "entrada", description: "Day Use - Joao Santos", value: 39.90, date: "2026-02-09", category: "Day Use", method: "Cartao Credito" },
  { id: "3", type: "saida", description: "Conta de energia", value: 850.00, date: "2026-02-08", category: "Despesa Fixa", method: "Boleto" },
  { id: "4", type: "entrada", description: "Plano Trimestral - Ana Costa", value: 399.90, date: "2026-02-08", category: "Mensalidade", method: "Cartao Credito" },
  { id: "5", type: "saida", description: "Manutencao equipamentos", value: 1200.00, date: "2026-02-07", category: "Manutencao", method: "Transferencia" },
  { id: "6", type: "entrada", description: "Personal - Carlos Lima", value: 200.00, date: "2026-02-07", category: "Personal", method: "PIX" },
  { id: "7", type: "saida", description: "Material de limpeza", value: 180.00, date: "2026-02-06", category: "Suprimentos", method: "Cartao Debito" },
  { id: "8", type: "entrada", description: "Mensalidade - Pedro Alves", value: 99.90, date: "2026-02-06", category: "Mensalidade", method: "Boleto" },
]

export default function CaixaPage() {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [transactions, setTransactions] = useState(mockTransactions)

  useEffect(() => {
    async function loadTransactions() {
      try {
        const res = await billingService.getTransactions({})
        if (res.success && res.data && res.data.length > 0) {
          setTransactions(res.data as any)
        }
      } catch (error) {
        console.error("Erro ao carregar transações:", error)
      }
    }
    loadTransactions()
  }, [])

  const totalEntradas = transactions.filter(t => t.type === "entrada").reduce((acc, t) => acc + t.value, 0)
  const totalSaidas = transactions.filter(t => t.type === "saida").reduce((acc, t) => acc + t.value, 0)
  const saldo = totalEntradas - totalSaidas

  const filtered = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase())
    const matchesType = typeFilter === "all" || t.type === typeFilter
    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Caixa</h1>
          <p className="text-zinc-400 text-sm">Controle de entradas e saidas do seu negocio</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="border-zinc-800 text-zinc-400 hover:text-white">
            <Download className="mr-2 h-4 w-4" /> Exportar
          </Button>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                <Plus className="mr-2 h-4 w-4" /> Nova Transacao
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-zinc-800">
              <DialogHeader>
                <DialogTitle className="text-white">Nova Transacao</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label className="text-zinc-300">Tipo</Label>
                  <Select defaultValue="entrada">
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      <SelectItem value="entrada">Entrada</SelectItem>
                      <SelectItem value="saida">Saida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Descricao</Label>
                  <Input className="bg-zinc-800 border-zinc-700 text-white" placeholder="Ex: Mensalidade cliente" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-zinc-300">Valor (R$)</Label>
                    <Input type="number" className="bg-zinc-800 border-zinc-700 text-white" placeholder="0,00" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-300">Metodo</Label>
                    <Select defaultValue="pix">
                      <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-zinc-800 border-zinc-700">
                        <SelectItem value="pix">PIX</SelectItem>
                        <SelectItem value="credito">Cartao Credito</SelectItem>
                        <SelectItem value="debito">Cartao Debito</SelectItem>
                        <SelectItem value="boleto">Boleto</SelectItem>
                        <SelectItem value="dinheiro">Dinheiro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Observacoes</Label>
                  <Textarea className="bg-zinc-800 border-zinc-700 text-white" placeholder="Opcional..." />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)} className="border-zinc-700 text-zinc-300">Cancelar</Button>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => setIsAddOpen(false)}>Salvar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider">Entradas</p>
                <p className="text-2xl font-bold text-emerald-400 mt-1">R$ {totalEntradas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <ArrowUpRight className="h-6 w-6 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider">Saidas</p>
                <p className="text-2xl font-bold text-red-400 mt-1">R$ {totalSaidas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                <ArrowDownRight className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider">Saldo</p>
                <p className={`text-2xl font-bold mt-1 ${saldo >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  R$ {saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input placeholder="Buscar transacao..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-zinc-900/50 border-zinc-800 text-white" />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-40 bg-zinc-900/50 border-zinc-800 text-white"><SelectValue placeholder="Tipo" /></SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="entrada">Entradas</SelectItem>
            <SelectItem value="saida">Saidas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Transactions Table */}
      <Card className="bg-zinc-900/50 border-zinc-800/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800/50">
                  <th className="text-left text-xs text-zinc-500 font-medium uppercase tracking-wider p-4">Descricao</th>
                  <th className="text-left text-xs text-zinc-500 font-medium uppercase tracking-wider p-4">Categoria</th>
                  <th className="text-left text-xs text-zinc-500 font-medium uppercase tracking-wider p-4">Metodo</th>
                  <th className="text-left text-xs text-zinc-500 font-medium uppercase tracking-wider p-4">Data</th>
                  <th className="text-right text-xs text-zinc-500 font-medium uppercase tracking-wider p-4">Valor</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id} className="border-b border-zinc-800/30 hover:bg-zinc-800/20 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${t.type === "entrada" ? "bg-emerald-500/10" : "bg-red-500/10"}`}>
                          {t.type === "entrada" ? <ArrowUpRight className="h-4 w-4 text-emerald-500" /> : <ArrowDownRight className="h-4 w-4 text-red-500" />}
                        </div>
                        <span className="text-sm text-white font-medium">{t.description}</span>
                      </div>
                    </td>
                    <td className="p-4"><Badge variant="outline" className="border-zinc-700 text-zinc-400 text-xs">{t.category}</Badge></td>
                    <td className="p-4 text-sm text-zinc-400">{t.method}</td>
                    <td className="p-4 text-sm text-zinc-500">{new Date(t.date).toLocaleDateString("pt-BR")}</td>
                    <td className={`p-4 text-sm font-semibold text-right ${t.type === "entrada" ? "text-emerald-400" : "text-red-400"}`}>
                      {t.type === "entrada" ? "+" : "-"} R$ {t.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
