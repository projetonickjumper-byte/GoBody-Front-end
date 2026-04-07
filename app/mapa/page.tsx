"use client"

import { useState, useEffect, useCallback } from "react"
import { ArrowLeft, MapPin, Star, Navigation, List, X, Grid, Search, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { AppShell } from "@/components/app-shell"
import { LeafletMap, type MapMarker } from "@/components/dynamic-map"
import { gymsService } from "@/lib/api/services/gyms.service"
import type { Gym } from "@/lib/types"

export default function MapaPage() {
  const [allGyms, setAllGyms] = useState<Gym[]>([])
  const [selectedGym, setSelectedGym] = useState<Gym | null>(null)
  const [showList, setShowList] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)

  // Carregar academias
  useEffect(() => {
    async function loadGyms() {
      try {
        setLoading(true)
        const res = await gymsService.getAll({ pageSize: 100 })
        if (res.success && res.data) setAllGyms(res.data)
      } catch (error) {
        console.error("Erro ao carregar academias:", error)
      } finally {
        setLoading(false)
      }
    }
    loadGyms()
  }, [])

  // Obter localização do usuário
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
        () => setUserLocation([-23.5505, -46.6333]),
        { enableHighAccuracy: true, timeout: 10000 }
      )
    }
  }, [])

  // Converter academias em marcadores do mapa
  const mapMarkers: MapMarker[] = allGyms
    .filter((gym) => gym.latitude && gym.longitude)
    .map((gym) => ({
      id: gym.id,
      lat: gym.latitude,
      lng: gym.longitude,
      title: gym.name,
      subtitle: `${gym.address}, ${gym.city}`,
      price: gym.dayUse?.price ? `R$ ${gym.dayUse.price.toFixed(2).replace(".", ",")}` : undefined,
      rating: gym.rating,
      image: gym.images?.[0],
      slug: gym.slug,
    }))

  // Filtrar por busca
  const filteredGyms = searchQuery
    ? allGyms.filter(
        (gym) =>
          gym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          gym.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          gym.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          gym.modalities.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : allGyms

  const handleMarkerClick = useCallback((marker: MapMarker) => {
    const gym = allGyms.find((g) => g.id === marker.id)
    if (gym) setSelectedGym(gym)
  }, [allGyms])

  const handleMapClick = useCallback(() => {
    setSelectedGym(null)
  }, [])

  return (
    <AppShell>
      <div className="min-h-screen bg-background pb-20 lg:pb-0">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <Link href="/" className="lg:hidden">
                <Button variant="ghost" size="icon" className="shrink-0">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-xl font-bold">Mapa</h1>
              {!loading && (
                <Badge variant="secondary" className="text-xs">
                  {allGyms.length} academias
                </Badge>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowList(!showList)}
              className="gap-2 bg-transparent"
            >
              {showList ? <Grid className="h-4 w-4" /> : <List className="h-4 w-4" />}
              <span className="hidden sm:inline">{showList ? "Mapa" : "Lista"}</span>
            </Button>
          </div>
        </div>

        <div className="flex h-[calc(100vh-73px)] lg:h-[calc(100vh-73px)]">
          {/* Desktop: Side Panel */}
          <aside className={`hidden lg:flex flex-col w-96 border-r border-border ${!showList ? "lg:flex" : "lg:hidden"}`}>
            {/* Search */}
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar academia..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-secondary"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <p className="text-sm text-muted-foreground mb-2">
                {filteredGyms.length} {filteredGyms.length === 1 ? "academia encontrada" : "academias encontradas"}
              </p>
              {filteredGyms.map((gym) => (
                <button
                  key={gym.id}
                  type="button"
                  onClick={() => setSelectedGym(gym)}
                  className={`w-full text-left bg-card rounded-xl overflow-hidden border transition-all ${
                    selectedGym?.id === gym.id
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex">
                    <div className="relative h-24 w-24 shrink-0">
                      <Image
                        src={gym.images[0] || "/placeholder.svg"}
                        alt={gym.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 p-3">
                      <h3 className="font-semibold text-foreground line-clamp-1">{gym.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span className="line-clamp-1">{gym.address}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <span className="font-medium text-foreground text-sm">
                          {gym.rating.toFixed(1)}
                        </span>
                        <span className="text-primary font-bold text-sm ml-auto">
                          R$ {gym.dayUse?.price?.toFixed(2).replace(".", ",") ?? "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 relative">
            {showList ? (
              /* Mobile List View */
              <div className="p-4 space-y-3 lg:hidden overflow-y-auto h-full">
                {/* Mobile Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar academia..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-secondary"
                  />
                </div>

                {filteredGyms.map((gym) => (
                  <Link
                    key={gym.id}
                    href={`/academia/${gym.slug}`}
                    className="block bg-card rounded-xl overflow-hidden border border-border"
                  >
                    <div className="flex">
                      <div className="relative h-24 w-24 shrink-0">
                        <Image
                          src={gym.images[0] || "/placeholder.svg"}
                          alt={gym.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 p-3">
                        <h3 className="font-semibold text-foreground line-clamp-1">{gym.name}</h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3.5 w-3.5" />
                          <span className="line-clamp-1">{gym.address}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          <span className="font-medium text-foreground text-sm">
                            {gym.rating.toFixed(1)}
                          </span>
                          <span className="text-primary font-bold text-sm ml-auto">
                            R$ {gym.dayUse?.price?.toFixed(2).replace(".", ",") ?? "—"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              /* Map View - LEAFLET */
              <div className="relative h-full w-full">
                {loading ? (
                  <div className="flex items-center justify-center h-full bg-secondary">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p className="text-sm text-muted-foreground">Carregando academias...</p>
                    </div>
                  </div>
                ) : (
                  <LeafletMap
                    markers={mapMarkers}
                    selectedMarkerId={selectedGym?.id || null}
                    onMarkerClick={handleMarkerClick}
                    onMapClick={handleMapClick}
                    showUserLocation
                    userLocation={userLocation}
                    className="h-full w-full"
                  />
                )}

                {/* Recenter Button */}
                <Button
                  size="icon"
                  className="absolute bottom-24 lg:bottom-8 right-4 z-[1000] bg-card text-foreground shadow-lg hover:bg-card/80"
                  onClick={() => {
                    if (userLocation) {
                      // Forçar recentrar limpando seleção
                      setSelectedGym(null)
                    }
                  }}
                >
                  <Navigation className="h-5 w-5" />
                </Button>

                {/* Selected Gym Card - Mobile */}
                {selectedGym && (
                  <div className="absolute bottom-4 left-4 right-4 z-[1000] lg:hidden">
                    <div className="bg-card rounded-xl overflow-hidden border border-border shadow-xl">
                      <div className="flex">
                        <div className="relative h-24 w-24 shrink-0">
                          <Image
                            src={selectedGym.images[0] || "/placeholder.svg"}
                            alt={selectedGym.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 p-3 relative">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6"
                            onClick={() => setSelectedGym(null)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <h3 className="font-semibold text-foreground line-clamp-1 pr-6">
                            {selectedGym.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Star className="h-4 w-4 fill-primary text-primary" />
                            <span className="font-medium text-foreground text-sm">
                              {selectedGym.rating.toFixed(1)}
                            </span>
                            <span className="text-muted-foreground text-xs">
                              ({selectedGym.totalReviews})
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-primary font-bold">
                              R$ {selectedGym.dayUse?.price?.toFixed(2).replace(".", ",") ?? "—"}
                            </span>
                            <Link href={`/academia/${selectedGym.slug}`}>
                              <Button size="sm" className="bg-primary text-primary-foreground">
                                Ver mais
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Selected Gym Card - Desktop */}
                {selectedGym && (
                  <div className="hidden lg:block absolute bottom-8 left-8 z-[1000] w-80">
                    <div className="bg-card rounded-xl overflow-hidden border border-border shadow-xl">
                      <div className="relative aspect-video">
                        <Image
                          src={selectedGym.images[0] || "/placeholder.svg"}
                          alt={selectedGym.name}
                          fill
                          className="object-cover"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-8 w-8 bg-background/80 hover:bg-background"
                          onClick={() => setSelectedGym(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-foreground text-lg">
                          {selectedGym.name}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          <span className="line-clamp-1">
                            {selectedGym.address}, {selectedGym.city}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                          <Star className="h-5 w-5 fill-primary text-primary" />
                          <span className="font-semibold text-foreground">
                            {selectedGym.rating.toFixed(1)}
                          </span>
                          <span className="text-muted-foreground text-sm">
                            ({selectedGym.totalReviews} avaliações)
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {selectedGym.modalities.slice(0, 3).map((mod) => (
                            <Badge key={mod} variant="secondary" className="text-xs">
                              {mod}
                            </Badge>
                          ))}
                          {selectedGym.modalities.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{selectedGym.modalities.length - 3}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                          <div>
                            <p className="text-xs text-muted-foreground">Day Use</p>
                            <span className="text-primary font-bold text-lg">
                              R$ {selectedGym.dayUse?.price?.toFixed(2).replace(".", ",") ?? "—"}
                            </span>
                          </div>
                          <Link href={`/academia/${selectedGym.slug}`}>
                            <Button className="bg-primary text-primary-foreground">
                              Ver detalhes
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
