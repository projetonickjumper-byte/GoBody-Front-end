"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import {
  Search,
  Plus,
  MoreVertical,
  Dumbbell,
  Clock,
  Target,
  Users,
  Copy,
  Edit,
  Trash2,
  Eye,
  Calendar,
  ChevronDown,
  ChevronUp,
  X,
  AlertCircle,
  CheckCircle2,
  User,
  ArrowLeft,
  Link as LinkIcon,
} from "lucide-react"
import Link from "next/link"
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
import { workoutsService } from "@/lib/api/services/workouts.service"
import { studentsService } from "@/lib/api/services/students.service"
import { useAuth } from "@/lib/auth-context"

interface Exercise {
  id: string
  name: string
  sets: number
  reps: string
  rest: string
  notes?: string
}

interface Workout {
  id: string
  name: string
  description: string
  objective: "hipertrofia" | "emagrecimento" | "resistencia" | "forca" | "flexibilidade"
  level: "iniciante" | "intermediario" | "avancado"
  duration: string
  exercises: Exercise[]
  assignedTo: { id: string; name: string; avatar: string | null }[]
  createdAt: string
  updatedAt: string
}

const mockWorkouts: Workout[] = [
  {
    id: "1",
    name: "Treino A - Peito e Tríceps",
    description: "Treino focado em hipertrofia de peito e tríceps",
    objective: "hipertrofia",
    level: "intermediario",
    duration: "60 min",
    exercises: [
      { id: "e1", name: "Supino Reto", sets: 4, reps: "8-12", rest: "90s", notes: "Controle na descida" },
      { id: "e2", name: "Supino Inclinado Halteres", sets: 3, reps: "10-12", rest: "60s" },
      { id: "e3", name: "Crucifixo", sets: 3, reps: "12-15", rest: "60s" },
      { id: "e4", name: "Tríceps Corda", sets: 3, reps: "12-15", rest: "45s" },
      { id: "e5", name: "Tríceps Francês", sets: 3, reps: "10-12", rest: "45s" },
    ],
    assignedTo: [
      { id: "c1", name: "Maria Santos", avatar: null },
      { id: "c2", name: "Pedro Lima", avatar: null },
    ],
    createdAt: "2024-01-10",
    updatedAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Treino B - Costas e Bíceps",
    description: "Treino focado em desenvolvimento de costas e bíceps",
    objective: "hipertrofia",
    level: "intermediario",
    duration: "55 min",
    exercises: [
      { id: "e6", name: "Puxada Frontal", sets: 4, reps: "8-12", rest: "90s" },
      { id: "e7", name: "Remada Curvada", sets: 4, reps: "8-10", rest: "90s" },
      { id: "e8", name: "Remada Unilateral", sets: 3, reps: "10-12", rest: "60s" },
      { id: "e9", name: "Rosca Direta", sets: 3, reps: "10-12", rest: "45s" },
      { id: "e10", name: "Rosca Martelo", sets: 3, reps: "12-15", rest: "45s" },
    ],
    assignedTo: [
      { id: "c1", name: "Maria Santos", avatar: null },
      { id: "c3", name: "Ana Costa", avatar: null },
    ],
    createdAt: "2024-01-10",
    updatedAt: "2024-01-14",
  },
  {
    id: "3",
    name: "Treino HIIT - Queima de Gordura",
    description: "Treino intervalado de alta intensidade para emagrecimento",
    objective: "emagrecimento",
    level: "avancado",
    duration: "30 min",
    exercises: [
      { id: "e11", name: "Burpees", sets: 4, reps: "30s", rest: "15s" },
      { id: "e12", name: "Mountain Climbers", sets: 4, reps: "30s", rest: "15s" },
      { id: "e13", name: "Jump Squats", sets: 4, reps: "30s", rest: "15s" },
      { id: "e14", name: "Polichinelos", sets: 4, reps: "30s", rest: "15s" },
    ],
    assignedTo: [
      { id: "c4", name: "Lucas Oliveira", avatar: null },
    ],
    createdAt: "2024-01-12",
    updatedAt: "2024-01-12",
  },
  {
    id: "4",
    name: "Treino Funcional - Iniciantes",
    description: "Treino funcional completo para quem está começando",
    objective: "resistencia",
    level: "iniciante",
    duration: "45 min",
    exercises: [
      { id: "e15", name: "Agachamento Livre", sets: 3, reps: "15", rest: "60s" },
      { id: "e16", name: "Prancha", sets: 3, reps: "30s", rest: "30s" },
      { id: "e17", name: "Flexão de Braço (joelho)", sets: 3, reps: "10-12", rest: "45s" },
      { id: "e18", name: "Afundo", sets: 3, reps: "12 cada", rest: "45s" },
    ],
    assignedTo: [
      { id: "c5", name: "Julia Ferreira", avatar: null },
    ],
    createdAt: "2024-01-14",
    updatedAt: "2024-01-14",
  },
]

