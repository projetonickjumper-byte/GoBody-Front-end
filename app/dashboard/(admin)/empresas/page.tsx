"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Building2,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Ban,
  CheckCircle,
  Users,
  DollarSign,
  Plus,
  ArrowUpDown,
  Clock,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { empresas as mockEmpresas, type Empresa, type EmpresaStatus } from "@/lib/admin-data"
import { adminService } from "@/lib/api/services/admin.service"

const statusConfig = {
  ativo: { 
    label: "Ativo", 
    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    icon: CheckCircle,
    bgIcon: "bg-emerald-500/10",
    textIcon: "text-emerald-400"
  },
  pendente: { 
    label: "Pendente", 
    color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    icon: Clock,
    bgIcon: "bg-amber-500/10",
    textIcon: "text-amber-400"
  },
  bloqueado: { 
    label: "Bloqueado", 
    color: "bg-red-500/10 text-red-400 border-red-500/20",
    icon: Ban,
    bgIcon: "bg-red-500/10",
    textIcon: "text-red-400"
  },
}

export default function EmpresasPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("todos")
  const [empresasList, setEmpresasList] = useState<Empresa[]>(mockEmpresas)

  useEffect(() => {
    async function loadCompanies() {
      try {
        const res = await adminService.getCompanies()
        if (res.success && res.data && res.data.length > 0) {
          setEmpresasList(res.data as Empresa[])
        }
      } catch (error) {
        console.error("Erro ao carregar empresas:", error)
      }
    }
    loadCompanies()
  }, [])

  const filteredEmpresas = empresasList.filter((empresa) => {
    const matchesSearch = empresa.nome.toLowerCase().includes(search.toLowerCase()) ||
      empresa.cidade.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "todos" || empresa.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleStatusChange = (empresaId: string, newStatus: EmpresaStatus) => {
    setEmpresasList((prev) =>
      prev.map((e) => (e.id === empresaId ? { ...e, status: newStatus } : e))
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const totalAtivas = empresasList.filter((e) => e.status === "ativo").length
  const totalPendentes = empresasList.filter((e) => e.status === "pendente").length
  const totalBloqueadas = empresasList.filter((e) => e.status === "bloqueado").length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">Empresas</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Gerencie empresas e profissionais cadastrados
          </p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white h-9">
          <Plus className="w-4 h-4 mr-2" />
          Nova Empresa
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-zinc-900/50 border-zinc-800/50 hover:border-emerald-500/30 transition-colors cursor-pointer"
              onClick={() => setStatusFilter("ativo")}>
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-zinc-400">Ativas</p>
                <p className="text-2xl font-semibold text-zinc-100">{totalAtivas}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-zinc-500">do total</p>
                <p className="text-sm font-medium text-emerald-400">
                  {((totalAtivas / empresasList.length) * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-900/50 border-zinc-800/50 hover:border-amber-500/30 transition-colors cursor-pointer"
              onClick={() => setStatusFilter("pendente")}>
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-zinc-400">Pendentes</p>
                <p className="text-2xl font-semibold text-zinc-100">{totalPendentes}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-zinc-500">aguardando</p>
                <p className="text-sm font-medium text-amber-400">aprovação</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-900/50 border-zinc-800/50 hover:border-red-500/30 transition-colors cursor-pointer"
              onClick={() => setStatusFilter("bloqueado")}>
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                <Ban className="w-6 h-6 text-red-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-zinc-400">Bloqueadas</p>
                <p className="text-2xl font-semibold text-zinc-100">{totalBloqueadas}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-zinc-500">requer</p>
                <p className="text-sm font-medium text-red-400">atenção</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="bg-zinc-900/50 border-zinc-800/50">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                placeholder="Buscar empresa ou cidade..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 bg-zinc-800/50 border-zinc-700/50 text-zinc-300 placeholder:text-zinc-500 text-sm focus-visible:ring-1 focus-visible:ring-orange-500/50"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[160px] h-9 bg-zinc-800/50 border-zinc-700/50 text-zinc-300 text-sm">
                <Filter className="w-4 h-4 mr-2 text-zinc-500" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="bloqueado">Bloqueado</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="h-9 bg-zinc-800/50 border-zinc-700/50 text-zinc-300">
              <ArrowUpDown className="w-4 h-4 mr-2" />
              Ordenar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="bg-zinc-900/50 border-zinc-800/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-medium text-zinc-100">
                Lista de Empresas
              </CardTitle>
              <p className="text-xs text-zinc-500 mt-0.5">
                {filteredEmpresas.length} empresas encontradas
              </p>
            </div>
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
                  <th className="text-left py-3 px-5 text-xs font-medium text-zinc-500 uppercase tracking-wider hidden md:table-cell">
                    Localização
                  </th>
                  <th className="text-left py-3 px-5 text-xs font-medium text-zinc-500 uppercase tracking-wider hidden lg:table-cell">
                    Plano
                  </th>
                  <th className="text-left py-3 px-5 text-xs font-medium text-zinc-500 uppercase tracking-wider hidden sm:table-cell">
                    Usuários
                  </th>
                  <th className="text-left py-3 px-5 text-xs font-medium text-zinc-500 uppercase tracking-wider hidden sm:table-cell">
                    Faturamento
                  </th>
                  <th className="text-left py-3 px-5 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-right py-3 px-5 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/30">
                {filteredEmpresas.map((empresa) => {
                  const StatusIcon = statusConfig[empresa.status].icon
                  return (
                    <tr 
                      key={empresa.id} 
                      className="group hover:bg-zinc-800/30 transition-colors"
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
                            <p className="text-xs text-zinc-500">{empresa.tipo}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 hidden md:table-cell">
                        <span className="text-sm text-zinc-400">
                          {empresa.cidade}, {empresa.estado}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 hidden lg:table-cell">
                        <Badge 
                          variant="outline" 
                          className={empresa.plano === "Premium" 
                            ? "bg-violet-500/10 text-violet-400 border-violet-500/20 text-xs"
                            : "bg-zinc-800 text-zinc-400 border-zinc-700 text-xs"
                          }
                        >
                          {empresa.plano}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-5 hidden sm:table-cell">
                        <div className="flex items-center gap-1.5 text-sm text-zinc-400">
                          <Users className="w-4 h-4 text-zinc-600" />
                          {empresa.usuarios}
                        </div>
                      </td>
                      <td className="py-3.5 px-5 hidden sm:table-cell">
                        <div className="flex items-center gap-1.5 text-sm font-medium text-zinc-200">
                          <DollarSign className="w-4 h-4 text-zinc-600" />
                          {formatCurrency(empresa.faturamento)}
                        </div>
                      </td>
                      <td className="py-3.5 px-5">
                        <Badge
                          variant="outline"
                          className={`text-xs font-medium ${statusConfig[empresa.status].color}`}
                        >
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig[empresa.status].label}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-zinc-500 hover:text-zinc-300"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 w-48">
                            <DropdownMenuItem className="text-zinc-300 focus:bg-zinc-800 focus:text-zinc-100">
                              <Eye className="w-4 h-4 mr-2" />
                              Ver detalhes
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-zinc-800" />
                            {empresa.status !== "ativo" && (
                              <DropdownMenuItem 
                                onClick={() => handleStatusChange(empresa.id, "ativo")}
                                className="text-emerald-400 focus:bg-emerald-500/10 focus:text-emerald-400"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Ativar empresa
                              </DropdownMenuItem>
                            )}
                            {empresa.status !== "bloqueado" && (
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(empresa.id, "bloqueado")}
                                className="text-red-400 focus:bg-red-500/10 focus:text-red-400"
                              >
                                <Ban className="w-4 h-4 mr-2" />
                                Bloquear empresa
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          
          {filteredEmpresas.length === 0 && (
            <div className="py-12 text-center">
              <Building2 className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-400 text-sm">Nenhuma empresa encontrada</p>
              <p className="text-zinc-600 text-xs mt-1">Tente ajustar os filtros de busca</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
