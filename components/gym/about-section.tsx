"use client"

import React from "react"

import { useState } from "react"
import {
  Clock,
  Wifi,
  Car,
  Droplets,
  Wind,
  Lock,
  Coffee,
  ChevronDown,
  ChevronUp,
  MapPin,
  ExternalLink,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LeafletMap, type MapMarker } from "@/components/dynamic-map"
import type { Gym, GymClass } from "@/lib/types"

interface AboutSectionProps {
  gym: Gym
  classes: GymClass[]
}

const amenityIcons: Record<string, React.ElementType> = {
  "Ar condicionado": Wind,
  "Wi-Fi": Wifi,
  Estacionamento: Car,
  Agua: Droplets,
  "Agua gratuita": Droplets,
  Vestiarios: Lock,
  Armarios: Lock,
  Cafe: Coffee,
  Loja: Coffee,
}

const dayNames: Record<string, string> = {
  monday: "Segunda",
  tuesday: "Terca",
  wednesday: "Quarta",
  thursday: "Quinta",
  friday: "Sexta",
  saturday: "Sabado",
  sunday: "Domingo",
}

export function AboutSection({ gym, classes }: AboutSectionProps) {
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [showAllHours, setShowAllHours] = useState(false)

  const description = gym.description
  const shouldTruncate = description.length > 200

  return (
    <section id="sobre" className="space-y-6">
      <h2 className="text-xl font-bold text-foreground">Sobre a Academia</h2>

      {/* Description */}
      <div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {shouldTruncate && !showFullDescription
            ? `${description.slice(0, 200)}...`
            : description}
        </p>
        {shouldTruncate && (
          <Button
            variant="link"
            size="sm"
            className="px-0 h-auto text-primary"
            onClick={() => setShowFullDescription(!showFullDescription)}
          >
            {showFullDescription ? "Ver menos" : "Ver mais"}
          </Button>
        )}
      </div>

      {/* Opening Hours */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Horarios de Funcionamento
            </CardTitle>
            <Badge variant={gym.isOpen ? "default" : "destructive"}>
              {gym.isOpen ? "Aberto" : "Fechado"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(gym.openingHours)
              .slice(0, showAllHours ? undefined : 3)
              .map(([day, hours]) => (
                <div key={day} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{dayNames[day]}</span>
                  <span className={hours ? "text-foreground" : "text-muted-foreground"}>
                    {hours ? `${hours.open} - ${hours.close}` : "Fechado"}
                  </span>
                </div>
              ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-2"
            onClick={() => setShowAllHours(!showAllHours)}
          >
            {showAllHours ? (
              <>
                <ChevronUp className="mr-2 h-4 w-4" />
                Ver menos
              </>
            ) : (
              <>
                <ChevronDown className="mr-2 h-4 w-4" />
                Ver todos os horarios
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Amenities */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Infraestrutura e Comodidades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {gym.amenities.map((amenity) => {
              const Icon = amenityIcons[amenity] || Lock
              return (
                <div
                  key={amenity}
                  className="flex items-center gap-2 rounded-lg bg-secondary p-3"
                >
                  <Icon className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm text-foreground">{amenity}</span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Location Map */}
      {gym.latitude && gym.longitude && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Localização
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs gap-1 text-muted-foreground"
                asChild
              >
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${gym.latitude},${gym.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Abrir no Google Maps
                </a>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg overflow-hidden border border-border" style={{ height: "220px" }}>
              <LeafletMap
                markers={[
                  {
                    id: gym.id,
                    lat: gym.latitude,
                    lng: gym.longitude,
                    title: gym.name,
                    subtitle: `${gym.address}, ${gym.city}`,
                    rating: gym.rating,
                    slug: gym.slug,
                  },
                ]}
                center={[gym.latitude, gym.longitude]}
                zoom={15}
                showUserLocation={false}
                className="h-full w-full"
                minHeight="220px"
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {gym.address}, {gym.city} - {gym.state}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Classes Schedule */}
      {classes.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Aulas Coletivas - Segunda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {classes.map((cls) => (
                <div
                  key={cls.id}
                  className="flex items-center justify-between rounded-lg bg-secondary p-3"
                >
                  <div>
                    <p className="font-medium text-foreground">{cls.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {cls.instructor} - {cls.duration}min
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">{cls.time}</p>
                    <p
                      className={cn(
                        "text-xs",
                        cls.spotsAvailable > 0
                          ? "text-green-500"
                          : "text-destructive"
                      )}
                    >
                      {cls.spotsAvailable > 0
                        ? `${cls.spotsAvailable} vagas`
                        : "Lotado"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 bg-transparent">
              Ver agenda completa
            </Button>
          </CardContent>
        </Card>
      )}
    </section>
  )
}
