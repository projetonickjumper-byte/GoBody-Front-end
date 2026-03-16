"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Heart, MapPin, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { favoritesService } from "@/lib/api/services/favorites.service";
import { AppShell } from "@/components/app-shell";
import type { Gym } from "@/lib/types";

export default function FavoritosPage() {
  const [favoriteGyms, setFavoriteGyms] = useState<Gym[]>([]);

  useEffect(() => {
    async function loadFavorites() {
      try {
        const res = await favoritesService.getAll();
        if (res.success && res.data) {
          setFavoriteGyms(res.data);
        }
      } catch (error) {
        console.error("Erro ao carregar favoritos:", error);
      }
    }
    loadFavorites();
  }, []);

  const handleRemoveFavorite = async (gymId: string) => {
    try {
      await favoritesService.remove(gymId);
      setFavoriteGyms(prev => prev.filter(g => g.id !== gymId));
    } catch (error) {
      console.error("Erro ao remover favorito:", error);
    }
  };
  return (
    <AppShell>
      <div className="min-h-screen bg-background pb-20 lg:pb-6">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="flex items-center gap-4 p-4 max-w-4xl mx-auto">
            <Link href="/perfil" className="lg:hidden">
              <Button variant="ghost" size="icon" className="shrink-0">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Favoritos</h1>
          </div>
        </div>

        {/* Favorites Count */}
        <div className="p-4 max-w-4xl mx-auto">
          <div className="bg-card rounded-xl p-4 border border-border flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center">
              <Heart className="h-6 w-6 text-red-500 fill-red-500" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Academias Favoritas</p>
              <p className="text-2xl font-bold text-foreground">{favoriteGyms.length}</p>
            </div>
          </div>
        </div>

        {/* Favorites List */}
        <div className="px-4 max-w-4xl mx-auto grid gap-4 sm:grid-cols-2">
          {favoriteGyms.map((gym) => (
            <div
              key={gym.id}
              className="bg-card rounded-xl overflow-hidden border border-border"
            >
              <div className="relative h-32">
                <Image
                  src={gym.images[0] || "/placeholder.svg"}
                  alt={gym.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                <div className="absolute top-3 right-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 bg-background/50 hover:bg-background/70"
                  >
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </Button>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="font-semibold text-foreground truncate">{gym.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="truncate">{gym.address}</span>
                  </div>
                </div>
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span className="font-medium text-foreground">{gym.rating}</span>
                    </div>
                    <span className="text-muted-foreground text-sm">
                      ({gym.reviewCount} avaliações)
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {gym.distance}
                  </Badge>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div>
                    <span className="text-muted-foreground text-xs">A partir de</span>
                    <p className="text-primary font-bold">
                      R$ {gym.dayUse?.price?.toFixed(2).replace(".", ",") ?? "—"}
                      <span className="text-xs font-normal text-muted-foreground">
                        {" "}
                        /day use
                      </span>
                    </p>
                  </div>
                  <Link href={`/academia/${gym.slug}`}>
                    <Button size="sm" className="bg-primary text-primary-foreground">
                      Ver detalhes
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {favoriteGyms.length === 0 && (
            <div className="text-center py-12 sm:col-span-2">
              <Heart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">
                Você ainda não tem academias favoritas
              </p>
              <Link href="/">
                <Button variant="outline" className="mt-4 bg-transparent">
                  Explorar academias
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