const mockClients = [
  { id: "c1", name: "Maria Santos", avatar: null },
  { id: "c2", name: "Pedro Lima", avatar: null },
  { id: "c3", name: "Ana Costa", avatar: null },
  { id: "c4", name: "Lucas Oliveira", avatar: null },
  { id: "c5", name: "Julia Ferreira", avatar: null },
]

const exerciseLibrary = [
  { name: "Supino Reto", category: "Peito" },
  { name: "Supino Inclinado", category: "Peito" },
  { name: "Crucifixo", category: "Peito" },
  { name: "Puxada Frontal", category: "Costas" },
  { name: "Remada Curvada", category: "Costas" },
  { name: "Remada Unilateral", category: "Costas" },
  { name: "Rosca Direta", category: "Bíceps" },
  { name: "Rosca Martelo", category: "Bíceps" },
  { name: "Tríceps Corda", category: "Tríceps" },
  { name: "Tríceps Francês", category: "Tríceps" },
  { name: "Agachamento Livre", category: "Pernas" },
  { name: "Leg Press", category: "Pernas" },
  { name: "Cadeira Extensora", category: "Pernas" },
  { name: "Mesa Flexora", category: "Pernas" },
  { name: "Elevação Lateral", category: "Ombros" },
  { name: "Desenvolvimento", category: "Ombros" },
  { name: "Prancha", category: "Core" },
  { name: "Abdominal", category: "Core" },
]

