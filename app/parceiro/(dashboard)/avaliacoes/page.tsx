"use client"

import { useState, useEffect } from "react"
import {
  Star,
  MessageSquare,
  ThumbsUp,
  Filter,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
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
} from "@/components/ui/dialog"
import { reviewsService } from "@/lib/api/services/reviews.service"
import { useAuth } from "@/lib/auth-context"

interface Review {
  id: string
  userName: string
  userAvatar: string | null
  userLevel: number
  rating: number
  text: string
  date: string
  service: string
  helpful: number
  response?: {
    text: string
    date: string
  }
}

const mockReviews: Review[] = [
  {
    id: "1",
    userName: "Fernanda Silva",
    userAvatar: null,
    userLevel: 8,
    rating: 5,
    text: "Excelente academia! Equipamentos novos e profissionais muito atenciosos. O personal trainer e incrivel, sempre me motiva a dar o meu melhor. Recomendo demais!",
    date: "2024-01-15",
    service: "Personal Trainer",
    helpful: 12,
  },
  {
    id: "2",
    userName: "Roberto Alves",
    userAvatar: null,
    userLevel: 5,
    rating: 4,
    text: "Muito bom no geral, so poderia ter mais horarios de aulas em grupo. O espaco e limpo e bem organizado.",
    date: "2024-01-14",
    service: "CrossFit",
    helpful: 5,
    response: {
      text: "Obrigado pelo feedback, Roberto! Estamos trabalhando para adicionar mais horarios de aulas em grupo. Fique atento as novidades!",
      date: "2024-01-14",
    },
  },
  {
    id: "3",
    userName: "Carla Mendes",
    userAvatar: null,
    userLevel: 12,
    rating: 5,
    text: "Melhor academia da regiao! Frequento ha 2 anos e a qualidade so melhora. Equipe sempre disposta a ajudar.",
    date: "2024-01-13",
    service: "Musculacao",
    helpful: 18,
  },
  {
    id: "4",
    userName: "Paulo Santos",
    userAvatar: null,
    userLevel: 3,
    rating: 3,
    text: "Academia boa, mas o estacionamento e pequeno. As vezes demoro para encontrar vaga.",
    date: "2024-01-12",
    service: "Musculacao",
    helpful: 3,
  },
  {
    id: "5",
    userName: "Ana Beatriz",
    userAvatar: null,
    userLevel: 7,
    rating: 5,
    text: "As aulas de yoga sao maravilhosas! A instrutora e muito competente e o ambiente e super tranquilo.",
    date: "2024-01-11",
    service: "Yoga",
    helpful: 8,
  },
]

const ratingDistribution = [
  { stars: 5, count: 156, percentage: 65 },
  { stars: 4, count: 52, percentage: 22 },
  { stars: 3, count: 18, percentage: 8 },
  { stars: 2, count: 8, percentage: 3 },
  { stars: 1, count: 5, percentage: 2 },
]

export default function AvaliacoesPage() {
  const { user } = useAuth()
  const [reviews, setReviews] = useState<Review[]>(mockReviews)

  useEffect(() => {
    async function loadReviews() {
      try {
        // Carrega reviews da academia do parceiro
        const res = await reviewsService.getAll()
        if (res.success && res.data && res.data.length > 0) {
          const mapped: Review[] = res.data.map((r: any) => ({
            id: r.id,
            userName: r.userName,
            userAvatar: r.userAvatar || null,
            rating: r.rating,
            comment: r.text || r.comment || "",
            date: r.date || r.createdAt,
            replied: !!r.gymResponse,
            replyText: r.gymResponse?.text || null,
          }))
          setReviews(mapped)
        }
      } catch (error) {
        console.error("Erro ao carregar avaliações:", error)
      }
    }
    loadReviews()
  }, [user?.id])
  const [filter, setFilter] = useState("all")
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [responseText, setResponseText] = useState("")
  const [isResponding, setIsResponding] = useState(false)

  const filteredReviews = reviews.filter(review => {
    if (filter === "all") return true
    if (filter === "pending") return !review.response
    if (filter === "responded") return !!review.response
    return review.rating === Number(filter)
  })

  const averageRating = 4.8
  const totalReviews = 239
  const responseRate = 85

  const handleRespond = () => {
    if (!selectedReview || !responseText.trim()) return

    setReviews(reviews.map(r =>
      r.id === selectedReview.id
        ? {
            ...r,
            response: {
              text: responseText,
              date: new Date().toISOString().split("T")[0],
            },
          }
        : r
    ))

    setResponseText("")
    setIsResponding(false)
    setSelectedReview(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Avaliacoes</h1>
        <p className="text-muted-foreground">Veja o que seus clientes estao dizendo</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Star className="h-6 w-6 fill-primary text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">{averageRating}</p>
                <p className="text-sm text-muted-foreground">Media geral</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">{totalReviews}</p>
                <p className="text-sm text-muted-foreground">Total de avaliacoes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">{responseRate}%</p>
                <p className="text-sm text-muted-foreground">Taxa de resposta</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <ThumbsUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">92%</p>
                <p className="text-sm text-muted-foreground">Recomendariam</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rating Distribution */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Distribuicao de Notas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {ratingDistribution.map((item) => (
              <div key={item.stars} className="flex items-center gap-4">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm font-medium text-foreground">{item.stars}</span>
                  <Star className="h-4 w-4 fill-primary text-primary" />
                </div>
                <Progress value={item.percentage} className="flex-1 h-2" />
                <span className="text-sm text-muted-foreground w-16 text-right">
                  {item.count} ({item.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[200px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filtrar por..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="pending">Sem resposta</SelectItem>
            <SelectItem value="responded">Respondidas</SelectItem>
            <SelectItem value="5">5 estrelas</SelectItem>
            <SelectItem value="4">4 estrelas</SelectItem>
            <SelectItem value="3">3 estrelas</SelectItem>
            <SelectItem value="2">2 estrelas</SelectItem>
            <SelectItem value="1">1 estrela</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <Card key={review.id} className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={review.userAvatar || undefined} />
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {review.userName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground">{review.userName}</p>
                      <Badge variant="secondary" className="text-xs">
                        Nivel {review.userLevel}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? "fill-primary text-primary" : "text-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.date).toLocaleDateString("pt-BR")}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {review.service}
                      </Badge>
                    </div>
                  </div>
                </div>
                {!review.response && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedReview(review)
                      setIsResponding(true)
                    }}
                    className="bg-transparent"
                  >
                    Responder
                  </Button>
                )}
              </div>

              <p className="mt-4 text-foreground">{review.text}</p>

              <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{review.helpful} acharam util</span>
                </div>
              </div>

              {review.response && (
                <div className="mt-4 rounded-lg bg-secondary/50 p-4 border-l-4 border-primary">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-primary text-primary-foreground">Resposta</Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(review.response.date).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{review.response.text}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhuma avaliacao encontrada</p>
        </div>
      )}

      {/* Response Dialog */}
      <Dialog open={isResponding} onOpenChange={setIsResponding}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Responder avaliacao</DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4 py-4">
              <div className="rounded-lg bg-secondary/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <p className="font-medium text-foreground">{selectedReview.userName}</p>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < selectedReview.rating ? "fill-primary text-primary" : "text-muted"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{selectedReview.text}</p>
              </div>

              <div className="space-y-2">
                <Textarea
                  placeholder="Escreva sua resposta..."
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsResponding(false)} className="bg-transparent">
                  Cancelar
                </Button>
                <Button onClick={handleRespond} disabled={!responseText.trim()}>
                  Enviar resposta
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
