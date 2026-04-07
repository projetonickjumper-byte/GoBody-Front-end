"use client"

import dynamic from "next/dynamic"
import type { MapMarker } from "./leaflet-map"

// Dynamic import para evitar SSR (Leaflet precisa de window/document)
const LeafletMap = dynamic(() => import("./leaflet-map"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full min-h-[300px] bg-secondary rounded-lg">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Carregando mapa...</p>
      </div>
    </div>
  ),
})

export { LeafletMap }
export type { MapMarker }
