"use client"

import { useState, useEffect } from "react"
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Clock,
  DollarSign,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ordersService } from "@/lib/api/services/orders.service"
import { useAuth } from "@/lib/auth-context"

interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number
  category: string
  maxCapacity: number
  isActive: boolean
  bookings: number
}

const mockServices: Service[] = [
  {
    id: "1",
    name: "Musculacao",
    description: "Acesso a area de musculacao com equipamentos modernos",
    price: 0,
    duration: 60,
    category: "academia",
    maxCapacity: 50,
    isActive: true,
    bookings: 89,
  },
  {
    id: "2",
    name: "Personal Trainer",
    description: "Treino personalizado com acompanhamento individual",
    price: 150,
    duration: 60,
    category: "personal",
    maxCapacity: 1,
    isActive: true,
    bookings: 45,
  },
  {
    id: "3",
    name: "CrossFit",
    description: "Aulas de CrossFit em grupo com instrutor",
    price: 50,
    duration: 60,
    category: "aula",
    maxCapacity: 20,
    isActive: true,
    bookings: 34,
  },
  {
    id: "4",
    name: "Yoga",
    description: "Aulas de Yoga para relaxamento e flexibilidade",
    price: 40,
    duration: 60,
    category: "aula",
    maxCapacity: 15,
    isActive: false,
    bookings: 28,
  },
  {
    id: "5",
    name: "Spinning",
    description: "Aulas de spinning de alta intensidade",
    price: 35,
    duration: 45,
    category: "aula",
    maxCapacity: 25,
    isActive: true,
    bookings: 52,
  },
]

const categories = [
  { id: "academia", label: "Academia" },
  { id: "personal", label: "Personal" },
  { id: "aula", label: "Aula em Grupo" },
  { id: "avaliacao", label: "Avaliacao Fisica" },
  { id: "outro", label: "Outro" },
]

export default function ServicosPage() {
  const { user } = useAuth()
  const [services, setServices] = useState<Service[]>(mockServices)
  const [search, setSearch] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)

  useEffect(() => {
    async function loadServices() {
      try {
        const res = await ordersService.getPartnerOrders(user?.id || "")
        if (res.success && res.data) {
          // Os serviços serão substituídos quando a API estiver configurada
        }
      } catch (error) {
        console.error("Erro ao carregar serviços:", error)
      }
    }
    if (user?.id) loadServices()
  }, [user?.id])
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "60",
    category: "academia",
    maxCapacity: "1",
  })

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleOpenDialog = (service?: Service) => {
    if (service) {
      setEditingService(service)
      setFormData({
        name: service.name,
        description: service.description,
        price: service.price.toString(),
        duration: service.duration.toString(),
        category: service.category,
        maxCapacity: service.maxCapacity.toString(),
      })
    } else {
      setEditingService(null)
      setFormData({
        name: "",
        description: "",
        price: "",
        duration: "60",
        category: "academia",
        maxCapacity: "1",
      })
    }
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (editingService) {
      setServices(services.map(s => 
        s.id === editingService.id 
          ? { 
              ...s, 
              name: formData.name,
              description: formData.description,
              price: Number(formData.price) || 0,
              duration: Number(formData.duration),
              category: formData.category,
              maxCapacity: Number(formData.maxCapacity),
            }
          : s
      ))
    } else {
      const newService: Service = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        price: Number(formData.price) || 0,
        duration: Number(formData.duration),
        category: formData.category,
        maxCapacity: Number(formData.maxCapacity),
        isActive: true,
        bookings: 0,
      }
      setServices([...services, newService])
    }
    setIsDialogOpen(false)
  }

  const toggleServiceStatus = (id: string) => {
    setServices(services.map(s => 
      s.id === id ? { ...s, isActive: !s.isActive } : s
    ))
  }

  const deleteService = (id: string) => {
    setServices(services.filter(s => s.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Servicos</h1>
          <p className="text-muted-foreground">Gerencie os servicos oferecidos</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Servico
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingService ? "Editar Servico" : "Novo Servico"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do servico</Label>
                <Input
                  id="name"
                  placeholder="Ex: Musculacao, Personal Trainer..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descricao</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva o servico..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Preco (R$)</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duracao (min)</Label>
                  <Select
                    value={formData.duration}
                    onValueChange={(value) => setFormData({ ...formData, duration: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 min</SelectItem>
                      <SelectItem value="45">45 min</SelectItem>
                      <SelectItem value="60">1 hora</SelectItem>
                      <SelectItem value="90">1h30</SelectItem>
                      <SelectItem value="120">2 horas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxCapacity">Capacidade max.</Label>
                  <Input
                    id="maxCapacity"
                    type="number"
                    placeholder="1"
                    value={formData.maxCapacity}
                    onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="bg-transparent">
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                {editingService ? "Salvar" : "Criar Servico"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar servicos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Services Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredServices.map((service) => (
          <Card key={service.id} className={`bg-card border-border ${!service.isActive ? "opacity-60" : ""}`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{service.name}</h3>
                    {!service.isActive && (
                      <Badge variant="secondary" className="text-xs">Inativo</Badge>
                    )}
                  </div>
                  <Badge variant="outline" className="mt-2 text-xs">
                    {categories.find(c => c.id === service.category)?.label}
                  </Badge>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleOpenDialog(service)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleServiceStatus(service.id)}>
                      {service.isActive ? (
                        <>
                          <EyeOff className="mr-2 h-4 w-4" />
                          Desativar
                        </>
                      ) : (
                        <>
                          <Eye className="mr-2 h-4 w-4" />
                          Ativar
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => deleteService(service.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                {service.description}
              </p>

              <div className="mt-4 grid grid-cols-3 gap-2 pt-4 border-t border-border">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-sm font-medium text-foreground">
                    <DollarSign className="h-3 w-3" />
                    {service.price > 0 ? `R$ ${service.price}` : "Incluso"}
                  </div>
                  <p className="text-xs text-muted-foreground">Preco</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-sm font-medium text-foreground">
                    <Clock className="h-3 w-3" />
                    {service.duration}min
                  </div>
                  <p className="text-xs text-muted-foreground">Duracao</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-sm font-medium text-foreground">
                    <Users className="h-3 w-3" />
                    {service.maxCapacity}
                  </div>
                  <p className="text-xs text-muted-foreground">Vagas</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Reservas este mes:</span>
                <span className="font-medium text-foreground">{service.bookings}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum servico encontrado</p>
        </div>
      )}
    </div>
  )
}
