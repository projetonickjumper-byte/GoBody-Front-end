"use client"

import { useState, useEffect } from "react"
import { ShoppingBasket, TrendingUp, DollarSign, ShoppingCart, Search, Download, Calendar, Eye } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { billingService } from "@/lib/api/services/billing.service"

const mockSales = [
  { id: "1", client: "Maria Silva", items: "Plano Mensal Premium", qty: 1, value: 199.90, date: "2026-02-09", method: "PIX", seller: "Online" },
  { id: "2", client: "Joao Santos", items: "Day Use + Toalha", qty: 2, value: 59.90, date: "2026-02-09", method: "Cartao", seller: "Recepcao" },
  { id: "3", client: "Ana Costa", items: "Personal 8 sessoes", qty: 1, value: 800.00, date: "2026-02-08", method: "PIX", seller: "Carlos Lima" },
  { id: "4", client: "Pedro Alves", items: "Plano Trimestral", qty: 1, value: 449.70, date: "2026-02-08", method: "Cartao", seller: "Online" },
  { id: "5", client: "Lucia Fernandes", items: "Suplemento Whey + BCAA", qty: 2, value: 189.80, date: "2026-02-07", method: "Dinheiro", seller: "Loja" },
  { id: "6", client: "Roberto Lima", items: "Plano Anual", qty: 1, value: 1799.00, date: "2026-02-07", method: "Cartao", seller: "Online" },
  { id: "7", client: "Camila Dias", items: "Camiseta FitApp + Squeeze", qty: 2, value: 119.80, date: "2026-02-06", method: "PIX", seller: "Loja" },
]

export default function VendasPage() {
  const [search, setSearch] = useState("")
  const [period, setPeriod] = useState("mes")
  const [sales, setSales] = useState(mockSales)

  useEffect(() => {
    async function loadSales() {
      try {
        const res = await billingService.getTransactions({ type: "sale" })
        if (res.success && res.data && res.data.length > 0) {
          setSales(res.data as any)
        }
      } catch (error) {
        console.error("Erro ao carregar vendas:", error)
      }
    }
    loadSales()
  }, [])

  const totalVendas = sales.reduce((a, b) => a + b.value, 0)
  const ticketMedio = sales.length > 0 ? totalVendas / sales.length : 0

  const filtered = sales.filter(s =>
    s.client.toLowerCase().includes(search.toLowerCase()) || s.items.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Vendas</h1>
          <p className="text-zinc-400 text-sm">Acompanhe todas as vendas do seu negocio</p>
        </div>
        <Button variant="outline" size="sm" className="border-zinc-800 text-zinc-400 hover:text-white"><Download className="mr-2 h-4 w-4" /> Exportar</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-5">
            <p className="text-xs text-zinc-500 uppercase tracking-wider">Total Vendas</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">R$ {totalVendas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-5">
            <p className="text-xs text-zinc-500 uppercase tracking-wider">Qtd Vendas</p>
            <p className="text-2xl font-bold text-white mt-1">{mockSales.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-5">
            <p className="text-xs text-zinc-500 uppercase tracking-wider">Ticket Medio</p>
            <p className="text-2xl font-bold text-orange-400 mt-1">R$ {ticketMedio.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-5">
            <p className="text-xs text-zinc-500 uppercase tracking-wider">Crescimento</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1 flex items-center gap-1"><TrendingUp className="h-5 w-5" /> +18%</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input placeholder="Buscar venda..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-zinc-900/50 border-zinc-800 text-white" />
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-full sm:w-40 bg-zinc-900/50 border-zinc-800 text-white"><SelectValue /></SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">
            <SelectItem value="hoje">Hoje</SelectItem>
            <SelectItem value="semana">Semana</SelectItem>
            <SelectItem value="mes">Mes</SelectItem>
            <SelectItem value="trimestre">Trimestre</SelectItem>
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
                  <th className="text-left text-xs text-zinc-500 font-medium uppercase tracking-wider p-4">Itens</th>
                  <th className="text-left text-xs text-zinc-500 font-medium uppercase tracking-wider p-4">Data</th>
                  <th className="text-left text-xs text-zinc-500 font-medium uppercase tracking-wider p-4">Pagamento</th>
                  <th className="text-left text-xs text-zinc-500 font-medium uppercase tracking-wider p-4">Vendedor</th>
                  <th className="text-right text-xs text-zinc-500 font-medium uppercase tracking-wider p-4">Valor</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id} className="border-b border-zinc-800/30 hover:bg-zinc-800/20 transition-colors">
                    <td className="p-4 text-sm text-white font-medium">{s.client}</td>
                    <td className="p-4 text-sm text-zinc-400">{s.items}</td>
                    <td className="p-4 text-sm text-zinc-500">{new Date(s.date).toLocaleDateString("pt-BR")}</td>
                    <td className="p-4"><Badge variant="outline" className="border-zinc-700 text-zinc-400 text-xs">{s.method}</Badge></td>
                    <td className="p-4 text-sm text-zinc-400">{s.seller}</td>
                    <td className="p-4 text-sm font-semibold text-right text-emerald-400">R$ {s.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
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
