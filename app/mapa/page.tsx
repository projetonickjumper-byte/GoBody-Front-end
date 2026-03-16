"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Star, Navigation, List, X, Grid } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppShell } from "@/components/app-shell";
import { gymsService } from "@/lib/api/services/gyms.service";
import type { Gym } from "@/lib/types";

export default function MapaPage() {
  const [allGyms, setAllGyms] = useState<Gym[]>([]);
  const [selectedGym, setSelectedGym] = useState<Gym | null>(null);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    async function loadGyms() {
      try {
        const res = await gymsService.getAll({ pageSize: 100 });
        if (res.success && res.data) setAllGyms(res.data);
      } catch (error) {
        console.error("Erro ao carregar academias:", error);
      }
    }
    loadGyms();
  }, []);

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
          <aside className={`hidden lg:block w-96 border-r border-border overflow-y-auto ${!showList ? 'lg:block' : 'lg:hidden'}`}>
            <div className="p-4 space-y-3">
              <p className="text-sm text-muted-foreground mb-4">{allGyms.length} academias encontradas</p>
              {allGyms.map((gym) => (
                <button
                  key={gym.id}
                  type="button"
                  onClick={() => setSelectedGym(gym)}
                  className={`w-full text-left bg-card rounded-xl overflow-hidden border transition-all ${
                    selectedGym?.id === gym.id ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'
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
                      <h3 className="font-semibold text-foreground line-clamp-1">
                        {gym.name}
                      </h3>
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
          <div className="flex-1">
            {showList ? (
              /* Mobile List View */
              <div className="p-4 space-y-3 lg:hidden overflow-y-auto h-full">
                {allGyms.map((gym) => (
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
                        <h3 className="font-semibold text-foreground line-clamp-1">
                          {gym.name}
                        </h3>
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
              /* Map View */
              <div className="relative h-full">
                {/* Simulated Map Background */}
                <div className="absolute inset-0 bg-secondary">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
                      `,
                      backgroundSize: "40px 40px",
                    }}
                  />

                  {/* Map Markers */}
                  {allGyms.map((gym, index) => {
                    const positions = [
                      { top: "20%", left: "30%" },
                      { top: "35%", left: "60%" },
                      { top: "50%", left: "25%" },
                      { top: "40%", left: "45%" },
                      { top: "65%", left: "55%" },
                      { top: "25%", left: "70%" },
                      { top: "55%", left: "75%" },
                      { top: "70%", left: "35%" },
                    ];
                    const pos = positions[index % positions.length];

                    return (
                      <button
                        key={gym.id}
                        type="button"
                        className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all ${
                          selectedGym?.id === gym.id ? "z-20 scale-125" : "z-10"
                        }`}
                        style={{ top: pos.top, left: pos.left }}
                        onClick={() => setSelectedGym(gym)}
                      >
                        <div
                          className={`relative ${
                            selectedGym?.id === gym.id
                              ? "text-primary"
                              : "text-foreground"
                          }`}
                        >
                          <MapPin
                            className={`h-8 w-8 lg:h-10 lg:w-10 ${
                              selectedGym?.id === gym.id
                                ? "fill-primary"
                                : "fill-card"
                            } drop-shadow-lg`}
                          />
                          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                            <Badge
                              variant="secondary"
                              className="text-xs bg-card shadow-md"
                            >
                              R$ {gym.dayUse?.price?.toFixed(0) ?? "—"}
                            </Badge>
                          </div>
                        </div>
                      </button>
                    );
                  })}

                  {/* User Location */}
                  <div
                    className="absolute z-30"
                    style={{ top: "45%", left: "50%" }}
                  >
                    <div className="relative">
                      <div className="absolute -inset-3 bg-blue-500/20 rounded-full animate-ping" />
                      <div className="h-4 w-4 bg-blue-500 rounded-full border-2 border-background shadow-lg" />
                    </div>
                  </div>
                </div>

                {/* Recenter Button */}
                <Button
                  size="icon"
                  className="absolute bottom-24 lg:bottom-8 right-4 z-30 bg-card text-foreground shadow-lg"
                >
                  <Navigation className="h-5 w-5" />
                </Button>

                {/* Selected Gym Card - Mobile */}
                {selectedGym && (
                  <div className="absolute bottom-4 left-4 right-4 z-30 lg:hidden">
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
                  <div className="hidden lg:block absolute bottom-8 left-8 z-30 w-80">
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
                          <span className="line-clamp-1">{selectedGym.address}, {selectedGym.city}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                          <Star className="h-5 w-5 fill-primary text-primary" />
                          <span className="font-semibold text-foreground">
                            {selectedGym.rating.toFixed(1)}
                          </span>
                          <span className="text-muted-foreground text-sm">
                            ({selectedGym.totalReviews} avaliacoes)
                          </span>
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
  );
}
