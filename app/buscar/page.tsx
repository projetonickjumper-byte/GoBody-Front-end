"use client"

import { useState, useMemo, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Search, SlidersHorizontal, X, MapPin, Star, ArrowLeft, Dumbbell, Building2, Swords, Sparkles, Music, Flame, Loader2, UserCheck, Waves, Sun, Trophy } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { AppShell } from "@/components/app-shell"
import { mockGyms, categories } from "@/lib/data"

const categoryIcons: Record<string, React.ElementType> = {
  academias: Dumbbell,
  studios: Building2,
  lutas: Swords,
  pilates: Sparkles,
  dancas: Music,
  crossfit: Flame,
  "personal-trainer": UserCheck,
  aquaticas: Waves,
  "quadra-areia": Sun,
  "quadra-society": Trophy,
}

const categoryDescriptions: Record<string, string> = {
  academias: "Encontre as melhores academias com equipamentos de musculação, cardio e muito mais.",
  studios: "Studios especializados em treinos personalizados e ambientes exclusivos.",
  lutas: "Artes marciais, boxe, muay thai, jiu-jitsu e outras modalidades de luta.",
  pilates: "Studios de pilates com aparelhos modernos e instrutores certificados.",
  dancas: "Escolas e academias de dança de todos os estilos.",
  crossfit: "Boxes de crossfit com treinos funcionais de alta intensidade.",
  "personal-trainer": "Personal trainers qualificados para treinos individualizados e resultados mais rapidos.",
  aquaticas: "Natacao, hidroginastica, polo aquatico e outras atividades em piscina.",
  "quadra-areia": "Quadras de areia para beach tennis, futevolei, volei de praia e mais.",
  "quadra-society": "Quadras society para futebol, eventos esportivos e partidas entre amigos.",
}

const categoryNames: Record<string, string> = {
  academias: "Academias",
  studios: "Studios",
  lutas: "Lutas",
  pilates: "Pilates",
  dancas: "Danças",
  crossfit: "Crossfit",
  "personal-trainer": "Personal Trainer",
  aquaticas: "Aquaticas",
  "quadra-areia": "Quadra de Areia",
  "quadra-society": "Quadra Society",
}

// Mapeamento de categorias para modalidades relacionadas
const categoryModalityMap: Record<string, string[]> = {
  academias: ["musculação", "musculacao", "cardio", "funcional", "spinning", "yoga", "pilates", "hiit", "crossfit"],
  studios: ["pilates", "yoga", "funcional", "personal", "treino personalizado"],
  lutas: ["boxe", "muay thai", "jiu-jitsu", "jiu jitsu", "karate", "taekwondo", "mma", "judô", "judo", "luta", "artes marciais"],
  pilates: ["pilates", "alongamento", "flexibilidade"],
  dancas: ["dança", "danca", "zumba", "ballet", "salsa", "forró", "forro", "hip hop", "jazz"],
  crossfit: ["crossfit", "hiit", "funcional", "levantamento olímpico", "levantamento olimpico", "wod"],
  "personal-trainer": ["personal", "personal trainer", "treino personalizado", "personal training", "consultoria"],
  aquaticas: ["natação", "natacao", "hidroginástica", "hidroginastica", "polo aquático", "polo aquatico", "piscina", "aquático", "aquatico"],
  "quadra-areia": ["beach tennis", "futevôlei", "futevolei", "vôlei de praia", "volei de praia", "areia", "quadra de areia"],
  "quadra-society": ["society", "futebol", "futsal", "quadra", "campo", "pelada"],
}

