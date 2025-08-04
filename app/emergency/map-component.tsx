"use client"

import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

interface MapComponentProps {
  userLocation: { lat: number; lng: number; address: string } | null
  hospitals: Array<{
    id: string
    name: string
    distance: string
    phone: string
    emergency: boolean
    address: string
    rating: number
    specialties: string[]
    waitTime: string
    isOpen: boolean
    coordinates: { lat: number; lng: number }
  }>
  pharmacies: Array<{
    id: string
    name: string
    distance: string
    phone: string
    address: string
    isOpen: boolean
    is24h: boolean
    coordinates: { lat: number; lng: number }
  }>
  onHospitalClick?: (hospital: any) => void
  onPharmacyClick?: (pharmacy: any) => void
  className?: string
}

// Fix para los iconos de Leaflet en Next.js
const createCustomIcon = (iconUrl: string) => {
  return L.icon({
    iconUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  })
}

const MapComponent = ({
  userLocation,
  hospitals,
  pharmacies,
  onHospitalClick,
  onPharmacyClick,
  className = "w-full h-64",
}: MapComponentProps) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Crear el mapa
    const map = L.map(mapRef.current).setView([4.6097, -74.0817], 13)
    mapInstanceRef.current = map

    // Agregar capa de OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

    setIsMapLoaded(true)

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!mapInstanceRef.current || !isMapLoaded) return

    const map = mapInstanceRef.current

    // Limpiar marcadores existentes
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer)
      }
    })

    // Agregar marcador de ubicación del usuario
    if (userLocation) {
      const userIcon = L.divIcon({
        className: "custom-user-marker",
        html: `
          <div style="
            background: #3b82f6;
            border: 3px solid white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          ">
            <div style="
              background: white;
              border-radius: 50%;
              width: 8px;
              height: 8px;
            "></div>
          </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      })

      const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(map)
        .bindPopup(`
          <div style="text-align: center; min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; color: #3b82f6; font-weight: bold;">📍 Tu Ubicación</h3>
            <p style="margin: 0; font-size: 14px; color: #666;">${userLocation.address}</p>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #999;">
              Lat: ${userLocation.lat.toFixed(6)}, Lng: ${userLocation.lng.toFixed(6)}
            </p>
          </div>
        `)

      // Centrar mapa en la ubicación del usuario
      map.setView([userLocation.lat, userLocation.lng], 14)
    }

    // Agregar marcadores de hospitales
    hospitals.forEach((hospital) => {
      const hospitalIcon = L.divIcon({
        className: "custom-hospital-marker",
        html: `
          <div style="
            background: ${hospital.emergency ? '#ef4444' : '#f59e0b'};
            border: 2px solid white;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            cursor: pointer;
          ">
            <span style="color: white; font-size: 12px; font-weight: bold;">🏥</span>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      })

      const hospitalMarker = L.marker([hospital.coordinates.lat, hospital.coordinates.lng], { icon: hospitalIcon })
        .addTo(map)
        .bindPopup(`
          <div style="text-align: center; min-width: 250px;">
            <h3 style="margin: 0 0 8px 0; color: ${hospital.emergency ? '#ef4444' : '#f59e0b'}; font-weight: bold;">
              ${hospital.name}
            </h3>
            <div style="margin: 8px 0;">
              <span style="background: ${hospital.isOpen ? '#10b981' : '#6b7280'}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">
                ${hospital.isOpen ? '✅ Abierto' : '❌ Cerrado'}
              </span>
              ${hospital.emergency && '<span style="background: #ef4444; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; margin-left: 4px;">🚨 Emergencias</span>'}
            </div>
            <p style="margin: 4px 0; font-size: 14px; color: #666;">📍 ${hospital.address}</p>
            <p style="margin: 4px 0; font-size: 14px; color: #666;">📞 ${hospital.phone}</p>
            <p style="margin: 4px 0; font-size: 14px; color: #666;">📏 ${hospital.distance} • ⏱️ ${hospital.waitTime}</p>
            <p style="margin: 4px 0; font-size: 14px; color: #666;">⭐ ${hospital.rating}/5.0</p>
            <button onclick="window.hospitalClick && window.hospitalClick('${hospital.id}')" style="
              background: #3b82f6;
              color: white;
              border: none;
              padding: 8px 16px;
              border-radius: 6px;
              cursor: pointer;
              margin-top: 8px;
              font-size: 14px;
            ">
              Ver Detalles
            </button>
          </div>
        `)

      // Agregar evento de clic
      hospitalMarker.on("click", () => {
        if (onHospitalClick) {
          onHospitalClick(hospital)
        }
      })
    })

    // Agregar marcadores de farmacias
    pharmacies.forEach((pharmacy) => {
      const pharmacyIcon = L.divIcon({
        className: "custom-pharmacy-marker",
        html: `
          <div style="
            background: #8b5cf6;
            border: 2px solid white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            cursor: pointer;
          ">
            <span style="color: white; font-size: 10px; font-weight: bold;">💊</span>
          </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      })

      const pharmacyMarker = L.marker([pharmacy.coordinates.lat, pharmacy.coordinates.lng], { icon: pharmacyIcon })
        .addTo(map)
        .bindPopup(`
          <div style="text-align: center; min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; color: #8b5cf6; font-weight: bold;">
              ${pharmacy.name}
            </h3>
            <div style="margin: 8px 0;">
              <span style="background: ${pharmacy.isOpen ? '#10b981' : '#6b7280'}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">
                ${pharmacy.isOpen ? '✅ Abierto' : '❌ Cerrado'}
              </span>
              ${pharmacy.is24h && '<span style="background: #3b82f6; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; margin-left: 4px;">🕐 24h</span>'}
            </div>
            <p style="margin: 4px 0; font-size: 14px; color: #666;">📍 ${pharmacy.address}</p>
            <p style="margin: 4px 0; font-size: 14px; color: #666;">📞 ${pharmacy.phone}</p>
            <p style="margin: 4px 0; font-size: 14px; color: #666;">📏 ${pharmacy.distance}</p>
            <button onclick="window.pharmacyClick && window.pharmacyClick('${pharmacy.id}')" style="
              background: #8b5cf6;
              color: white;
              border: none;
              padding: 8px 16px;
              border-radius: 6px;
              cursor: pointer;
              margin-top: 8px;
              font-size: 14px;
            ">
              Llamar
            </button>
          </div>
        `)

      // Agregar evento de clic
      pharmacyMarker.on("click", () => {
        if (onPharmacyClick) {
          onPharmacyClick(pharmacy)
        }
      })
    })

    // Agregar funciones globales para los popups
    ;(window as any).hospitalClick = (hospitalId: string) => {
      const hospital = hospitals.find(h => h.id === hospitalId)
      if (hospital && onHospitalClick) {
        onHospitalClick(hospital)
      }
    }

    ;(window as any).pharmacyClick = (pharmacyId: string) => {
      const pharmacy = pharmacies.find(p => p.id === pharmacyId)
      if (pharmacy && onPharmacyClick) {
        onPharmacyClick(pharmacy)
      }
    }

  }, [userLocation, hospitals, pharmacies, isMapLoaded, onHospitalClick, onPharmacyClick])

  return (
    <div className={`relative ${className}`}>
      <div ref={mapRef} className="w-full h-full rounded-lg" />
      
      {/* Leyenda del mapa */}
      <div className="absolute top-2 left-2 bg-white bg-opacity-90 p-2 rounded-lg shadow-md text-xs">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span>Tu ubicación</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span>Emergencias</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          <span>Hospitales</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          <span>Farmacias</span>
        </div>
      </div>
    </div>
  )
}

export default MapComponent 