"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Zap,
  ChevronRight,
  MoreHorizontal,
  RefreshCw,
} from "lucide-react"
import {
  dashboardStats as mockDashboardStats,
  empresasCrescimento as mockEmpresasCrescimento,
  faturamentoMensal as mockFaturamentoMensal,
  empresas as mockEmpresas,
} from "@/lib/admin-data"
import { adminService } from "@/lib/api/services/admin.service"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const statusConfig = {
  ativo: { label: "Ativo", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  pendente: { label: "Pendente", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  bloqueado: { label: "Bloqueado", color: "bg-red-500/10 text-red-400 border-red-500/20" },
}

export default function AdminDashboardPage() {
  const [timeRange, setTimeRange] = useState("30d")
  const [dashboardStats, setDashboardStats] = useState(mockDashboardStats)
  const [empresasCrescimento, setEmpresasCrescimento] = useState(mockEmpresasCrescimento)
  const [faturamentoMensal, setFaturamentoMensal] = useState(mockFaturamentoMensal)
  const [empresas, setEmpresas] = useState(mockEmpresas)

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [statsRes, companiesRes, growthRes, revenueRes] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getCompanies(),
          adminService.getGrowthData(),
          adminService.getRevenueData(),
        ])
        if (statsRes.success && statsRes.data) setDashboardStats(statsRes.data as any)
        if (companiesRes.success && companiesRes.data) setEmpresas(companiesRes.data as any)
        if (growthRes.success && growthRes.data) setEmpresasCrescimento(growthRes.data as any)
        if (revenueRes.success && revenueRes.data) setFaturamentoMensal(revenueRes.data as any)
      } catch (error) {
        console.error("Erro ao carregar dashboard admin:", error)
      }
    }
    loadDashboard()
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatNumber = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`
    }
    return value.toString()
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 shadow-xl">
          <p className="text-xs text-zinc-400 mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm font-medium text-zinc-100">
              {entry.name === "valor" ? formatCurrency(entry.value) : entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">Dashboard</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Acompanhe o desempenho da plataforma em tempo real
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px] bg-zinc-900 border-zinc-800 text-zinc-300 text-sm h-9">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="90d">Últimos 90 dias</SelectItem>
              <SelectItem value="1y">Último ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="bg-zinc-900 border-zinc-800 text-zinc-300 h-9">
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Empresas */}
        <Card className="bg-zinc-900/50 border-zinc-800/50 overflow-hidden group hover:border-zinc-700/50 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-violet-400" />
                  </div>
                  <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Empresas</span>
                </div>
                <div>
                  <p className="text-3xl font-semibold text-zinc-100 tracking-tight">
                    {dashboardStats.totalEmpresas}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-xs text-emerald-400 font-medium">+12%</span>
                    <span className="text-xs text-zinc-500">vs mês anterior</span>
                  </div>
                </div>
              </div>
              <div className="w-20 h-12 opacity-50 group-hover:opacity-100 transition-opacity">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={empresasCrescimento.slice(-7)}>
                    <Line
                      type="monotone"
                      dataKey="empresas"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usuários */}
        <Card className="bg-zinc-900/50 border-zinc-800/50 overflow-hidden group hover:border-zinc-700/50 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Usuários</span>
                </div>
                <div>
                  <p className="text-3xl font-semibold text-zinc-100 tracking-tight">
                    {formatNumber(dashboardStats.totalUsuarios)}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-xs text-emerald-400 font-medium">+8.2%</span>
                    <span className="text-xs text-zinc-500">vs mês anterior</span>
                  </div>
                </div>
              </div>
              <div className="w-20 h-12 opacity-50 group-hover:opacity-100 transition-opacity">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[
                    { v: 10200 }, { v: 10800 }, { v: 11200 }, { v: 11600 },
                    { v: 12100 }, { v: 12400 }, { v: 12847 }
                  ]}>
                    <defs>
                      <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="v"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fill="url(#userGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Faturamento Total */}
        <Card className="bg-zinc-900/50 border-zinc-800/50 overflow-hidden group hover:border-zinc-700/50 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Faturamento</span>
                </div>
                <div>
                  <p className="text-3xl font-semibold text-zinc-100 tracking-tight">
                    {formatCurrency(dashboardStats.faturamentoTotal)}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-xs text-emerald-400 font-medium">+15.3%</span>
                    <span className="text-xs text-zinc-500">acumulado</span>
                  </div>
                </div>
              </div>
              <div className="w-20 h-12 opacity-50 group-hover:opacity-100 transition-opacity">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={faturamentoMensal.slice(-6)}>
                    <Bar dataKey="valor" fill="#10b981" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Faturamento Mensal */}
        <Card className="bg-zinc-900/50 border-zinc-800/50 overflow-hidden group hover:border-zinc-700/50 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-amber-400" />
                  </div>
                  <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Mensal</span>
                </div>
                <div>
                  <p className="text-3xl font-semibold text-zinc-100 tracking-tight">
                    {formatCurrency(dashboardStats.faturamentoMensal)}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <ArrowDownRight className="w-3.5 h-3.5 text-red-400" />
                    <span className="text-xs text-red-400 font-medium">-5.4%</span>
                    <span className="text-xs text-zinc-500">vs mês anterior</span>
                  </div>
                </div>
              </div>
              <div className="w-20 h-12 opacity-50 group-hover:opacity-100 transition-opacity">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={faturamentoMensal.slice(-7)}>
                    <Line
                      type="monotone"
                      dataKey="valor"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-violet-500/10 to-violet-500/5 border-violet-500/20">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-violet-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Novos Hoje</p>
                <p className="text-2xl font-semibold text-zinc-100">{dashboardStats.novasCadastrosDia}</p>
              </div>
              <div className="ml-auto">
                <Badge variant="outline" className="bg-violet-500/10 text-violet-400 border-violet-500/20">
                  <Activity className="w-3 h-3 mr-1" />
                  Live
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Esta Semana</p>
                <p className="text-2xl font-semibold text-zinc-100">{dashboardStats.novasCadastrosSemana}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-xs text-zinc-500">Média diária</p>
                <p className="text-sm font-medium text-blue-400">
                  {(dashboardStats.novasCadastrosSemana / 7).toFixed(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Este Mês</p>
                <p className="text-2xl font-semibold text-zinc-100">{dashboardStats.novasCadastrosMes}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-xs text-zinc-500">Meta: 100</p>
                <p className="text-sm font-medium text-emerald-400">
                  {((dashboardStats.novasCadastrosMes / 100) * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crescimento de Empresas */}
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-medium text-zinc-100">
                  Crescimento de Empresas
                </CardTitle>
                <p className="text-xs text-zinc-500 mt-0.5">Evolução mensal de cadastros</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-zinc-300">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={empresasCrescimento}>
                  <defs>
                    <linearGradient id="empresasGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis
                    dataKey="mes"
                    stroke="#52525b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#52525b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="empresas"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fill="url(#empresasGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Faturamento Mensal */}
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-medium text-zinc-100">
                  Faturamento Mensal
                </CardTitle>
                <p className="text-xs text-zinc-500 mt-0.5">Receita ao longo do ano</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-zinc-300">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={faturamentoMensal} barSize={24}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis
                    dataKey="mes"
                    stroke="#52525b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#52525b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="valor"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    className="hover:opacity-80 transition-opacity"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Companies Table */}
      <Card className="bg-zinc-900/50 border-zinc-800/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-medium text-zinc-100">
                Empresas Recentes
              </CardTitle>
              <p className="text-xs text-zinc-500 mt-0.5">Últimos cadastros na plataforma</p>
            </div>
            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-100 text-xs h-8">
              Ver todas
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-y border-zinc-800/50">
                  <th className="text-left py-3 px-5 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Empresa
                  </th>
                  <th className="text-left py-3 px-5 text-xs font-medium text-zinc-500 uppercase tracking-wider hidden sm:table-cell">
                    Tipo
                  </th>
                  <th className="text-left py-3 px-5 text-xs font-medium text-zinc-500 uppercase tracking-wider hidden md:table-cell">
                    Localização
                  </th>
                  <th className="text-left py-3 px-5 text-xs font-medium text-zinc-500 uppercase tracking-wider hidden lg:table-cell">
                    Data
                  </th>
                  <th className="text-left py-3 px-5 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/30">
                {empresas.slice(0, 5).map((empresa) => (
                  <tr
                    key={empresa.id}
                    className="group hover:bg-zinc-800/30 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center text-sm font-medium text-zinc-300">
                          {empresa.nome.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-zinc-200 text-sm group-hover:text-zinc-100 transition-colors">
                            {empresa.nome}
                          </p>
                          <p className="text-xs text-zinc-500 sm:hidden">{empresa.tipo}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 hidden sm:table-cell">
                      <span className="text-sm text-zinc-400">{empresa.tipo}</span>
                    </td>
                    <td className="py-3.5 px-5 hidden md:table-cell">
                      <span className="text-sm text-zinc-400">
                        {empresa.cidade}, {empresa.estado}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 hidden lg:table-cell">
                      <span className="text-sm text-zinc-500">
                        {new Date(empresa.dataCadastro).toLocaleDateString("pt-BR")}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <Badge
                        variant="outline"
                        className={`text-xs font-medium ${statusConfig[empresa.status].color}`}
                      >
                        {statusConfig[empresa.status].label}
                      </Badge>
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
