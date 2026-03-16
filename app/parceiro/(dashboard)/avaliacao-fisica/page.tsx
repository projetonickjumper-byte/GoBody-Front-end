"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  Search,
  Plus,
  MoreVertical,
  ClipboardList,
  User,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  Scale,
  Ruler,
  Activity,
  Heart,
  Eye,
  FileText,
  Download,
  ArrowLeft,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { assessmentsService } from "@/lib/api/services/assessments.service"
import { studentsService } from "@/lib/api/services/students.service"
import { useAuth } from "@/lib/auth-context"

interface PhysicalAssessment {
  id: string
  clientId: string
  clientName: string
  clientAvatar: string | null
  date: string
  measurements: {
    weight: number // kg
    height: number // cm
    bodyFat?: number // %
    muscleMass?: number // kg
    chest?: number // cm
    waist?: number // cm
    hips?: number // cm
    rightArm?: number // cm
    leftArm?: number // cm
    rightThigh?: number // cm
    leftThigh?: number // cm
    rightCalf?: number // cm
    leftCalf?: number // cm
  }
  vitals?: {
    heartRate?: number // bpm
    bloodPressure?: string // ex: "120/80"
  }
  notes: string
  imc: number
  imcClassification: string
}

const calculateIMC = (weight: number, height: number) => {
  const heightInMeters = height / 100
  return weight / (heightInMeters * heightInMeters)
}

const getIMCClassification = (imc: number) => {
  if (imc < 18.5) return "Abaixo do peso"
  if (imc < 25) return "Peso normal"
  if (imc < 30) return "Sobrepeso"
  if (imc < 35) return "Obesidade Grau I"
  if (imc < 40) return "Obesidade Grau II"
  return "Obesidade Grau III"
}

const mockAssessments: PhysicalAssessment[] = [
  {
    id: "a1",
    clientId: "c1",
    clientName: "Maria Santos",
    clientAvatar: null,
    date: "2024-01-15",
    measurements: {
      weight: 65,
      height: 165,
      bodyFat: 22,
      muscleMass: 28,
      chest: 92,
      waist: 72,
      hips: 98,
      rightArm: 28,
      leftArm: 27.5,
      rightThigh: 54,
      leftThigh: 53.5,
      rightCalf: 36,
      leftCalf: 35.5,
    },
    vitals: {
      heartRate: 68,
      bloodPressure: "120/80",
    },
    notes: "Aluna apresenta boa condição física geral. Foco em definição muscular.",
    imc: 23.88,
    imcClassification: "Peso normal",
  },
  {
    id: "a2",
    clientId: "c1",
    clientName: "Maria Santos",
    clientAvatar: null,
    date: "2023-12-01",
    measurements: {
      weight: 68,
      height: 165,
      bodyFat: 25,
      muscleMass: 26,
      chest: 94,
      waist: 76,
      hips: 100,
      rightArm: 29,
      leftArm: 28.5,
      rightThigh: 56,
      leftThigh: 55.5,
      rightCalf: 37,
      leftCalf: 36.5,
    },
    vitals: {
      heartRate: 72,
      bloodPressure: "125/82",
    },
    notes: "Início do acompanhamento. Objetivo: perda de gordura e ganho de massa muscular.",
    imc: 24.98,
    imcClassification: "Peso normal",
  },
  {
    id: "a3",
    clientId: "c2",
    clientName: "Pedro Lima",
    clientAvatar: null,
    date: "2024-01-10",
    measurements: {
      weight: 82,
      height: 178,
      bodyFat: 18,
      muscleMass: 38,
      chest: 102,
      waist: 84,
      hips: 98,
      rightArm: 36,
      leftArm: 35.5,
      rightThigh: 60,
      leftThigh: 59.5,
      rightCalf: 40,
      leftCalf: 39.5,
    },
    vitals: {
      heartRate: 62,
      bloodPressure: "118/76",
    },
    notes: "Excelente condição física. Foco em hipertrofia.",
    imc: 25.88,
    imcClassification: "Sobrepeso",
  },
  {
    id: "a4",
    clientId: "c4",
    clientName: "Lucas Oliveira",
    clientAvatar: null,
    date: "2024-01-05",
    measurements: {
      weight: 95,
      height: 175,
      bodyFat: 32,
      muscleMass: 32,
      chest: 110,
      waist: 102,
      hips: 108,
      rightArm: 34,
      leftArm: 33.5,
      rightThigh: 64,
      leftThigh: 63.5,
      rightCalf: 42,
      leftCalf: 41.5,
    },
    vitals: {
      heartRate: 78,
      bloodPressure: "135/88",
    },
    notes: "Primeira avaliação. Objetivo principal: emagrecimento. Atenção para pressão arterial.",
    imc: 31.02,
    imcClassification: "Obesidade Grau I",
  },
]

