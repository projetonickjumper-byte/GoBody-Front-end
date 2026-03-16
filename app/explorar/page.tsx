"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, SlidersHorizontal, X, MapPin, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AppShell } from "@/components/app-shell";
import { gymsService } from "@/lib/api/services/gyms.service";
import type { Gym, Category } from "@/lib/types";

export default function ExplorarPage() {
  const [allGyms, setAllGyms] = useState<Gym[]>([]);
  const [mockCategories, setMockCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [minRating, setMinRating] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [gymsRes, catsRes] = await Promise.all([
          gymsService.getAll({ pageSize: 100 }),
          gymsService.getCategories(),
        ]);
        if (gymsRes.success && gymsRes.data) setAllGyms(gymsRes.data);
        if (catsRes.success && catsRes.data) setMockCategories(catsRes.data);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    }
    loadData();
  }, []);

  const filteredGyms = useMemo(() => {
    return allGyms.filter((gym) => {
      const matchesSearch =
        searchQuery === "" ||
        gym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gym.address.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategories.length === 0 ||
        gym.modalities.some((mod) => selectedCategories.includes(mod.toLowerCase()));

      const dayUsePrice = gym.dayUse?.price ?? 0;
      const matchesPrice =
        dayUsePrice >= priceRange[0] && dayUsePrice <= priceRange[1];

      const matchesRating = gym.rating >= minRating;

      return matchesSearch && matchesCategory && matchesPrice && matchesRating;
    });
  }, [searchQuery, selectedCategories, priceRange, minRating]);

  const activeFiltersCount =
    selectedCategories.length +
    (priceRange[0] > 0 || priceRange[1] < 100 ? 1 : 0) +
    (minRating > 0 ? 1 : 0);

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 100]);
    setMinRating(0);
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <AppShell>
      <div className="min-h-screen bg-background pb-20 lg:pb-8">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border p-4">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar academias, studios..."
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
                      <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                        {activeFiltersCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:max-w-md bg-background">
                  <SheetHeader>
                    <SheetTitle className="flex items-center justify-between">
                      Filtros
                      {activeFiltersCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearFilters}
                          className="text-primary"
                        >
                          Limpar tudo
                        </Button>
                      )}
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    {/* Categories */}
                    <div>
                      <h3 className="font-semibold mb-3">Categorias</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {mockCategories.map((category) => (
                          <div
                            key={category.id}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={category.id}
                              checked={selectedCategories.includes(category.id)}
                              onCheckedChange={() => toggleCategory(category.id)}
                            />
                            <Label
                              htmlFor={category.id}
                              className="text-sm cursor-pointer"
                            >
                              {category.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Price Range */}
                    <div>
                      <h3 className="font-semibold mb-3">
                        Preço Day Use: R$ {priceRange[0]} - R$ {priceRange[1]}
                      </h3>
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={100}
                        step={5}
                        className="mt-2"
                      />
                    </div>

                    {/* Rating */}
                    <div>
                      <h3 className="font-semibold mb-3">Avaliação Mínima</h3>
                      <div className="flex gap-2 flex-wrap">
                        {[0, 3, 3.5, 4, 4.5].map((rating) => (
                          <Button
                            key={rating}
                            variant={minRating === rating ? "default" : "outline"}
                            size="sm"
                            onClick={() => setMinRating(rating)}
                            className={minRating === rating ? "bg-primary text-primary-foreground" : "bg-transparent"}
                          >
                            {rating === 0 ? "Todos" : `${rating}+`}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <Button
                      className="w-full bg-primary text-primary-foreground"
                      onClick={() => setFiltersOpen(false)}
                    >
                      Ver {filteredGyms.length} resultados
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedCategories.map((catId) => {
                  const category = mockCategories.find((c) => c.id === catId);
                  return (
                    <Badge
                      key={catId}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => toggleCategory(catId)}
                    >
                      {category?.name}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  );
                })}
                {(priceRange[0] > 0 || priceRange[1] < 100) && (
                  <Badge
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => setPriceRange([0, 100])}
                  >
                    R$ {priceRange[0]} - R$ {priceRange[1]}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                )}
                {minRating > 0 && (
                  <Badge
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => setMinRating(0)}
                  >
                    {minRating}+ estrelas
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex gap-8">
            {/* Desktop Filters Sidebar */}
            <aside className="hidden lg:block w-64 shrink-0 py-6">
              <div className="sticky top-24 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-lg">Filtros</h2>
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-primary h-auto p-0"
                    >
                      Limpar
                    </Button>
                  )}
                </div>

                {/* Categories */}
                <div className="space-y-3">
                  <h3 className="font-medium text-sm text-muted-foreground">Categorias</h3>
                  <div className="space-y-2">
                    {mockCategories.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`desktop-${category.id}`}
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={() => toggleCategory(category.id)}
                        />
                        <Label
                          htmlFor={`desktop-${category.id}`}
                          className="text-sm cursor-pointer"
                        >
                          {category.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-3">
                  <h3 className="font-medium text-sm text-muted-foreground">
                    Preço Day Use
                  </h3>
                  <p className="text-sm">R$ {priceRange[0]} - R$ {priceRange[1]}</p>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={100}
                    step={5}
                  />
                </div>

                {/* Rating */}
                <div className="space-y-3">
                  <h3 className="font-medium text-sm text-muted-foreground">Avaliação Mínima</h3>
                  <div className="flex gap-2 flex-wrap">
                    {[0, 3, 3.5, 4, 4.5].map((rating) => (
                      <Button
                        key={rating}
                        variant={minRating === rating ? "default" : "outline"}
                        size="sm"
                        onClick={() => setMinRating(rating)}
                        className={minRating === rating ? "bg-primary text-primary-foreground" : "bg-transparent"}
                      >
                        {rating === 0 ? "Todos" : `${rating}+`}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Results */}
            <div className="flex-1 py-6">
              {/* Results Count */}
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">
                  {filteredGyms.length} academias encontradas
                </p>
              </div>

              {/* Results Grid */}
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredGyms.map((gym) => (
                  <Link
                    key={gym.id}
                    href={`/academia/${gym.slug}`}
                    className="block bg-card rounded-xl overflow-hidden border border-border hover:ring-2 hover:ring-primary/50 transition-all"
                  >
                    <div className="relative aspect-video">
                      <Image
                        src={gym.images[0] || "/placeholder.svg"}
                        alt={gym.name}
                        fill
                        className="object-cover"
                      />
                      {gym.verified && (
                        <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
                          Verificada
                        </Badge>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground line-clamp-1">
                        {gym.name}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span className="line-clamp-1">{gym.address}, {gym.city}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          <span className="font-medium text-foreground text-sm">
                            {gym.rating.toFixed(1)}
                          </span>
                        </div>
                        <span className="text-muted-foreground text-xs">
                          ({gym.totalReviews})
                        </span>
                        {gym.distance !== undefined && (
                          <Badge variant="secondary" className="text-xs ml-auto">
                            {gym.distance < 1 ? `${(gym.distance * 1000).toFixed(0)}m` : `${gym.distance.toFixed(1)}km`}
                          </Badge>
                        )}
                      </div>
                      <div className="mt-3 pt-3 border-t border-border">
                        <span className="text-primary font-bold">
                          R$ {gym.dayUse?.price?.toFixed(2).replace(".", ",") ?? "—"}
                        </span>
                        <span className="text-muted-foreground text-xs"> /day use</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {filteredGyms.length === 0 && (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">Nenhuma academia encontrada</p>
                  <Button variant="outline" className="mt-4 bg-transparent" onClick={clearFilters}>
                    Limpar filtros
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
