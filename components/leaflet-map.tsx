"use client"

import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// ==========================================
// TIPOS
// ==========================================
export interface MapMarker {
  id: string
  lat: number
  lng: number
  title: string
  subtitle?: string
  price?: string
  rating?: number
  image?: string
  slug?: string
}

interface LeafletMapProps {
  markers: MapMarker[]
  center?: [number, number]
  zoom?: number
  selectedMarkerId?: string | null
  onMarkerClick?: (marker: MapMarker) => void
  onMapClick?: () => void
  showUserLocation?: boolean
  userLocation?: [number, number] | null
  className?: string
  minHeight?: string
}

// ==========================================
// ÍCONE CUSTOMIZADO DO MARCADOR
// ==========================================
function createGymIcon(isSelected: boolean) {
  return L.divIcon({
    className: "custom-gym-marker",
    html: `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        width: ${isSelected ? "44px" : "36px"};
        height: ${isSelected ? "44px" : "36px"};
        background: ${isSelected ? "hsl(24, 95%, 53%)" : "hsl(0, 0%, 9%)"};
        border: 3px solid ${isSelected ? "hsl(24, 95%, 53%)" : "hsl(0, 0%, 20%)"};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        transition: all 0.2s ease;
      ">
        <svg style="transform: rotate(45deg); width: ${isSelected ? "20px" : "16px"}; height: ${isSelected ? "20px" : "16px"};" viewBox="0 0 24 24" fill="none" stroke="${isSelected ? "white" : "hsl(24, 95%, 53%)"}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
          <line x1="6" y1="1" x2="6" y2="4"/>
          <line x1="10" y1="1" x2="10" y2="4"/>
          <line x1="14" y1="1" x2="14" y2="4"/>
        </svg>
      </div>
    `,
    iconSize: [isSelected ? 44 : 36, isSelected ? 44 : 36],
    iconAnchor: [isSelected ? 22 : 18, isSelected ? 44 : 36],
    popupAnchor: [0, -44],
  })
}

