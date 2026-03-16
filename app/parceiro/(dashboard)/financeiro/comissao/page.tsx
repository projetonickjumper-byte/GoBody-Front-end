"use client"

import { useState, useEffect } from "react"
import { BadgeDollarSign, Users, TrendingUp, Calendar, Search, Download, Settings, MoreVertical } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { billingService } from "@/lib/api/services/billing.service"

const mockProfessionals = [
  { id: "1", name: "Carlos Lima", role: "Personal Trainer", sales: 12, revenue: 3600, commission: 1080, rate: 30, avatar: "CL" },
  { id: "2", name: "Ana Souza", role: "Instrutora Pilates", sales: 8, revenue: 2400, commission: 600, rate: 25, avatar: "AS" },
  { id: "3", name: "Roberto Silva", role: "Personal Trainer", sales: 15, revenue: 4500, commission: 1350, rate: 30, avatar: "RS" },
  { id: "4", name: "Juliana Costa", role: "Instrutora Yoga", sales: 6, revenue: 1800, commission: 360, rate: 20, avatar: "JC" },
  { id: "5", name: "Marco Antonio", role: "Personal Trainer", sales: 10, revenue: 3000, commission: 900, rate: 30, avatar: "MA" },
]

export default function ComissaoPage() {
  const [search, setSearch] = useState("")
  const [period, setPeriod] = useState("mes")
  const [professionals, setProfessionals] = useState(mockProfessionals)

  useEffect(() => {
    async function loadCommissions() {
      try {
        const res = await billingService.getTransactions({ type: "commission" })
        if (res.success && res.data && res.data.length > 0) {
          setProfessionals(res.data as any)
        }
      } catch (error) {
        console.error("Erro ao carregar comissões:", error)
      }
    }
    loadCommissions()
  }, [])

  const totalComissoes = professionals.reduce((acc, p) => acc + p.commission, 0)
  const totalRevenue = professionals.reduce((acc, p) => acc + p.revenue, 0)
  const maxCommission = Math.max(...professionals.map(p => p.commission))

  const filtered = professionals.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Comissoes</h1>
          <p className="text-zinc-400 text-sm">Gerencie as comissoes dos profissionais</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="border-zinc-800 text-zinc-400 hover:text-white">
            <Download className="mr-2 h-4 w-4" /> Exportar
          </Button>
          <Button variant="outline" size="sm" className="border-zinc-800 text-zinc-400 hover:text-white">
            <Settings className="mr-2 h-4 w-4" /> Regras
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider">Total Comissoes</p>
                <p className="text-2xl font-bold text-orange-400 mt-1">R$ {totalComissoes.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <BadgeDollarSign className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider">Faturamento Gerado</p>
                <p className="text-2xl font-bold text-emerald-400 mt-1">R$ {totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider">Profissionais</p>
                <p className="text-2xl font-bold text-white mt-1">{mockProfessionals.length}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input placeholder="Buscar profissional..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-zinc-900/50 border-zinc-800 text-white" />
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-full sm:w-48 bg-zinc-900/50 border-zinc-800 text-white"><SelectValue /></SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">
            <SelectItem value="mes">Este mes</SelectItem>
            <SelectItem value="semana">Esta semana</SelectItem>
            <SelectItem value="trimestre">Trimestre</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filtered.map((p) => (
          <Card key={p.id} className="bg-zinc-900/50 border-zinc-800/50 hover:border-zinc-700/50 transition-colors">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border-2 border-zinc-700">
                  <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white font-semibold text-sm">{p.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <h3 className="font-semibold text-white">{p.name}</h3>
                      <p className="text-xs text-zinc-500">{p.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-orange-400">R$ {p.commission.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                      <p className="text-xs text-zinc-500">{p.rate}% de R$ {p.revenue.toLocaleString("pt-BR")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex-1">
                      <Progress value={(p.commission / maxCommission) * 100} className="h-2 bg-zinc-800 [&>div]:bg-gradient-to-r [&>div]:from-orange-500 [&>div]:to-orange-600" />
                    </div>
                    <Badge variant="outline" className="border-zinc-700 text-zinc-400 text-xs">{p.sales} vendas</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
