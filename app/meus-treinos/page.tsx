"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { 
  Dumbbell, 
  Play, 
  RotateCcw, 
  Check, 
  ChevronRight,
  ChevronLeft,
  Clock,
  Flame,
  Trophy,
  X,
  SkipForward,
  Timer,
  CheckCircle2,
  Circle,
  Calendar
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AppShell } from "@/components/app-shell"
import { Header } from "@/components/header"
import { useAuth } from "@/lib/auth-context"
import { workoutsService } from "@/lib/api/services/workouts.service"

// Tipos
interface Exercise {
  id: string
  name: string
  sets: number
  reps: string
  rest: number
  weight?: string
  notes?: string
}

interface Workout {
  id: string
  name: string
  description: string
  trainerId: string
  trainerName: string
  trainerAvatar: string
  duration: number
  difficulty: "iniciante" | "intermediario" | "avancado"
  targetMuscles: string[]
  exercises: Exercise[]
  scheduledDays: string[]
  createdAt: string
}

interface WorkoutProgress {
  odId: string
  odName: string
  completedAt: string | null
  completedExercises: { [exerciseId: string]: number[] }
  startedAt: string | null
  totalTime: number
}

// Dados mockados
const mockWorkouts: Workout[] = [
  {
    id: "w1",
    name: "Treino A - Peito e Triceps",
    description: "Peito e triceps com exercicios compostos",
    trainerId: "t1",
    trainerName: "Carlos Silva",
    trainerAvatar: "/placeholder.svg?height=40&width=40",
    duration: 60,
    difficulty: "intermediario",
    targetMuscles: ["Peito", "Triceps"],
    scheduledDays: ["Segunda", "Quinta"],
    createdAt: "2024-01-15",
    exercises: [
      { id: "e1", name: "Supino Reto", sets: 4, reps: "10-12", rest: 90, weight: "60kg", notes: "Cotovelos a 45 graus" },
      { id: "e2", name: "Supino Inclinado", sets: 3, reps: "12", rest: 60, weight: "20kg" },
      { id: "e3", name: "Crucifixo", sets: 3, reps: "15", rest: 45 },
      { id: "e4", name: "Triceps Pulley", sets: 4, reps: "12-15", rest: 45 },
      { id: "e5", name: "Triceps Testa", sets: 3, reps: "12", rest: 60, weight: "15kg" },
    ]
  },
  {
    id: "w2",
    name: "Treino B - Costas e Biceps",
    description: "Dorsais e biceps com amplitude",
    trainerId: "t1",
    trainerName: "Carlos Silva",
    trainerAvatar: "/placeholder.svg?height=40&width=40",
    duration: 55,
    difficulty: "intermediario",
    targetMuscles: ["Costas", "Biceps"],
    scheduledDays: ["Terca", "Sexta"],
    createdAt: "2024-01-15",
    exercises: [
      { id: "e7", name: "Puxada Frontal", sets: 4, reps: "10-12", rest: 90, weight: "50kg" },
      { id: "e8", name: "Remada Curvada", sets: 4, reps: "10", rest: 90, weight: "40kg" },
      { id: "e9", name: "Remada Unilateral", sets: 3, reps: "12", rest: 60, weight: "18kg" },
      { id: "e10", name: "Rosca Direta", sets: 3, reps: "12", rest: 60, weight: "25kg" },
    ]
  },
  {
    id: "w3",
    name: "Treino C - Pernas",
    description: "Membros inferiores completo",
    trainerId: "t1",
    trainerName: "Carlos Silva",
    trainerAvatar: "/placeholder.svg?height=40&width=40",
    duration: 70,
    difficulty: "avancado",
    targetMuscles: ["Quadriceps", "Posterior", "Gluteos"],
    scheduledDays: ["Quarta", "Sabado"],
    createdAt: "2024-01-15",
    exercises: [
      { id: "e12", name: "Agachamento", sets: 4, reps: "8-10", rest: 120, weight: "80kg" },
      { id: "e13", name: "Leg Press", sets: 4, reps: "12", rest: 90, weight: "200kg" },
      { id: "e14", name: "Cadeira Extensora", sets: 3, reps: "15", rest: 60 },
      { id: "e15", name: "Mesa Flexora", sets: 4, reps: "12", rest: 60 },
      { id: "e16", name: "Panturrilha", sets: 4, reps: "15-20", rest: 45 },
    ]
  }
]

