import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  MapPin, 
  Navigation, 
  Target, 
  PhoneCall, 
  Share2, 
  Maximize2,
  Minimize2,
  Eye,
  EyeOff,
  Layers,
  RefreshCw,
  AlertTriangle,
  Car,
  Bike
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface Location {
  lat: number
  lng: number
  address: string
  accuracy?: number
  timestamp?: number
}

interface MedicalCenter {
  id: string
  name: string
  type: 'hospital' | 'pharmacy' | 'clinic'
  address: string
  phone: string
  coordinates: { lat: number; lng: number }
  distance: number
  eta: string
  isOpen: boolean
  is24h: boolean
  emergency: boolean
  rating: number
  specialties: string[]
  waitTime: string
  priority: number
}

interface EmergencyMapProps {
  userLocation: Location | null
  medicalCenters: MedicalCenter[]
  onCenterClick?: (center: MedicalCenter) => void
  onGetDirections?: (center: MedicalCenter) => void
  onCallCenter?: (center: MedicalCenter) => void
  onShareLocation?: (center: MedicalCenter) => void
}

export function EmergencyMap({
  userLocation,
  medicalCenters,
  onCenterClick,
  onGetDirections,
  onCallCenter,
  onShareLocation
}: EmergencyMapProps) {
  const [isMapExpanded, setIsMapExpanded] = useState(false)
  const [showHospitals, setShowHospitals] = useState(true)
  const [showPharmacies, setShowPharmacies] = useState(true)
  const [showUserLocation, setShowUserLocation] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  // Filtrar centros médicos según configuración
  const filteredCenters = medicalCenters.filter(center => {
    if (center.type === 'hospital' && !showHospitals) return false
    if (center.type === 'pharmacy' && !showPharmacies) return false
    return true
  })

  // Generar URL del mapa de OpenStreetMap
  const generateMapUrl = () => {
    if (!userLocation) return null

    const baseUrl = 'https://www.openstreetmap.org/export/embed.html'
    const params = new URLSearchParams({
      bbox: `${userLocation.lng - 0.01},${userLocation.lat - 0.01},${userLocation.lng + 0.01},${userLocation.lat + 0.01}`,
      layer: 'mapnik',
      marker: `${userLocation.lat},${userLocation.lng}`
    })

    return `${baseUrl}?${params.toString()}`
  }

  // Abrir mapa en nueva ventana
  const openMapInNewWindow = () => {
    if (!userLocation) {
      toast({
        title: "Ubicación no disponible",
        description: "No se puede abrir el mapa sin ubicación",
        variant: "destructive"
      })
      return
    }

    const mapUrl = `https://www.openstreetmap.org/#map=15/${userLocation.lat}/${userLocation.lng}`
    window.open(mapUrl, '_blank')
  }

  // Centros médicos agrupados por tipo
  const hospitals = filteredCenters.filter(c => c.type === 'hospital')
  const pharmacies = filteredCenters.filter(c => c.type === 'pharmacy')

  return (
    <Card className={`transition-all duration-300 ${isMapExpanded ? 'col-span-2' : ''}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-500" />
              🗺️ Mapa de Centros Médicos
            </CardTitle>
            <CardDescription>
              Tu ubicación y centros médicos más cercanos
            </CardDescription>
          </div>
          
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowUserLocation(!showUserLocation)}
              className={`border-blue-300 ${showUserLocation ? 'bg-blue-50 text-blue-700' : 'text-gray-500'}`}
            >
              <Target className="w-4 h-4" />
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowHospitals(!showHospitals)}
              className={`border-red-300 ${showHospitals ? 'bg-red-50 text-red-700' : 'text-gray-500'}`}
            >
              🏥
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowPharmacies(!showPharmacies)}
              className={`border-blue-300 ${showPharmacies ? 'bg-blue-50 text-blue-700' : 'text-gray-500'}`}
            >
              💊
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsMapExpanded(!isMapExpanded)}
              className="border-green-300 text-green-700 hover:bg-green-50"
            >
              {isMapExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Mapa Interactivo */}
        <div className="relative">
          <div 
            ref={mapContainerRef}
            className={`bg-gray-100 border-2 border-gray-200 rounded-lg overflow-hidden transition-all duration-300 ${
              isMapExpanded ? 'h-96' : 'h-64'
            }`}
          >
            {userLocation ? (
              <div className="relative w-full h-full">
                {/* Mapa de OpenStreetMap */}
                <iframe
                  src={generateMapUrl() || ''}
                  className="w-full h-full border-0"
                  title="Mapa de centros médicos"
                  loading="lazy"
                />
                
                {/* Overlay con información */}
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium">Tu ubicación</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {userLocation.address.split(',')[0]}
                  </p>
                </div>
                
                {/* Contadores de centros */}
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
                  <div className="text-xs space-y-1">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>🏥 {hospitals.length}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>💊 {pharmacies.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>Ubicación no disponible</p>
                  <p className="text-sm">Activa el GPS para ver el mapa</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Botones de acción del mapa */}
          <div className="absolute bottom-2 left-2 flex gap-2">
            <Button
              size="sm"
              onClick={openMapInNewWindow}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
            >
              <Layers className="w-3 h-3 mr-1" />
              Abrir Mapa
            </Button>
          </div>
        </div>

        {/* Información de centros médicos */}
        {userLocation && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900">Centros Médicos Cercanos</h4>
              <Badge variant="outline" className="text-xs">
                {filteredCenters.length} encontrados
              </Badge>
            </div>
            
            {/* Lista de centros más cercanos */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {filteredCenters.slice(0, 3).map((center) => (
                <div
                  key={center.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => onCenterClick?.(center)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{center.name}</span>
                      {center.emergency && (
                        <Badge variant="destructive" className="text-xs">
                          🚨
                        </Badge>
                      )}
                      {center.isOpen ? (
                        <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                          ✅
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          ❌
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-600">{center.address}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <span>📏 {center.distance.toFixed(1)} km</span>
                      <span>⏱️ {center.eta}</span>
                      <span>⭐ {center.rating}/5.0</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onCallCenter?.(center)
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <PhoneCall className="w-3 h-3" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        onGetDirections?.(center)
                      }}
                      className="border-blue-300 text-blue-700 hover:bg-blue-50"
                    >
                      <Navigation className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {filteredCenters.length > 3 && (
                <div className="text-center py-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsMapExpanded(true)}
                    className="text-xs"
                  >
                    Ver {filteredCenters.length - 3} centros más
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Leyenda del mapa */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <h5 className="font-medium text-sm mb-2">Leyenda del Mapa</h5>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Tu ubicación</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Hospitales</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Farmacias</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span>Emergencias</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 