function createUserIcon() {
  return L.divIcon({
    className: "custom-user-marker",
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center;">
        <div style="
          position: absolute;
          width: 40px;
          height: 40px;
          background: rgba(59, 130, 246, 0.2);
          border-radius: 50%;
          animation: pulse 2s infinite;
        "></div>
        <div style="
          width: 16px;
          height: 16px;
          background: #3b82f6;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          z-index: 1;
        "></div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  })
}

// ==========================================
// CSS INLINE PARA ANIMAÇÃO
// ==========================================
const LEAFLET_CUSTOM_CSS = `
  .custom-gym-marker, .custom-user-marker {
    background: transparent !important;
    border: none !important;
  }
  @keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.5); opacity: 0.5; }
    100% { transform: scale(2); opacity: 0; }
  }
  .leaflet-popup-content-wrapper {
    background: hsl(0, 0%, 9%) !important;
    color: white !important;
    border-radius: 12px !important;
    border: 1px solid hsl(0, 0%, 20%) !important;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4) !important;
    padding: 0 !important;
  }
  .leaflet-popup-tip {
    background: hsl(0, 0%, 9%) !important;
    border: 1px solid hsl(0, 0%, 20%) !important;
  }
  .leaflet-popup-close-button {
    color: white !important;
    font-size: 18px !important;
    top: 8px !important;
    right: 8px !important;
  }
  .leaflet-control-zoom {
    border: none !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
  }
  .leaflet-control-zoom a {
    background: hsl(0, 0%, 9%) !important;
    color: white !important;
    border: 1px solid hsl(0, 0%, 20%) !important;
  }
  .leaflet-control-zoom a:hover {
    background: hsl(0, 0%, 15%) !important;
  }
  .leaflet-control-attribution {
    background: hsl(0, 0%, 9%, 0.8) !important;
    color: hsl(0, 0%, 50%) !important;
    font-size: 10px !important;
  }
  .leaflet-control-attribution a {
    color: hsl(24, 95%, 53%) !important;
  }
`

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
export default function LeafletMap({
  markers,
  center,
  zoom = 13,
  selectedMarkerId,
  onMarkerClick,
  onMapClick,
  showUserLocation = true,
  userLocation,
  className = "",
  minHeight = "100%",
}: LeafletMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const markersLayerRef = useRef<L.LayerGroup | null>(null)
  const userMarkerRef = useRef<L.Marker | null>(null)
  const [currentUserLocation, setCurrentUserLocation] = useState<[number, number] | null>(
    userLocation || null
  )

  // Obter localização do usuário
  useEffect(() => {
    if (showUserLocation && !userLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCurrentUserLocation([pos.coords.latitude, pos.coords.longitude])
        },
        () => {
          // Fallback: São Paulo centro
          setCurrentUserLocation([-23.5505, -46.6333])
        },
        { enableHighAccuracy: true, timeout: 10000 }
      )
    }
  }, [showUserLocation, userLocation])

  // Inicializar mapa
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    // Injetar CSS customizado
    if (!document.getElementById("leaflet-custom-css")) {
      const style = document.createElement("style")
      style.id = "leaflet-custom-css"
      style.textContent = LEAFLET_CUSTOM_CSS
      document.head.appendChild(style)
    }

    const defaultCenter = center || currentUserLocation || [-23.5505, -46.6333]

    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom,
      zoomControl: true,
      attributionControl: true,
    })

    // Tile layer estilo escuro (combina com o tema dark do app)
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map)

    // Layer de marcadores
    markersLayerRef.current = L.layerGroup().addTo(map)

    // Evento de click no mapa
    map.on("click", () => {
      onMapClick?.()
    })

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [currentUserLocation]) // Re-criar se a localização do usuário mudar

  // Atualizar marcadores quando mudarem
  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current) return

    markersLayerRef.current.clearLayers()

    markers.forEach((marker) => {
      if (!marker.lat || !marker.lng) return

      const isSelected = marker.id === selectedMarkerId
      const icon = createGymIcon(isSelected)

      const leafletMarker = L.marker([marker.lat, marker.lng], { icon })
        .on("click", () => {
          onMarkerClick?.(marker)
        })

      // Popup com informações
      const popupContent = `
        <div style="padding: 12px; min-width: 200px;">
          <h3 style="font-size: 14px; font-weight: 600; margin: 0 0 4px 0; color: white;">
            ${marker.title}
          </h3>
          ${marker.subtitle ? `<p style="font-size: 12px; color: hsl(0,0%,60%); margin: 0 0 8px 0;">${marker.subtitle}</p>` : ""}
          <div style="display: flex; align-items: center; justify-content: space-between;">
            ${marker.rating ? `
              <span style="display: flex; align-items: center; gap: 4px; font-size: 12px; color: hsl(24,95%,53%);">
                ★ ${marker.rating.toFixed(1)}
              </span>
            ` : ""}
            ${marker.price ? `
              <span style="font-weight: 700; color: hsl(24,95%,53%); font-size: 14px;">
                ${marker.price}
              </span>
            ` : ""}
          </div>
          ${marker.slug ? `
            <a href="/academia/${marker.slug}" style="
              display: block;
              text-align: center;
              margin-top: 8px;
              padding: 6px 12px;
              background: hsl(24,95%,53%);
              color: white;
              border-radius: 8px;
              text-decoration: none;
              font-size: 12px;
              font-weight: 600;
            ">Ver detalhes</a>
          ` : ""}
        </div>
      `

      leafletMarker.bindPopup(popupContent, {
        closeButton: true,
        className: "custom-popup",
      })

      if (isSelected) {
        leafletMarker.openPopup()
      }

      leafletMarker.addTo(markersLayerRef.current!)
    })
  }, [markers, selectedMarkerId, onMarkerClick])

  // Marcador do usuário
  useEffect(() => {
    if (!mapRef.current) return

    const loc = userLocation || currentUserLocation
    if (!loc || !showUserLocation) return

    if (userMarkerRef.current) {
      userMarkerRef.current.remove()
    }

    userMarkerRef.current = L.marker(loc, { icon: createUserIcon() })
      .bindPopup('<div style="padding: 8px; text-align: center; color: white;"><b>Você está aqui</b></div>')
      .addTo(mapRef.current)
  }, [currentUserLocation, userLocation, showUserLocation])

  // Centralizar no marcador selecionado
  useEffect(() => {
    if (!mapRef.current || !selectedMarkerId) return

    const marker = markers.find((m) => m.id === selectedMarkerId)
    if (marker?.lat && marker?.lng) {
      mapRef.current.flyTo([marker.lat, marker.lng], 15, { duration: 0.5 })
    }
  }, [selectedMarkerId, markers])

  // Ajustar bounds para mostrar todos os marcadores
  useEffect(() => {
    if (!mapRef.current || markers.length === 0) return

    // Se não tem centro definido e tem marcadores, ajustar view
    if (!center && !selectedMarkerId) {
      const validMarkers = markers.filter((m) => m.lat && m.lng)
      if (validMarkers.length > 0) {
        const bounds = L.latLngBounds(validMarkers.map((m) => [m.lat, m.lng]))
        if (currentUserLocation) {
          bounds.extend(currentUserLocation)
        }
        mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 })
      }
    }
  }, [markers, center, currentUserLocation])

  // Método público para recentrar
  const recenter = () => {
    if (!mapRef.current) return
    const loc = userLocation || currentUserLocation
    if (loc) {
      mapRef.current.flyTo(loc, 14, { duration: 0.5 })
    }
  }

  return (
    <div
      ref={mapContainerRef}
      className={className}
      style={{ minHeight, width: "100%", height: "100%" }}
    />
  )
}
