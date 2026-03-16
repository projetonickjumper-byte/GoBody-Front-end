"use client"

import { useState, useEffect } from "react"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Calendar,
  BarChart3,
  Download,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { billingService } from "@/lib/api/services/billing.service"

const monthlyData = [
  { month: "Jan", revenue: 8500, clients: 45, bookings: 120 },
  { month: "Fev", revenue: 9200, clients: 48, bookings: 135 },
  { month: "Mar", revenue: 10100, clients: 52, bookings: 148 },
  { month: "Abr", revenue: 9800, clients: 50, bookings: 142 },
  { month: "Mai", revenue: 11200, clients: 58, bookings: 165 },
  { month: "Jun", revenue: 12450, clients: 62, bookings: 180 },
]

const topServices = [
  { name: "Musculacao", revenue: 4500, percentage: 36 },
  { name: "Personal Trainer", revenue: 3200, percentage: 26 },
  { name: "CrossFit", revenue: 2100, percentage: 17 },
  { name: "Yoga", revenue: 1650, percentage: 13 },
  { name: "Spinning", revenue: 1000, percentage: 8 },
]

const topProducts = [
  { name: "Whey Protein 900g", sales: 42, revenue: 6295.80 },
  { name: "Camiseta Treino", sales: 28, revenue: 2237.20 },
  { name: "Garrafa Termica 1L", sales: 35, revenue: 2096.50 },
  { name: "Luva de Treino", sales: 18, revenue: 898.20 },
]

export default function RelatoriosPage() {
  const [period, setPeriod] = useState("month")
  const [reportData, setReportData] = useState(monthlyData)

  useEffect(() => {
    async function loadReportData() {
      try {
        const res = await billingService.getSummary()
        if (res.success && res.data && (res.data as any).monthlyData) {
          setReportData((res.data as any).monthlyData)
        }
      } catch (error) {
        console.error("Erro ao carregar dados do relatório:", error)
      }
    }
    loadReportData()
  }, [])

  const currentMonth = reportData[reportData.length - 1]
  const previousMonth = reportData[reportData.length - 2]

  const revenueChange = ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue * 100).toFixed(1)
  const clientsChange = ((currentMonth.clients - previousMonth.clients) / previousMonth.clients * 100).toFixed(1)
  const bookingsChange = ((currentMonth.bookings - previousMonth.bookings) / previousMonth.bookings * 100).toFixed(1)

  const maxRevenue = Math.max(...reportData.map(d => d.revenue))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Relatorios</h1>
          <p className="text-muted-foreground">Acompanhe o desempenho do seu negocio</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Ultima semana</SelectItem>
              <SelectItem value="month">Ultimo mes</SelectItem>
              <SelectItem value="quarter">Ultimo trimestre</SelectItem>
              <SelectItem value="year">Ultimo ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="bg-transparent">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                Number(revenueChange) >= 0 ? "text-green-500" : "text-red-500"
              }`}>
                {Number(revenueChange) >= 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                {revenueChange}%
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-foreground">
                R$ {currentMonth.revenue.toLocaleString("pt-BR")}
              </p>
              <p className="text-sm text-muted-foreground">Faturamento</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                Number(clientsChange) >= 0 ? "text-green-500" : "text-red-500"
              }`}>
                {Number(clientsChange) >= 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                {clientsChange}%
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-foreground">{currentMonth.clients}</p>
              <p className="text-sm text-muted-foreground">Clientes ativos</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                Number(bookingsChange) >= 0 ? "text-green-500" : "text-red-500"
              }`}>
                {Number(bookingsChange) >= 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                {bookingsChange}%
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-foreground">{currentMonth.bookings}</p>
              <p className="text-sm text-muted-foreground">Reservas</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-foreground">
                R$ {(currentMonth.revenue / currentMonth.clients).toFixed(0)}
              </p>
              <p className="text-sm text-muted-foreground">Ticket medio</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Evolucao do Faturamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.map((data) => (
                <div key={data.month} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{data.month}</span>
                    <span className="text-muted-foreground">
                      R$ {data.revenue.toLocaleString("pt-BR")}
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${(data.revenue / maxRevenue) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Services */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Servicos Mais Rentaveis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topServices.map((service, index) => (
                <div key={service.name} className="flex items-center gap-4">
                  <span className="w-6 text-center font-bold text-muted-foreground">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-foreground">{service.name}</span>
                      <span className="text-sm text-muted-foreground">
                        R$ {service.revenue.toLocaleString("pt-BR")}
                      </span>
                    </div>
                    <Progress value={service.percentage} className="h-2" />
                  </div>
                  <span className="w-12 text-right text-sm text-muted-foreground">
                    {service.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Produtos Mais Vendidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Produto</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Vendas</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Receita</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product) => (
                  <tr key={product.name} className="border-b border-border last:border-0">
                    <td className="py-3 px-4">
                      <span className="font-medium text-foreground">{product.name}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-foreground">{product.sales}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-medium text-foreground">
                        R$ {product.revenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
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
