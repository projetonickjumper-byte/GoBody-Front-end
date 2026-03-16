"use client"

import { useState, useEffect } from "react"
import {
  Search,
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  Star,
  Filter,
  UserPlus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { studentsService } from "@/lib/api/services/students.service"
import { useAuth } from "@/lib/auth-context"

interface Client {
  id: string
  name: string
  email: string
  phone: string
  avatar: string | null
  plan: string
  status: "active" | "inactive" | "pending"
  joinDate: string
  lastVisit: string
  totalVisits: number
  totalSpent: number
}

const mockClients: Client[] = [
  {
    id: "1",
    name: "Maria Santos",
    email: "maria@email.com",
    phone: "(11) 99999-1111",
    avatar: null,
    plan: "Premium",
    status: "active",
    joinDate: "2023-06-15",
    lastVisit: "2024-01-15",
    totalVisits: 89,
    totalSpent: 2450,
  },
  {
    id: "2",
    name: "Pedro Lima",
    email: "pedro@email.com",
    phone: "(11) 99999-2222",
    avatar: null,
    plan: "Basico",
    status: "active",
    joinDate: "2023-09-20",
    lastVisit: "2024-01-14",
    totalVisits: 45,
    totalSpent: 890,
  },
  {
    id: "3",
    name: "Ana Costa",
    email: "ana@email.com",
    phone: "(11) 99999-3333",
    avatar: null,
    plan: "Premium",
    status: "inactive",
    joinDate: "2023-03-10",
    lastVisit: "2023-12-20",
    totalVisits: 120,
    totalSpent: 3200,
  },
  {
    id: "4",
    name: "Lucas Oliveira",
    email: "lucas@email.com",
    phone: "(11) 99999-4444",
    avatar: null,
    plan: "Mensal",
    status: "active",
    joinDate: "2024-01-05",
    lastVisit: "2024-01-15",
    totalVisits: 8,
    totalSpent: 150,
  },
  {
    id: "5",
    name: "Julia Ferreira",
    email: "julia@email.com",
    phone: "(11) 99999-5555",
    avatar: null,
    plan: "Premium",
    status: "pending",
    joinDate: "2024-01-10",
    lastVisit: "2024-01-12",
    totalVisits: 3,
    totalSpent: 0,
  },
]

export default function ClientesPage() {
  const { user } = useAuth()
  const [clients, setClients] = useState<Client[]>(mockClients)

  useEffect(() => {
    async function loadClients() {
      if (!user?.id) return
      try {
        const res = await studentsService.getByTrainer(user.id)
        if (res.success && res.data && res.data.length > 0) {
          const mapped: Client[] = res.data.map((c: any) => ({
            id: c.id,
            name: c.name,
            email: c.email,
            phone: c.phone || "",
            avatar: c.avatar || null,
            status: c.status || "active",
            plan: "Personalizado",
            startDate: c.startDate || c.createdAt,
            nextAssessment: c.lastAssessment || null,
            objectives: c.objectives || [],
            rating: 5,
          }))
          setClients(mapped)
        }
      } catch (error) {
        console.error("Erro ao carregar clientes:", error)
      }
    }
    loadClients()
  }, [user?.id])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [planFilter, setPlanFilter] = useState("all")

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(search.toLowerCase()) ||
      client.email.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || client.status === statusFilter
    const matchesPlan = planFilter === "all" || client.plan === planFilter
    return matchesSearch && matchesStatus && matchesPlan
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/20 text-green-500">Ativo</Badge>
      case "inactive":
        return <Badge className="bg-red-500/20 text-red-500">Inativo</Badge>
      case "pending":
        return <Badge className="bg-yellow-500/20 text-yellow-500">Pendente</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const activeClients = clients.filter(c => c.status === "active").length
  const newClientsThisMonth = clients.filter(c => {
    const joinDate = new Date(c.joinDate)
    const now = new Date()
    return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear()
  }).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clientes</h1>
          <p className="text-muted-foreground">Gerencie seus clientes</p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <p className="text-3xl font-bold text-foreground">{clients.length}</p>
            <p className="text-sm text-muted-foreground">Total de clientes</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <p className="text-3xl font-bold text-foreground">{activeClients}</p>
            <p className="text-sm text-muted-foreground">Clientes ativos</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <p className="text-3xl font-bold text-foreground">{newClientsThisMonth}</p>
            <p className="text-sm text-muted-foreground">Novos este mes</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="inactive">Inativos</SelectItem>
            <SelectItem value="pending">Pendentes</SelectItem>
          </SelectContent>
        </Select>
        <Select value={planFilter} onValueChange={setPlanFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Plano" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="Premium">Premium</SelectItem>
            <SelectItem value="Basico">Basico</SelectItem>
            <SelectItem value="Mensal">Mensal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Clients Table */}
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead>Cliente</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Visitas</TableHead>
                  <TableHead>Ultima Visita</TableHead>
                  <TableHead className="text-right">Acoes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id} className="border-border">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={client.avatar || undefined} />
                          <AvatarFallback className="bg-primary/20 text-primary">
                            {client.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{client.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Cliente desde {new Date(client.joinDate).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {client.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {client.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{client.plan}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(client.status)}</TableCell>
                    <TableCell>
                      <span className="font-medium text-foreground">{client.totalVisits}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground">
                        {new Date(client.lastVisit).toLocaleDateString("pt-BR")}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                          <DropdownMenuItem>Enviar mensagem</DropdownMenuItem>
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum cliente encontrado</p>
        </div>
      )}
    </div>
  )
}