function TreinosContent() {
  const searchParams = useSearchParams()
  const { user } = useAuth()
  
  // Parâmetros vindos da página de pedidos (integração entre ecossistemas)
  const clientIdFromOrder = searchParams.get("clientId")
  const clientNameFromOrder = searchParams.get("clientName")
  const orderIdFromOrder = searchParams.get("orderId")
  
  const [workouts, setWorkouts] = useState<Workout[]>(mockWorkouts)
  const [clients, setClients] = useState(mockClients)

  // Carregar treinos e clientes da API
  useEffect(() => {
    async function loadData() {
      if (!user?.id) return
      try {
        const [workoutsRes, clientsRes] = await Promise.all([
          workoutsService.getByTrainer(user.id),
          studentsService.getByTrainer(user.id),
        ])
        if (workoutsRes.success && workoutsRes.data && workoutsRes.data.length > 0) {
          const mapped: Workout[] = workoutsRes.data.map((w: any) => ({
            id: w.id,
            name: w.name,
            description: w.description || "",
            objective: w.objective || "hipertrofia",
            level: w.level || "intermediario",
            duration: w.duration || "60 min",
            exercises: (w.exercises || []).map((e: any) => ({
              id: e.id,
              name: e.name,
              sets: e.sets,
              reps: e.reps,
              rest: e.rest,
              notes: e.notes,
            })),
            assignedTo: (w.assignedStudents || []).map((s: any) => ({
              id: typeof s === "string" ? s : s.id,
              name: typeof s === "string" ? "Aluno" : s.name,
              avatar: null,
            })),
            createdAt: w.createdAt,
            updatedAt: w.updatedAt,
          }))
          setWorkouts(mapped)
        }
        if (clientsRes.success && clientsRes.data && clientsRes.data.length > 0) {
          setClients(clientsRes.data.map((c: any) => ({
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
  const [objectiveFilter, setObjectiveFilter] = useState("all")
  const [levelFilter, setLevelFilter] = useState("all")
  const [expandedWorkout, setExpandedWorkout] = useState<string | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null)
  const [showOrderLinkedSuccess, setShowOrderLinkedSuccess] = useState(false)
  
  // Se veio de um pedido, abre o modal de criação automaticamente
  useEffect(() => {
    if (clientIdFromOrder && clientNameFromOrder) {
      setIsCreateModalOpen(true)
    }
  }, [clientIdFromOrder, clientNameFromOrder])
  
  // Form state for new workout
  const [newWorkout, setNewWorkout] = useState({
    name: "",
    description: "",
    objective: "hipertrofia" as Workout["objective"],
    level: "intermediario" as Workout["level"],
    duration: "60 min",
    exercises: [] as Exercise[],
  })
  const [newExercise, setNewExercise] = useState({
    name: "",
    sets: 3,
    reps: "10-12",
    rest: "60s",
    notes: "",
  })

  const filteredWorkouts = workouts.filter(workout => {
    const matchesSearch = workout.name.toLowerCase().includes(search.toLowerCase())
    const matchesObjective = objectiveFilter === "all" || workout.objective === objectiveFilter
    const matchesLevel = levelFilter === "all" || workout.level === levelFilter
    return matchesSearch && matchesObjective && matchesLevel
  })

  const getObjectiveBadge = (objective: string) => {
    const colors: Record<string, string> = {
      hipertrofia: "bg-blue-500/20 text-blue-500",
      emagrecimento: "bg-green-500/20 text-green-500",
      resistencia: "bg-orange-500/20 text-orange-500",
      forca: "bg-red-500/20 text-red-500",
      flexibilidade: "bg-purple-500/20 text-purple-500",
    }
    return <Badge className={colors[objective]}>{objective}</Badge>
  }

  const getLevelBadge = (level: string) => {
    const colors: Record<string, string> = {
      iniciante: "bg-green-500/20 text-green-500",
      intermediario: "bg-yellow-500/20 text-yellow-500",
      avancado: "bg-red-500/20 text-red-500",
    }
    const labels: Record<string, string> = {
      iniciante: "Iniciante",
      intermediario: "Intermediário",
      avancado: "Avançado",
    }
    return <Badge className={colors[level]}>{labels[level]}</Badge>
  }

  const addExercise = () => {
    if (!newExercise.name) return
    const exercise: Exercise = {
      id: `temp-${Date.now()}`,
      ...newExercise,
    }
    setNewWorkout(prev => ({
      ...prev,
      exercises: [...prev.exercises, exercise],
    }))
    setNewExercise({ name: "", sets: 3, reps: "10-12", rest: "60s", notes: "" })
  }

  const removeExercise = (id: string) => {
    setNewWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.filter(e => e.id !== id),
    }))
  }

  const createWorkout = () => {
    // Se veio de um pedido, já vincula o cliente automaticamente
    const assignedClients = clientIdFromOrder && clientNameFromOrder 
      ? [{ id: clientIdFromOrder, name: clientNameFromOrder, avatar: null }]
      : []
    
    const workout: Workout = {
      id: `w-${Date.now()}`,
      ...newWorkout,
      assignedTo: assignedClients,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    }
    setWorkouts(prev => [workout, ...prev])
    setIsCreateModalOpen(false)
    
    // Se veio de um pedido, mostra mensagem de sucesso
    if (orderIdFromOrder) {
      setShowOrderLinkedSuccess(true)
      setTimeout(() => setShowOrderLinkedSuccess(false), 5000)
    }
    
    setNewWorkout({
      name: "",
      description: "",
      objective: "hipertrofia",
      level: "intermediario",
      duration: "60 min",
      exercises: [],
    })
  }

  const duplicateWorkout = (workout: Workout) => {
    const duplicate: Workout = {
      ...workout,
      id: `w-${Date.now()}`,
      name: `${workout.name} (Cópia)`,
      assignedTo: [],
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    }
    setWorkouts(prev => [duplicate, ...prev])
  }

  const deleteWorkout = (id: string) => {
    setWorkouts(prev => prev.filter(w => w.id !== id))
  }

  const assignWorkout = (workoutId: string, clientIds: string[]) => {
    setWorkouts(prev => prev.map(w => {
      if (w.id === workoutId) {
        const assignedClients = clients.filter(c => clientIds.includes(c.id))
        return { ...w, assignedTo: assignedClients, updatedAt: new Date().toISOString().split("T")[0] }
      }
      return w
    }))
    setIsAssignModalOpen(false)
    setSelectedWorkout(null)
  }

  return (
    <div className="space-y-6">
      {/* Banner de contexto quando vem de um pedido */}
      {clientIdFromOrder && clientNameFromOrder && (
        <Alert className="border-primary/50 bg-primary/5">
          <User className="h-4 w-4" />
          <AlertTitle className="flex items-center gap-2">
            Criando treino para cliente
            {orderIdFromOrder && (
              <Badge variant="outline" className="text-xs">
                <LinkIcon className="mr-1 h-3 w-3" />
                Pedido vinculado
              </Badge>
            )}
          </AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>
              Você está criando um treino personalizado para <strong>{clientNameFromOrder}</strong>.
              O treino será vinculado automaticamente ao cliente.
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
          <AlertTitle>Treino criado com sucesso!</AlertTitle>
          <AlertDescription>
            O treino foi vinculado automaticamente ao cliente {clientNameFromOrder}.
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Montagem de Treinos</h1>
          <p className="text-muted-foreground">Crie e gerencie treinos personalizados para seus alunos</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Treino
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Novo Treino</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Treino</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Treino A - Peito e Tríceps"
                    value={newWorkout.name}
                    onChange={(e) => setNewWorkout(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva o objetivo do treino..."
                    value={newWorkout.description}
                    onChange={(e) => setNewWorkout(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Objetivo</Label>
                    <Select
                      value={newWorkout.objective}
                      onValueChange={(v) => setNewWorkout(prev => ({ ...prev, objective: v as Workout["objective"] }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hipertrofia">Hipertrofia</SelectItem>
                        <SelectItem value="emagrecimento">Emagrecimento</SelectItem>
                        <SelectItem value="resistencia">Resistência</SelectItem>
                        <SelectItem value="forca">Força</SelectItem>
                        <SelectItem value="flexibilidade">Flexibilidade</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Nível</Label>
                    <Select
                      value={newWorkout.level}
                      onValueChange={(v) => setNewWorkout(prev => ({ ...prev, level: v as Workout["level"] }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="iniciante">Iniciante</SelectItem>
                        <SelectItem value="intermediario">Intermediário</SelectItem>
                        <SelectItem value="avancado">Avançado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duração</Label>
                    <Input
                      id="duration"
                      placeholder="Ex: 60 min"
                      value={newWorkout.duration}
                      onChange={(e) => setNewWorkout(prev => ({ ...prev, duration: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              {/* Exercises Section */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-4">Exercícios</h3>
                
                {/* Exercise List */}
                {newWorkout.exercises.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {newWorkout.exercises.map((exercise, index) => (
                      <div key={exercise.id} className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-muted-foreground">{index + 1}.</span>
                          <div>
                            <p className="font-medium text-foreground">{exercise.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {exercise.sets} séries x {exercise.reps} | Descanso: {exercise.rest}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removeExercise(exercise.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Exercise Form */}
                <div className="space-y-3 rounded-lg border border-border p-4">
                  <div className="space-y-2">
                    <Label>Exercício</Label>
                    <Select
                      value={newExercise.name}
                      onValueChange={(v) => setNewExercise(prev => ({ ...prev, name: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um exercício" />
                      </SelectTrigger>
                      <SelectContent>
                        {exerciseLibrary.map(ex => (
                          <SelectItem key={ex.name} value={ex.name}>
                            {ex.name} ({ex.category})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label>Séries</Label>
                      <Input
                        type="number"
                        value={newExercise.sets}
                        onChange={(e) => setNewExercise(prev => ({ ...prev, sets: Number(e.target.value) }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Repetições</Label>
                      <Input
                        value={newExercise.reps}
                        onChange={(e) => setNewExercise(prev => ({ ...prev, reps: e.target.value }))}
                        placeholder="10-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Descanso</Label>
                      <Input
                        value={newExercise.rest}
                        onChange={(e) => setNewExercise(prev => ({ ...prev, rest: e.target.value }))}
                        placeholder="60s"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Observações (opcional)</Label>
                    <Input
                      value={newExercise.notes}
                      onChange={(e) => setNewExercise(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Ex: Controle na descida"
                    />
                  </div>
                  <Button type="button" variant="outline" className="w-full" onClick={addExercise}>
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Exercício
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button onClick={createWorkout} disabled={!newWorkout.name || newWorkout.exercises.length === 0}>
                Criar Treino
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
                <Dumbbell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{workouts.length}</p>
                <p className="text-sm text-muted-foreground">Treinos criados</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <Users className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{clients.length}</p>
                <p className="text-sm text-muted-foreground">Alunos ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <Target className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {workouts.filter(w => w.assignedTo.length > 0).length}
                </p>
                <p className="text-sm text-muted-foreground">Treinos atribuídos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                <Clock className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {Math.round(workouts.reduce((acc, w) => acc + parseInt(w.duration), 0) / workouts.length)}min
                </p>
                <p className="text-sm text-muted-foreground">Duração média</p>
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
            placeholder="Buscar treinos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={objectiveFilter} onValueChange={setObjectiveFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Objetivo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos objetivos</SelectItem>
            <SelectItem value="hipertrofia">Hipertrofia</SelectItem>
            <SelectItem value="emagrecimento">Emagrecimento</SelectItem>
            <SelectItem value="resistencia">Resistência</SelectItem>
            <SelectItem value="forca">Força</SelectItem>
            <SelectItem value="flexibilidade">Flexibilidade</SelectItem>
          </SelectContent>
        </Select>
        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Nível" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos níveis</SelectItem>
            <SelectItem value="iniciante">Iniciante</SelectItem>
            <SelectItem value="intermediario">Intermediário</SelectItem>
            <SelectItem value="avancado">Avançado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Workouts List */}
      <div className="space-y-4">
        {filteredWorkouts.map((workout) => (
          <Card key={workout.id} className="bg-card border-border">
            <CardContent className="p-0">
              {/* Header */}
              <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => setExpandedWorkout(expandedWorkout === workout.id ? null : workout.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Dumbbell className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{workout.name}</h3>
                    <p className="text-sm text-muted-foreground">{workout.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex items-center gap-2">
                    {getObjectiveBadge(workout.objective)}
                    {getLevelBadge(workout.level)}
                    <Badge variant="outline" className="gap-1">
                      <Clock className="h-3 w-3" />
                      {workout.duration}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {workout.assignedTo.length > 0 && (
                      <div className="flex -space-x-2">
                        {workout.assignedTo.slice(0, 3).map(client => (
                          <Avatar key={client.id} className="h-7 w-7 border-2 border-background">
                            <AvatarImage src={client.avatar || undefined} />
                            <AvatarFallback className="text-xs bg-primary/20 text-primary">
                              {client.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {workout.assignedTo.length > 3 && (
                          <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-secondary text-xs">
                            +{workout.assignedTo.length - 3}
                          </div>
                        )}
                      </div>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation()
                          setSelectedWorkout(workout)
                          setIsAssignModalOpen(true)
                        }}>
                          <Users className="mr-2 h-4 w-4" />
                          Atribuir a alunos
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation()
                          duplicateWorkout(workout)
                        }}>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteWorkout(workout.id)
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    {expandedWorkout === workout.id ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedWorkout === workout.id && (
                <div className="border-t border-border p-4 bg-secondary/30">
                  <div className="flex items-center gap-2 mb-4 sm:hidden">
                    {getObjectiveBadge(workout.objective)}
                    {getLevelBadge(workout.level)}
                    <Badge variant="outline" className="gap-1">
                      <Clock className="h-3 w-3" />
                      {workout.duration}
                    </Badge>
                  </div>
                  <h4 className="font-medium text-foreground mb-3">Exercícios ({workout.exercises.length})</h4>
                  <div className="space-y-2">
                    {workout.exercises.map((exercise, index) => (
                      <div key={exercise.id} className="flex items-center justify-between rounded-lg bg-background p-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-medium text-primary">
                            {index + 1}
                          </span>
                          <div>
                            <p className="font-medium text-foreground">{exercise.name}</p>
                            {exercise.notes && (
                              <p className="text-xs text-muted-foreground">{exercise.notes}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-foreground">
                            {exercise.sets} x {exercise.reps}
                          </p>
                          <p className="text-xs text-muted-foreground">Descanso: {exercise.rest}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {workout.assignedTo.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <h4 className="font-medium text-foreground mb-2">Alunos atribuídos</h4>
                      <div className="flex flex-wrap gap-2">
                        {workout.assignedTo.map(client => (
                          <Badge key={client.id} variant="secondary" className="gap-1">
                            <Avatar className="h-4 w-4">
                              <AvatarImage src={client.avatar || undefined} />
                              <AvatarFallback className="text-[8px]">{client.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {client.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredWorkouts.length === 0 && (
        <div className="text-center py-12">
          <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Nenhum treino encontrado</p>
          <Button className="mt-4" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Criar primeiro treino
          </Button>
        </div>
      )}

      {/* Assign Modal */}
      <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Atribuir Treino a Alunos</DialogTitle>
          </DialogHeader>
          {selectedWorkout && (
            <AssignWorkoutContent
              workout={selectedWorkout}
              clients={clients}
              onAssign={(clientIds) => assignWorkout(selectedWorkout.id, clientIds)}
              onCancel={() => {
                setIsAssignModalOpen(false)
                setSelectedWorkout(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function AssignWorkoutContent({
  workout,
  clients,
  onAssign,
  onCancel,
}: {
  workout: Workout
  clients: { id: string; name: string; avatar: string | null }[]
  onAssign: (clientIds: string[]) => void
  onCancel: () => void
}) {
  const [selectedClients, setSelectedClients] = useState<string[]>(
    workout.assignedTo.map(c => c.id)
  )

  const toggleClient = (clientId: string) => {
    setSelectedClients(prev =>
      prev.includes(clientId)
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    )
  }

  return (
    <div className="space-y-4 py-4">
      <p className="text-sm text-muted-foreground">
        Selecione os alunos que receberão o treino <strong>{workout.name}</strong>
      </p>
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {clients.map(client => (
          <div
            key={client.id}
            className={`flex items-center gap-3 rounded-lg p-3 cursor-pointer transition-colors ${
              selectedClients.includes(client.id)
                ? "bg-primary/10 border border-primary"
                : "bg-secondary/50 hover:bg-secondary"
            }`}
            onClick={() => toggleClient(client.id)}
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={client.avatar || undefined} />
              <AvatarFallback className="bg-primary/20 text-primary">
                {client.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium text-foreground">{client.name}</span>
            {selectedClients.includes(client.id) && (
              <div className="ml-auto h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                <svg className="h-3 w-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button onClick={() => onAssign(selectedClients)}>
          Atribuir ({selectedClients.length})
        </Button>
      </DialogFooter>
    </div>
  )
}

// Export default com Suspense para lidar com useSearchParams
export default function TreinosPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    }>
      <TreinosContent />
    </Suspense>
  )
}