const STORAGE_KEY = "fitapp_workout_progress"

export default function MeusTreinosPage() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()
  
  const [allWorkouts, setAllWorkouts] = useState<Workout[]>(mockWorkouts)
  const [workoutProgress, setWorkoutProgress] = useState<{ [workoutId: string]: WorkoutProgress }>({})
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [isResting, setIsResting] = useState(false)
  const [restTime, setRestTime] = useState(0)
  const [workoutStartTime, setWorkoutStartTime] = useState<number | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) setWorkoutProgress(JSON.parse(saved))
  }, [])

  // Carregar treinos da API
  useEffect(() => {
    async function loadWorkouts() {
      if (!user?.id) return
      try {
        const res = await workoutsService.getByStudent(user.id)
        if (res.success && res.data && res.data.length > 0) {
          const mapped: Workout[] = res.data.map((w: any) => ({
            id: w.id,
            name: w.name,
            description: w.description || "",
            trainerId: w.trainerId,
            trainerName: w.trainerName || "Trainer",
            trainerAvatar: w.trainerAvatar || "/placeholder.svg",
            duration: w.duration || 60,
            difficulty: w.level || "intermediario",
            targetMuscles: w.targetMuscles || [],
            scheduledDays: w.scheduledDays || [],
            createdAt: w.createdAt,
            exercises: (w.exercises || []).map((e: any) => ({
              id: e.id,
              name: e.name,
              sets: e.sets,
              reps: e.reps,
              rest: typeof e.rest === "string" ? parseInt(e.rest) || 60 : e.rest,
              weight: e.weight,
              notes: e.notes,
            })),
          }))
          setAllWorkouts(mapped)
        }
      } catch (error) {
        console.error("Erro ao carregar treinos:", error)
      }
    }
    if (isAuthenticated) loadWorkouts()
  }, [isAuthenticated, user?.id])
  
  const saveProgress = useCallback((progress: { [workoutId: string]: WorkoutProgress }) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    setWorkoutProgress(progress)
  }, [])
  
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isResting && restTime > 0) {
      interval = setInterval(() => {
        setRestTime((prev) => {
          if (prev <= 1) { setIsResting(false); return 0 }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isResting, restTime])
  
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (activeWorkout && workoutStartTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - workoutStartTime) / 1000))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [activeWorkout, workoutStartTime])
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/login")
  }, [isAuthenticated, isLoading, router])
  
  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }
  
  const getDayOfWeek = () => {
    const days = ["Domingo", "Segunda", "Terca", "Quarta", "Quinta", "Sexta", "Sabado"]
    return days[new Date().getDay()]
  }
  
  const todaysWorkouts = allWorkouts.filter(w => 
    w.scheduledDays.some(d => d.toLowerCase() === getDayOfWeek().toLowerCase())
  )
  
  const getWorkoutStatus = (workoutId: string) => {
    const progress = workoutProgress[workoutId]
    if (!progress) return "pendente"
    if (progress.completedAt) return "concluido"
    if (progress.startedAt) return "em_andamento"
    return "pendente"
  }
  
  const getCompletedSetsCount = (workoutId: string, exerciseId: string) => {
    return workoutProgress[workoutId]?.completedExercises?.[exerciseId]?.length || 0
  }
  
  const isSetCompleted = (workoutId: string, exerciseId: string, setIndex: number) => {
    return workoutProgress[workoutId]?.completedExercises?.[exerciseId]?.includes(setIndex) || false
  }
  
  const startWorkout = (workout: Workout) => {
    setActiveWorkout(workout)
    setCurrentExerciseIndex(0)
    setWorkoutStartTime(Date.now())
    setElapsedTime(0)
    
    const newProgress = { ...workoutProgress }
    if (!newProgress[workout.id]) {
      newProgress[workout.id] = {
        odId: workout.id,
        odName: workout.name,
        completedAt: null,
        completedExercises: {},
        startedAt: new Date().toISOString(),
        totalTime: 0
      }
    } else {
      newProgress[workout.id].startedAt = new Date().toISOString()
    }
    saveProgress(newProgress)
  }
  
  const completeSet = (exerciseId: string, setIndex: number, restSeconds: number) => {
    if (!activeWorkout) return
    
    const newProgress = { ...workoutProgress }
    if (!newProgress[activeWorkout.id]) {
      newProgress[activeWorkout.id] = {
        odId: activeWorkout.id,
        odName: activeWorkout.name,
        completedAt: null,
        completedExercises: {},
        startedAt: new Date().toISOString(),
        totalTime: 0
      }
    }
    
    if (!newProgress[activeWorkout.id].completedExercises[exerciseId]) {
      newProgress[activeWorkout.id].completedExercises[exerciseId] = []
    }
    
    if (!newProgress[activeWorkout.id].completedExercises[exerciseId].includes(setIndex)) {
      newProgress[activeWorkout.id].completedExercises[exerciseId].push(setIndex)
    }
    
    saveProgress(newProgress)
    setRestTime(restSeconds)
    setIsResting(true)
    checkWorkoutCompletion(newProgress)
  }
  
  const checkWorkoutCompletion = (progress: { [workoutId: string]: WorkoutProgress }) => {
    if (!activeWorkout) return
    
    const workoutData = progress[activeWorkout.id]
    if (!workoutData) return
    
    let allCompleted = true
    for (const exercise of activeWorkout.exercises) {
      const completedSets = workoutData.completedExercises[exercise.id]?.length || 0
      if (completedSets < exercise.sets) {
        allCompleted = false
        break
      }
    }
    
    if (allCompleted) {
      const newProgress = { ...progress }
      newProgress[activeWorkout.id].completedAt = new Date().toISOString()
      newProgress[activeWorkout.id].totalTime = elapsedTime
      saveProgress(newProgress)
    }
  }
  
  const finishWorkout = () => {
    if (!activeWorkout) return
    
    const newProgress = { ...workoutProgress }
    newProgress[activeWorkout.id].completedAt = new Date().toISOString()
    newProgress[activeWorkout.id].totalTime = elapsedTime
    saveProgress(newProgress)
    
    setActiveWorkout(null)
    setCurrentExerciseIndex(0)
    setWorkoutStartTime(null)
    setElapsedTime(0)
  }
  
  const closeWorkout = () => {
    setActiveWorkout(null)
    setCurrentExerciseIndex(0)
    setIsResting(false)
    setRestTime(0)
  }
  
  const skipRest = () => {
    setIsResting(false)
    setRestTime(0)
  }
  
  const getWorkoutProgress = (workout: Workout) => {
    const progress = workoutProgress[workout.id]
    if (!progress) return 0
    
    let totalSets = 0
    let completedSets = 0
    
    for (const exercise of workout.exercises) {
      totalSets += exercise.sets
      completedSets += progress.completedExercises[exercise.id]?.length || 0
    }
    
    return totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0
  }
  
  const currentExercise = activeWorkout?.exercises[currentExerciseIndex]
  
  // Tela de execucao do treino - fullscreen otimizada para mobile
  if (activeWorkout) {
    const progress = getWorkoutProgress(activeWorkout)
    const isWorkoutCompleted = progress === 100
    
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-background">
        {/* Header compacto */}
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <button type="button" onClick={closeWorkout} className="p-1.5 rounded-full hover:bg-secondary">
            <X className="h-5 w-5" />
          </button>
          <div className="text-center">
            <p className="text-xs text-muted-foreground truncate max-w-[180px]">{activeWorkout.name}</p>
            <p className="font-mono text-sm font-bold text-primary">{formatTime(elapsedTime)}</p>
          </div>
          <div className="w-8" />
        </div>
        
        {/* Progress bar */}
        <div className="px-3 py-1.5 border-b border-border">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-0.5">
            <span>Progresso</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
        
        {/* Conteudo principal - scrollavel */}
        <div className="flex-1 overflow-y-auto">
          {isWorkoutCompleted ? (
            <div className="flex flex-col items-center justify-center min-h-full p-4 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                <Trophy className="h-8 w-8 text-green-500" />
              </div>
              <h2 className="text-xl font-bold mb-1">Treino Concluido!</h2>
              <p className="text-sm text-muted-foreground mb-4">Parabens! Voce finalizou todas as series.</p>
              
              <div className="grid grid-cols-3 gap-2 mb-6 w-full max-w-[280px]">
                <div className="rounded-lg bg-card p-2 text-center">
                  <Clock className="h-4 w-4 mx-auto mb-0.5 text-primary" />
                  <p className="text-sm font-bold">{formatTime(elapsedTime)}</p>
                  <p className="text-[10px] text-muted-foreground">Duracao</p>
                </div>
                <div className="rounded-lg bg-card p-2 text-center">
                  <Dumbbell className="h-4 w-4 mx-auto mb-0.5 text-primary" />
                  <p className="text-sm font-bold">{activeWorkout.exercises.length}</p>
                  <p className="text-[10px] text-muted-foreground">Exercicios</p>
                </div>
                <div className="rounded-lg bg-card p-2 text-center">
                  <Flame className="h-4 w-4 mx-auto mb-0.5 text-primary" />
                  <p className="text-sm font-bold">+50</p>
                  <p className="text-[10px] text-muted-foreground">XP</p>
                </div>
              </div>
              
              <Button onClick={finishWorkout} className="w-full max-w-[280px]" size="sm">
                Finalizar
              </Button>
            </div>
          ) : (
            <>
              {/* Timer de descanso overlay */}
              {isResting && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/95 backdrop-blur">
                  <p className="text-sm text-muted-foreground mb-1">Descanse</p>
                  <p className="text-5xl font-bold font-mono text-primary mb-4">{formatTime(restTime)}</p>
                  <Button variant="outline" size="sm" onClick={skipRest} className="bg-transparent">
                    <SkipForward className="mr-1.5 h-4 w-4" />
                    Pular
                  </Button>
                </div>
              )}
              
              {currentExercise && (
                <div className="p-3">
                  {/* Navegacao exercicios */}
                  <div className="flex items-center justify-between mb-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      disabled={currentExerciseIndex === 0}
                      onClick={() => setCurrentExerciseIndex(prev => prev - 1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      {currentExerciseIndex + 1} / {activeWorkout.exercises.length}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      disabled={currentExerciseIndex === activeWorkout.exercises.length - 1}
                      onClick={() => setCurrentExerciseIndex(prev => prev + 1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Card exercicio atual */}
                  <Card className="mb-3">
                    <CardContent className="p-3">
                      <h3 className="text-base font-bold mb-2">{currentExercise.name}</h3>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">{currentExercise.sets}x{currentExercise.reps}</Badge>
                        {currentExercise.weight && (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">{currentExercise.weight}</Badge>
                        )}
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">
                          <Timer className="mr-0.5 h-2.5 w-2.5" />
                          {currentExercise.rest}s
                        </Badge>
                      </div>
                      
                      {currentExercise.notes && (
                        <p className="text-xs text-muted-foreground mb-3 bg-secondary/50 rounded p-2">
                          {currentExercise.notes}
                        </p>
                      )}
                      
                      {/* Series - botoes compactos */}
                      <div>
                        <p className="text-xs font-medium mb-2">Series:</p>
                        <div className="flex flex-wrap gap-2">
                          {Array.from({ length: currentExercise.sets }).map((_, idx) => {
                            const completed = isSetCompleted(activeWorkout.id, currentExercise.id, idx)
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => !completed && completeSet(currentExercise.id, idx, currentExercise.rest)}
                                disabled={completed}
                                className={cn(
                                  "flex h-11 w-11 items-center justify-center rounded-full border-2 text-sm font-bold transition-all",
                                  completed
                                    ? "border-green-500 bg-green-500/20 text-green-500"
                                    : "border-border bg-card hover:border-primary hover:bg-primary/10 active:scale-95"
                                )}
                              >
                                {completed ? <Check className="h-5 w-5" /> : idx + 1}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Lista de exercicios - compacta */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Exercicios:</p>
                    <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
                      {activeWorkout.exercises.map((exercise, idx) => {
                        const completedSets = getCompletedSetsCount(activeWorkout.id, exercise.id)
                        const isCompleted = completedSets >= exercise.sets
                        const isCurrent = idx === currentExerciseIndex
                        
                        return (
                          <button
                            key={exercise.id}
                            type="button"
                            onClick={() => setCurrentExerciseIndex(idx)}
                            className={cn(
                              "flex w-full items-center justify-between rounded-lg border p-2 text-left transition-all",
                              isCurrent ? "border-primary bg-primary/5" : "border-border bg-card",
                              isCompleted && "opacity-60"
                            )}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              {isCompleted ? (
                                <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                              ) : (
                                <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
                              )}
                              <span className={cn("text-xs truncate", isCompleted && "line-through")}>
                                {exercise.name}
                              </span>
                            </div>
                            <span className="text-[10px] text-muted-foreground shrink-0 ml-2">
                              {completedSets}/{exercise.sets}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    )
  }
  
  // Tela principal - Lista de treinos otimizada para mobile
  return (
    <AppShell>
      <div className="min-h-screen bg-background pb-20 lg:pb-8">
        <Header />
        
        <main className="mx-auto max-w-2xl px-3 py-4 sm:px-4 sm:py-6">
          <div className="mb-4">
            <h1 className="text-xl font-bold sm:text-2xl">Meus Treinos</h1>
            <p className="text-xs text-muted-foreground sm:text-sm">Treinos do seu treinador</p>
          </div>
          
          <Tabs defaultValue="treinos" className="space-y-3">
            <TabsList className="grid w-full grid-cols-2 h-9">
              <TabsTrigger value="treinos" className="text-xs sm:text-sm">Treinos</TabsTrigger>
              <TabsTrigger value="historico" className="text-xs sm:text-sm">Historico</TabsTrigger>
            </TabsList>
            
            <TabsContent value="treinos" className="space-y-4">
              {/* Treino do dia */}
              {todaysWorkouts.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-primary" />
                    Hoje ({getDayOfWeek()})
                  </h2>
                  {todaysWorkouts.map(workout => {
                    const status = getWorkoutStatus(workout.id)
                    const progress = getWorkoutProgress(workout)
                    
                    return (
                      <Card key={workout.id} className={cn(
                        "mb-2",
                        status === "concluido" && "border-green-500/50 bg-green-500/5"
                      )}>
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <h3 className="text-sm font-semibold truncate">{workout.name}</h3>
                                {status === "concluido" && (
                                  <Badge className="bg-green-500 text-[10px] px-1.5 py-0 h-5 shrink-0">
                                    <Check className="mr-0.5 h-3 w-3" />
                                    Feito
                                  </Badge>
                                )}
                              </div>
                              <p className="text-[10px] text-muted-foreground truncate">{workout.description}</p>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mb-2">
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5">
                              <Clock className="mr-0.5 h-3 w-3" />
                              {workout.duration}min
                            </Badge>
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5">
                              <Dumbbell className="mr-0.5 h-3 w-3" />
                              {workout.exercises.length}
                            </Badge>
                            <Badge variant="outline" className={cn(
                              "text-[10px] px-1.5 py-0 h-5",
                              workout.difficulty === "iniciante" && "border-green-500 text-green-500",
                              workout.difficulty === "intermediario" && "border-yellow-500 text-yellow-500",
                              workout.difficulty === "avancado" && "border-red-500 text-red-500"
                            )}>
                              {workout.difficulty.slice(0, 3)}
                            </Badge>
                          </div>
                          
                          {status !== "concluido" && progress > 0 && (
                            <div className="mb-2">
                              <Progress value={progress} className="h-1.5" />
                              <p className="text-[10px] text-muted-foreground mt-0.5">{progress}% concluido</p>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={workout.trainerAvatar || "/placeholder.svg"} />
                                <AvatarFallback className="text-[10px]">{workout.trainerName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="text-[10px] text-muted-foreground">{workout.trainerName}</span>
                            </div>
                            
                            {status !== "concluido" && (
                              <Button onClick={() => startWorkout(workout)} size="sm" className="h-7 text-xs px-3">
                                <Play className="mr-1 h-3 w-3" />
                                {progress > 0 ? "Continuar" : "Iniciar"}
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
              
              {/* Todos os treinos */}
              <div>
                <h2 className="text-sm font-semibold mb-2">Todos os Treinos</h2>
                <div className="space-y-2">
                  {allWorkouts.map(workout => {
                    const status = getWorkoutStatus(workout.id)
                    const progress = getWorkoutProgress(workout)
                    
                    return (
                      <Card key={workout.id} className={cn(
                        status === "concluido" && "border-green-500/50"
                      )}>
                        <CardContent className="p-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <h3 className="text-xs font-medium truncate">{workout.name}</h3>
                                {status === "concluido" && (
                                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-green-500" />
                                )}
                              </div>
                              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                <span>{workout.duration}min</span>
                                <span>-</span>
                                <span>{workout.exercises.length} ex</span>
                                <span>-</span>
                                <span className="truncate">{workout.scheduledDays.slice(0, 2).join(", ")}</span>
                              </div>
                            </div>
                            
                            {status !== "concluido" ? (
                              <Button size="icon" variant="outline" className="h-7 w-7 bg-transparent shrink-0" onClick={() => startWorkout(workout)}>
                                <Play className="h-3 w-3" />
                              </Button>
                            ) : (
                              <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0" onClick={() => {
                                const newProgress = { ...workoutProgress }
                                delete newProgress[workout.id]
                                saveProgress(newProgress)
                              }}>
                                <RotateCcw className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                          
                          {status !== "concluido" && progress > 0 && (
                            <Progress value={progress} className="h-1 mt-2" />
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="historico" className="space-y-2">
              {Object.values(workoutProgress)
                .filter(p => p.completedAt)
                .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
                .map(progress => (
                  <Card key={progress.odId}>
                    <CardContent className="p-2.5">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0">
                          <h3 className="text-xs font-medium truncate">{progress.odName}</h3>
                          <p className="text-[10px] text-muted-foreground">
                            {new Date(progress.completedAt!).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "short"
                            })}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <Badge className="bg-green-500 text-[10px] px-1.5 py-0 h-5">Feito</Badge>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {formatTime(progress.totalTime)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              
              {Object.values(workoutProgress).filter(p => p.completedAt).length === 0 && (
                <div className="text-center py-8">
                  <Dumbbell className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">Nenhum treino concluido</p>
                  <p className="text-xs text-muted-foreground">Complete seu primeiro treino</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </AppShell>
  )
}