function BuscarContent() {
  const searchParams = useSearchParams()
  const categoriaParam = searchParams.get("categoria")
  
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoriaParam ? [categoriaParam] : []
  )
  const [priceRange, setPriceRange] = useState([0, 100])
  const [minRating, setMinRating] = useState(0)
  const [filtersOpen, setFiltersOpen] = useState(false)

  // Atualizar categoria selecionada quando o parâmetro da URL mudar
  useEffect(() => {
    if (categoriaParam) {
      setSelectedCategories([categoriaParam])
    }
  }, [categoriaParam])

  const currentCategory = categoriaParam ? categories.find(c => c.slug === categoriaParam) : null
  const CategoryIcon = categoriaParam ? categoryIcons[categoriaParam] || Dumbbell : null

  const filteredGyms = useMemo(() => {
    return mockGyms.filter((gym) => {
      const matchesSearch =
        searchQuery === "" ||
        gym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gym.address.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.some(cat => {
          // Se for "academias", mostra todas (academias é a categoria geral)
          if (cat === "academias") return true
          
          // Verifica se alguma modalidade da academia corresponde à categoria
          const relatedModalities = categoryModalityMap[cat] || []
          return gym.modalities.some((mod) => {
            const modLower = mod.toLowerCase()
            return relatedModalities.some(related => modLower.includes(related) || related.includes(modLower))
          })
        })

      const dayUsePrice = gym.dayUse?.price ?? 0
      const matchesPrice =
        dayUsePrice >= priceRange[0] && dayUsePrice <= priceRange[1]

      const matchesRating = gym.rating >= minRating

      return matchesSearch && matchesCategory && matchesPrice && matchesRating
    })
  }, [searchQuery, selectedCategories, priceRange, minRating])

  const activeFiltersCount =
    selectedCategories.length +
    (priceRange[0] > 0 || priceRange[1] < 100 ? 1 : 0) +
    (minRating > 0 ? 1 : 0)

  const clearFilters = () => {
    setSelectedCategories([])
    setPriceRange([0, 100])
    setMinRating(0)
  }

  const toggleCategory = (categorySlug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categorySlug)
        ? prev.filter((slug) => slug !== categorySlug)
        : [...prev, categorySlug]
    )
  }

  return (
    <AppShell>
      <div className="min-h-screen bg-background pb-20 lg:pb-8">
        {/* Header com categoria */}
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
          {/* Categoria Header */}
          {categoriaParam && currentCategory && (
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-border">
              <div className="mx-auto max-w-7xl p-4">
                <div className="flex items-center gap-4">
                  <Link href="/" className="p-2 -ml-2 hover:bg-secondary rounded-full transition-colors">
                    <ArrowLeft className="h-5 w-5" />
                  </Link>
                  <div className="flex items-center gap-3">
                    {CategoryIcon && (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <CategoryIcon className="h-6 w-6" />
                      </div>
                    )}
                    <div>
                      <h1 className="text-xl font-bold text-foreground">
                        {categoryNames[categoriaParam] || categoriaParam}
                      </h1>
                      <p className="text-sm text-muted-foreground">
                        {currentCategory.count} locais encontrados
                      </p>
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground max-w-2xl">
                  {categoryDescriptions[categoriaParam] || "Explore os melhores locais desta categoria."}
                </p>
              </div>
            </div>
          )}

          {/* Search Bar */}
          <div className="p-4">
            <div className="mx-auto max-w-7xl">
              <div className="flex items-center gap-3">
                {!categoriaParam && (
                  <Link href="/" className="p-2 -ml-2 hover:bg-secondary rounded-full transition-colors lg:hidden">
                    <ArrowLeft className="h-5 w-5" />
                  </Link>
                )}
                <div className="relative flex-1 max-w-xl">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={categoriaParam ? `Buscar em ${categoryNames[categoriaParam] || categoriaParam}...` : "Buscar academias, studios..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-card border-border"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                      onClick={() => setSearchQuery("")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="relative shrink-0 bg-transparent lg:hidden">
                      <SlidersHorizontal className="h-4 w-4" />
                      {activeFiltersCount > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                          {activeFiltersCount}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80 bg-background border-border">
                    <SheetHeader>
                      <SheetTitle>Filtros</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 space-y-6">
                      {/* Categorias */}
                      <div>
                        <h3 className="mb-3 font-medium text-foreground">Categorias</h3>
                        <div className="space-y-2">
                          {categories.map((category) => (
                            <div key={category.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`mobile-${category.slug}`}
                                checked={selectedCategories.includes(category.slug)}
                                onCheckedChange={() => toggleCategory(category.slug)}
                              />
                              <Label
                                htmlFor={`mobile-${category.slug}`}
                                className="text-sm cursor-pointer"
                              >
                                {category.name} ({category.count})
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Preço Day Use */}
                      <div>
                        <h3 className="mb-3 font-medium text-foreground">
                          Preço Day Use: R$ {priceRange[0]} - R$ {priceRange[1]}
                        </h3>
                        <Slider
                          value={priceRange}
                          onValueChange={setPriceRange}
                          max={100}
                          step={5}
                          className="py-4"
                        />
                      </div>

                      {/* Avaliação Mínima */}
                      <div>
                        <h3 className="mb-3 font-medium text-foreground">Avaliação Mínima</h3>
                        <div className="flex gap-2">
                          {[0, 3, 3.5, 4, 4.5].map((rating) => (
                            <Button
                              key={rating}
                              variant={minRating === rating ? "default" : "outline"}
                              size="sm"
                              onClick={() => setMinRating(rating)}
                              className="flex-1"
                            >
                              {rating === 0 ? "Todos" : `${rating}+`}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Limpar filtros */}
                      {activeFiltersCount > 0 && (
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={clearFilters}
                        >
                          Limpar filtros
                        </Button>
                      )}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="mx-auto max-w-7xl p-4">
          <div className="flex gap-6">
            {/* Sidebar de Filtros - Desktop */}
            <div className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-40 space-y-6 rounded-xl bg-card p-4 border border-border">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Filtros</h3>
                  {activeFiltersCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Limpar
                    </Button>
                  )}
                </div>

                {/* Categorias */}
                <div>
                  <h4 className="mb-3 text-sm font-medium text-foreground">Categorias</h4>
                  <div className="space-y-2">
                    {categories.map((category) => {
                      const Icon = categoryIcons[category.slug] || Dumbbell
                      return (
                        <div key={category.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`desktop-${category.slug}`}
                            checked={selectedCategories.includes(category.slug)}
                            onCheckedChange={() => toggleCategory(category.slug)}
                          />
                          <Label
                            htmlFor={`desktop-${category.slug}`}
                            className="text-sm cursor-pointer flex items-center gap-2"
                          >
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            {category.name} ({category.count})
                          </Label>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Preço Day Use */}
                <div>
                  <h4 className="mb-3 text-sm font-medium text-foreground">
                    Preço Day Use
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    R$ {priceRange[0]} - R$ {priceRange[1]}
                  </p>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={100}
                    step={5}
                    className="py-4"
                  />
                </div>

                {/* Avaliação Mínima */}
                <div>
                  <h4 className="mb-3 text-sm font-medium text-foreground">Avaliação Mínima</h4>
                  <div className="flex flex-wrap gap-2">
                    {[0, 3, 3.5, 4, 4.5].map((rating) => (
                      <Button
                        key={rating}
                        variant={minRating === rating ? "default" : "outline"}
                        size="sm"
                        onClick={() => setMinRating(rating)}
                      >
                        {rating === 0 ? "Todos" : `${rating}+`}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Lista de Resultados */}
            <div className="flex-1">
              {/* Contador de resultados */}
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {filteredGyms.length} {filteredGyms.length === 1 ? "resultado" : "resultados"} encontrados
                </p>
                {selectedCategories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedCategories.map((cat) => (
                      <Badge key={cat} variant="secondary" className="gap-1">
                        {categoryNames[cat] || cat}
                        <button onClick={() => toggleCategory(cat)}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Grid de Resultados */}
              {filteredGyms.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredGyms.map((gym) => (
                    <Link
                      key={gym.id}
                      href={`/academia/${gym.slug}`}
                      className="group overflow-hidden rounded-xl bg-card border border-border transition-all hover:border-primary/50 hover:shadow-lg"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                          src={gym.images[0] || "/placeholder.svg"}
                          alt={gym.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                        {gym.dayUse && (
                          <Badge className="absolute left-3 top-3 bg-primary text-primary-foreground">
                            Day Use R$ {gym.dayUse.price}
                          </Badge>
                        )}
                        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-background/90 px-2 py-1 backdrop-blur-sm">
                          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                          <span className="text-xs font-medium">{gym.rating}</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {gym.name}
                        </h3>
                        <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{gym.neighborhood}, {gym.city}</span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1">
                          {gym.modalities.slice(0, 3).map((mod) => (
                            <Badge key={mod} variant="outline" className="text-xs">
                              {mod}
                            </Badge>
                          ))}
                          {gym.modalities.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{gym.modalities.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Nenhum resultado encontrado
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Tente ajustar os filtros ou buscar por outro termo para encontrar o que procura.
                  </p>
                  <Button variant="outline" className="mt-4" onClick={clearFilters}>
                    Limpar filtros
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

function BuscarLoading() {
  return (
    <AppShell>
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    </AppShell>
  )
}

export default function BuscarPage() {
  return (
    <Suspense fallback={<BuscarLoading />}>
      <BuscarContent />
    </Suspense>
  )
}