const mockClients = [
  { id: "c1", name: "Maria Santos", avatar: null },
  { id: "c2", name: "Pedro Lima", avatar: null },
  { id: "c3", name: "Ana Costa", avatar: null },
  { id: "c4", name: "Lucas Oliveira", avatar: null },
  { id: "c5", name: "Julia Ferreira", avatar: null },
]

function AvaliacaoFisicaContent() {
  const searchParams = useSearchParams()
  const { user } = useAuth()
  
  // Parâmetros vindos da página de pedidos (integração entre ecossistemas)
  const clientIdFromOrder = searchParams.get("clientId")
  const clientNameFromOrder = searchParams.get("clientName")
  const orderIdFromOrder = searchParams.get("orderId")
  
  const [assessments, setAssessments] = useState<PhysicalAssessment[]>(mockAssessments)
  const [allClients, setAllClients] = useState(mockClients)

  // Carregar dados da API
  useEffect(() => {
    async function loadData() {
      if (!user?.id) return
      try {
        const [assessRes, clientsRes] = await Promise.all([
          assessmentsService.getByTrainer(user.id),
          studentsService.getByTrainer(user.id),
        ])
        if (assessRes.success && assessRes.data && assessRes.data.length > 0) {
          const mapped: PhysicalAssessment[] = assessRes.data.map((a: any) => ({
            id: a.id,
            clientId: a.studentId,
            clientName: a.studentName,
            clientAvatar: null,
            date: a.date || a.createdAt,
            measurements: a.measurements || {},
            vitalSigns: a.vitalSigns || {},
            observations: a.observations || "",
          }))
          setAssessments(mapped)
        }
        if (clientsRes.success && clientsRes.data && clientsRes.data.length > 0) {
          setAllClients(clientsRes.data.map((c: any) => ({
            id: c.id,
            name: c.name,
            avatar: c.avatar || null,
          })))
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
      }
    }
    loadData()
  }, [user?.id])
  const [search, setSearch] = useState("")
  const [clientFilter, setClientFilter] = useState("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedAssessment, setSelectedAssessment] = useState<PhysicalAssessment | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [showOrderLinkedSuccess, setShowOrderLinkedSuccess] = useState(false)

  // Se veio de um pedido, abre o modal de criação automaticamente
  useEffect(() => {
    if (clientIdFromOrder && clientNameFromOrder) {
      setIsCreateModalOpen(true)
      // Pré-seleciona o cliente se veio de um pedido
      setNewAssessment(prev => ({ ...prev, clientId: clientIdFromOrder }))
    }
  }, [clientIdFromOrder, clientNameFromOrder])

  // Form state for new assessment
  const [newAssessment, setNewAssessment] = useState({
    clientId: clientIdFromOrder || "",
    measurements: {
      weight: 0,
      height: 0,
      bodyFat: 0,
      muscleMass: 0,
      chest: 0,
      waist: 0,
      hips: 0,
      rightArm: 0,
      leftArm: 0,
      rightThigh: 0,
      leftThigh: 0,
      rightCalf: 0,
      leftCalf: 0,
    },
    vitals: {
      heartRate: 0,
      bloodPressure: "",
    },
    notes: "",
  })

  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = assessment.clientName.toLowerCase().includes(search.toLowerCase())
    const matchesClient = clientFilter === "all" || assessment.clientId === clientFilter
    return matchesSearch && matchesClient
  })

  // Group assessments by client for comparison
  const assessmentsByClient = assessments.reduce((acc, assessment) => {
    if (!acc[assessment.clientId]) {
      acc[assessment.clientId] = []
    }
    acc[assessment.clientId].push(assessment)
    return acc
  }, {} as Record<string, PhysicalAssessment[]>)

  const getIMCBadge = (classification: string) => {
    const colors: Record<string, string> = {
      "Abaixo do peso": "bg-yellow-500/20 text-yellow-500",
      "Peso normal": "bg-green-500/20 text-green-500",
      "Sobrepeso": "bg-orange-500/20 text-orange-500",
      "Obesidade Grau I": "bg-red-500/20 text-red-500",
      "Obesidade Grau II": "bg-red-600/20 text-red-600",
      "Obesidade Grau III": "bg-red-700/20 text-red-700",
    }
    return <Badge className={colors[classification]}>{classification}</Badge>
  }

  const getTrend = (current: number, previous: number) => {
    const diff = current - previous
    if (Math.abs(diff) < 0.1) return { icon: Minus, color: "text-muted-foreground", value: "0" }
    if (diff > 0) return { icon: TrendingUp, color: "text-green-500", value: `+${diff.toFixed(1)}` }
    return { icon: TrendingDown, color: "text-red-500", value: diff.toFixed(1) }
  }

  const createAssessment = () => {
    // Se veio de um pedido, usa o nome do cliente do pedido
    let client = allClients.find(c => c.id === newAssessment.clientId)
    
    // Se o cliente não existe no mock mas veio de um pedido, cria um temporário
    if (!client && clientIdFromOrder && clientNameFromOrder) {
      client = { id: clientIdFromOrder, name: clientNameFromOrder, avatar: null }
    }
    
    if (!client) return

    const imc = calculateIMC(newAssessment.measurements.weight, newAssessment.measurements.height)
    const assessment: PhysicalAssessment = {
      id: `a-${Date.now()}`,
      clientId: client.id,
      clientName: client.name,
      clientAvatar: client.avatar,
      date: new Date().toISOString().split("T")[0],
      measurements: newAssessment.measurements,
      vitals: newAssessment.vitals,
      notes: newAssessment.notes,
      imc: parseFloat(imc.toFixed(2)),
      imcClassification: getIMCClassification(imc),
    }
    setAssessments(prev => [assessment, ...prev])
    setIsCreateModalOpen(false)
    
    // Se veio de um pedido, mostra mensagem de sucesso
    if (orderIdFromOrder) {
      setShowOrderLinkedSuccess(true)
      setTimeout(() => setShowOrderLinkedSuccess(false), 5000)
    }
    
    setNewAssessment({
      clientId: "",
      measurements: {
        weight: 0, height: 0, bodyFat: 0, muscleMass: 0,
        chest: 0, waist: 0, hips: 0, rightArm: 0, leftArm: 0,
        rightThigh: 0, leftThigh: 0, rightCalf: 0, leftCalf: 0,
      },
      vitals: { heartRate: 0, bloodPressure: "" },
      notes: "",
    })
  }

  const uniqueClients = [...new Set(assessments.map(a => a.clientId))].map(id => {
    const assessment = assessments.find(a => a.clientId === id)
    return { id, name: assessment?.clientName || "" }
  })

  return (
    <div className="space-y-6">
      {/* Banner de contexto quando vem de um pedido */}
      {clientIdFromOrder && clientNameFromOrder && (
        <Alert className="border-primary/50 bg-primary/5">
          <User className="h-4 w-4" />
          <AlertTitle className="flex items-center gap-2">
            Realizando avaliação para cliente
            {orderIdFromOrder && (
              <Badge variant="outline" className="text-xs">
                <LinkIcon className="mr-1 h-3 w-3" />
                Pedido vinculado
              </Badge>
            )}
          </AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>
              Você está realizando uma avaliação física para <strong>{clientNameFromOrder}</strong>.
              A avaliação será vinculada automaticamente ao cliente.
            </span>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/parceiro/pedidos">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar aos pedidos
              </Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Mensagem de sucesso ao vincular */}
      {showOrderLinkedSuccess && (
        <Alert className="border-green-500/50 bg-green-500/5">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertTitle>Avaliação registrada com sucesso!</AlertTitle>
          <AlertDescription>
            A avaliação física foi vinculada automaticamente ao cliente {clientNameFromOrder}.
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Avaliação Física</h1>
          <p className="text-muted-foreground">Registre e acompanhe a evolução física dos seus alunos</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Avaliação
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nova Avaliação Física</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="basic" className="py-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Dados Básicos</TabsTrigger>
                <TabsTrigger value="measurements">Medidas</TabsTrigger>
                <TabsTrigger value="vitals">Sinais Vitais</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Aluno</Label>
                  <Select
                    value={newAssessment.clientId}
                    onValueChange={(v) => setNewAssessment(prev => ({ ...prev, clientId: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um aluno" />
                    </SelectTrigger>
                    <SelectContent>
                      {allClients.map(client => (
                        <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Peso (kg)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={newAssessment.measurements.weight || ""}
                      onChange={(e) => setNewAssessment(prev => ({
                        ...prev,
                        measurements: { ...prev.measurements, weight: parseFloat(e.target.value) || 0 }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Altura (cm)</Label>
                    <Input
                      type="number"
                      value={newAssessment.measurements.height || ""}
                      onChange={(e) => setNewAssessment(prev => ({
                        ...prev,
                        measurements: { ...prev.measurements, height: parseFloat(e.target.value) || 0 }
                      }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Gordura Corporal (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={newAssessment.measurements.bodyFat || ""}
                      onChange={(e) => setNewAssessment(prev => ({
                        ...prev,
                        measurements: { ...prev.measurements, bodyFat: parseFloat(e.target.value) || 0 }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Massa Muscular (kg)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={newAssessment.measurements.muscleMass || ""}
                      onChange={(e) => setNewAssessment(prev => ({
                        ...prev,
                        measurements: { ...prev.measurements, muscleMass: parseFloat(e.target.value) || 0 }
                      }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Observações</Label>
                  <Textarea
                    value={newAssessment.notes}
                    onChange={(e) => setNewAssessment(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Observações sobre a avaliação..."
                  />
                </div>
              </TabsContent>

              <TabsContent value="measurements" className="space-y-4 mt-4">
                <p className="text-sm text-muted-foreground">Todas as medidas em centímetros (cm)</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Peitoral</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={newAssessment.measurements.chest || ""}
                      onChange={(e) => setNewAssessment(prev => ({
                        ...prev,
                        measurements: { ...prev.measurements, chest: parseFloat(e.target.value) || 0 }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Cintura</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={newAssessment.measurements.waist || ""}
                      onChange={(e) => setNewAssessment(prev => ({
                        ...prev,
                        measurements: { ...prev.measurements, waist: parseFloat(e.target.value) || 0 }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Quadril</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={newAssessment.measurements.hips || ""}
                      onChange={(e) => setNewAssessment(prev => ({
                        ...prev,
                        measurements: { ...prev.measurements, hips: parseFloat(e.target.value) || 0 }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Braço Direito</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={newAssessment.measurements.rightArm || ""}
                      onChange={(e) => setNewAssessment(prev => ({
                        ...prev,
                        measurements: { ...prev.measurements, rightArm: parseFloat(e.target.value) || 0 }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Braço Esquerdo</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={newAssessment.measurements.leftArm || ""}
                      onChange={(e) => setNewAssessment(prev => ({
                        ...prev,
                        measurements: { ...prev.measurements, leftArm: parseFloat(e.target.value) || 0 }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Coxa Direita</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={newAssessment.measurements.rightThigh || ""}
                      onChange={(e) => setNewAssessment(prev => ({
                        ...prev,
                        measurements: { ...prev.measurements, rightThigh: parseFloat(e.target.value) || 0 }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Coxa Esquerda</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={newAssessment.measurements.leftThigh || ""}
                      onChange={(e) => setNewAssessment(prev => ({
                        ...prev,
                        measurements: { ...prev.measurements, leftThigh: parseFloat(e.target.value) || 0 }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Panturrilha Direita</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={newAssessment.measurements.rightCalf || ""}
                      onChange={(e) => setNewAssessment(prev => ({
                        ...prev,
                        measurements: { ...prev.measurements, rightCalf: parseFloat(e.target.value) || 0 }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Panturrilha Esquerda</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={newAssessment.measurements.leftCalf || ""}
                      onChange={(e) => setNewAssessment(prev => ({
                        ...prev,
                        measurements: { ...prev.measurements, leftCalf: parseFloat(e.target.value) || 0 }
                      }))}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="vitals" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Frequência Cardíaca (bpm)</Label>
                    <Input
                      type="number"
                      value={newAssessment.vitals.heartRate || ""}
                      onChange={(e) => setNewAssessment(prev => ({
                        ...prev,
                        vitals: { ...prev.vitals, heartRate: parseInt(e.target.value) || 0 }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Pressão Arterial</Label>
                    <Input
                      placeholder="Ex: 120/80"
                      value={newAssessment.vitals.bloodPressure}
                      onChange={(e) => setNewAssessment(prev => ({
                        ...prev,
                        vitals: { ...prev.vitals, bloodPressure: e.target.value }
                      }))}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button
                onClick={createAssessment}
                disabled={!newAssessment.clientId || !newAssessment.measurements.weight || !newAssessment.measurements.height}
              >
                Salvar Avaliação
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <ClipboardList className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{assessments.length}</p>
                <p className="text-sm text-muted-foreground">Avaliações</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <User className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{uniqueClients.length}</p>
                <p className="text-sm text-muted-foreground">Alunos avaliados</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <Calendar className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {assessments.filter(a => {
                    const date = new Date(a.date)
                    const now = new Date()
                    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
                  }).length}
                </p>
                <p className="text-sm text-muted-foreground">Este mês</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                <Activity className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {(assessments.reduce((acc, a) => acc + a.imc, 0) / assessments.length).toFixed(1)}
                </p>
                <p className="text-sm text-muted-foreground">IMC médio</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar alunos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={clientFilter} onValueChange={setClientFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por aluno" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os alunos</SelectItem>
            {uniqueClients.map(client => (
              <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Assessments List */}
      <div className="space-y-4">
        {filteredAssessments.map((assessment) => {
          // Get previous assessment for comparison
          const clientAssessments = assessmentsByClient[assessment.clientId]?.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          const currentIndex = clientAssessments?.findIndex(a => a.id === assessment.id) || 0
          const previousAssessment = clientAssessments?.[currentIndex + 1]

          return (
            <Card key={assessment.id} className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Client Info */}
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={assessment.clientAvatar || undefined} />
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {assessment.clientName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-foreground">{assessment.clientName}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(assessment.date).toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-8">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Scale className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold text-foreground">{assessment.measurements.weight} kg</span>
                        {previousAssessment && (
                          <span className={`text-xs ${getTrend(assessment.measurements.weight, previousAssessment.measurements.weight).color}`}>
                            {getTrend(assessment.measurements.weight, previousAssessment.measurements.weight).value}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">Peso</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Activity className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold text-foreground">{assessment.imc.toFixed(1)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">IMC</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="font-semibold text-foreground">{assessment.measurements.bodyFat || "-"}%</span>
                        {previousAssessment?.measurements.bodyFat && assessment.measurements.bodyFat && (
                          <span className={`text-xs ${getTrend(assessment.measurements.bodyFat, previousAssessment.measurements.bodyFat).color}`}>
                            {getTrend(assessment.measurements.bodyFat, previousAssessment.measurements.bodyFat).value}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">Gordura</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="font-semibold text-foreground">{assessment.measurements.muscleMass || "-"} kg</span>
                        {previousAssessment?.measurements.muscleMass && assessment.measurements.muscleMass && (
                          <span className={`text-xs ${getTrend(assessment.measurements.muscleMass, previousAssessment.measurements.muscleMass).color}`}>
                            {getTrend(assessment.measurements.muscleMass, previousAssessment.measurements.muscleMass).value}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">Massa Muscular</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {getIMCBadge(assessment.imcClassification)}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedAssessment(assessment)
                        setIsViewModalOpen(true)
                      }}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Detalhes
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          Gerar relatório
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Exportar PDF
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredAssessments.length === 0 && (
        <div className="text-center py-12">
          <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Nenhuma avaliação encontrada</p>
          <Button className="mt-4" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Realizar primeira avaliação
          </Button>
        </div>
      )}

      {/* View Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedAssessment && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedAssessment.clientAvatar || undefined} />
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {selectedAssessment.clientName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p>{selectedAssessment.clientName}</p>
                    <p className="text-sm font-normal text-muted-foreground">
                      Avaliação de {new Date(selectedAssessment.date).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                {/* Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <Card className="bg-secondary/50">
                    <CardContent className="p-4 text-center">
                      <Scale className="h-5 w-5 mx-auto text-primary mb-1" />
                      <p className="text-xl font-bold text-foreground">{selectedAssessment.measurements.weight} kg</p>
                      <p className="text-xs text-muted-foreground">Peso</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-secondary/50">
                    <CardContent className="p-4 text-center">
                      <Ruler className="h-5 w-5 mx-auto text-primary mb-1" />
                      <p className="text-xl font-bold text-foreground">{selectedAssessment.measurements.height} cm</p>
                      <p className="text-xs text-muted-foreground">Altura</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-secondary/50">
                    <CardContent className="p-4 text-center">
                      <Activity className="h-5 w-5 mx-auto text-primary mb-1" />
                      <p className="text-xl font-bold text-foreground">{selectedAssessment.imc.toFixed(1)}</p>
                      <p className="text-xs text-muted-foreground">IMC</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-secondary/50">
                    <CardContent className="p-4 text-center">
                      <Heart className="h-5 w-5 mx-auto text-primary mb-1" />
                      <p className="text-xl font-bold text-foreground">{selectedAssessment.vitals?.heartRate || "-"}</p>
                      <p className="text-xs text-muted-foreground">FC (bpm)</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Classification */}
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm text-muted-foreground">Classificação IMC:</span>
                  {getIMCBadge(selectedAssessment.imcClassification)}
                </div>

                {/* Measurements */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Medidas Corporais (cm)</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {selectedAssessment.measurements.chest && (
                      <div className="flex justify-between p-2 rounded bg-secondary/30">
                        <span className="text-muted-foreground">Peitoral</span>
                        <span className="font-medium text-foreground">{selectedAssessment.measurements.chest}</span>
                      </div>
                    )}
                    {selectedAssessment.measurements.waist && (
                      <div className="flex justify-between p-2 rounded bg-secondary/30">
                        <span className="text-muted-foreground">Cintura</span>
                        <span className="font-medium text-foreground">{selectedAssessment.measurements.waist}</span>
                      </div>
                    )}
                    {selectedAssessment.measurements.hips && (
                      <div className="flex justify-between p-2 rounded bg-secondary/30">
                        <span className="text-muted-foreground">Quadril</span>
                        <span className="font-medium text-foreground">{selectedAssessment.measurements.hips}</span>
                      </div>
                    )}
                    {selectedAssessment.measurements.rightArm && (
                      <div className="flex justify-between p-2 rounded bg-secondary/30">
                        <span className="text-muted-foreground">Braço D</span>
                        <span className="font-medium text-foreground">{selectedAssessment.measurements.rightArm}</span>
                      </div>
                    )}
                    {selectedAssessment.measurements.leftArm && (
                      <div className="flex justify-between p-2 rounded bg-secondary/30">
                        <span className="text-muted-foreground">Braço E</span>
                        <span className="font-medium text-foreground">{selectedAssessment.measurements.leftArm}</span>
                      </div>
                    )}
                    {selectedAssessment.measurements.rightThigh && (
                      <div className="flex justify-between p-2 rounded bg-secondary/30">
                        <span className="text-muted-foreground">Coxa D</span>
                        <span className="font-medium text-foreground">{selectedAssessment.measurements.rightThigh}</span>
                      </div>
                    )}
                    {selectedAssessment.measurements.leftThigh && (
                      <div className="flex justify-between p-2 rounded bg-secondary/30">
                        <span className="text-muted-foreground">Coxa E</span>
                        <span className="font-medium text-foreground">{selectedAssessment.measurements.leftThigh}</span>
                      </div>
                    )}
                    {selectedAssessment.measurements.rightCalf && (
                      <div className="flex justify-between p-2 rounded bg-secondary/30">
                        <span className="text-muted-foreground">Panturrilha D</span>
                        <span className="font-medium text-foreground">{selectedAssessment.measurements.rightCalf}</span>
                      </div>
                    )}
                    {selectedAssessment.measurements.leftCalf && (
                      <div className="flex justify-between p-2 rounded bg-secondary/30">
                        <span className="text-muted-foreground">Panturrilha E</span>
                        <span className="font-medium text-foreground">{selectedAssessment.measurements.leftCalf}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Composition */}
                {(selectedAssessment.measurements.bodyFat || selectedAssessment.measurements.muscleMass) && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Composição Corporal</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedAssessment.measurements.bodyFat && (
                        <div className="flex justify-between p-3 rounded bg-secondary/30">
                          <span className="text-muted-foreground">Gordura Corporal</span>
                          <span className="font-medium text-foreground">{selectedAssessment.measurements.bodyFat}%</span>
                        </div>
                      )}
                      {selectedAssessment.measurements.muscleMass && (
                        <div className="flex justify-between p-3 rounded bg-secondary/30">
                          <span className="text-muted-foreground">Massa Muscular</span>
                          <span className="font-medium text-foreground">{selectedAssessment.measurements.muscleMass} kg</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Vitals */}
                {selectedAssessment.vitals && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Sinais Vitais</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedAssessment.vitals.heartRate && (
                        <div className="flex justify-between p-3 rounded bg-secondary/30">
                          <span className="text-muted-foreground">Freq. Cardíaca</span>
                          <span className="font-medium text-foreground">{selectedAssessment.vitals.heartRate} bpm</span>
                        </div>
                      )}
                      {selectedAssessment.vitals.bloodPressure && (
                        <div className="flex justify-between p-3 rounded bg-secondary/30">
                          <span className="text-muted-foreground">Pressão Arterial</span>
                          <span className="font-medium text-foreground">{selectedAssessment.vitals.bloodPressure} mmHg</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selectedAssessment.notes && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Observações</h4>
                    <p className="text-muted-foreground bg-secondary/30 p-3 rounded">{selectedAssessment.notes}</p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>Fechar</Button>
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Exportar PDF
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Export default com Suspense para lidar com useSearchParams
export default function AvaliacaoFisicaPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    }>
      <AvaliacaoFisicaContent />
    </Suspense>
  )
}
