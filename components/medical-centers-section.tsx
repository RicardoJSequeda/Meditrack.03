import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { 
  MapPin, 
  Navigation, 
  Target, 
  PhoneCall, 
  Share2, 
  AlertTriangle, 
  Clock, 
  Star,
  Zap,
  Activity,
  RefreshCw,
  Filter,
  Search,
  Heart,
  Shield,
  Users,
  Car,
  Bike
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface Location {
  lat: number
  lng: number
  address: string
  accuracy?: number
  timestamp: number
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

interface MedicalCentersSectionProps {
  onEmergencyCall?: (center: MedicalCenter) => void
  onShareLocation?: (center: MedicalCenter) => void
  onGetDirections?: (center: MedicalCenter) => void
}

// Cache para ubicación y centros médicos
const locationCache = new Map<string, { data: any; timestamp: number }>()
const centersCache = new Map<string, { data: any; timestamp: number }>()

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos
const LOCATION_CACHE_DURATION = 2 * 60 * 1000 // 2 minutos

export function MedicalCentersSection({ 
  onEmergencyCall, 
  onShareLocation, 
  onGetDirections 
}: MedicalCentersSectionProps) {
  // Estados principales
  const [location, setLocation] = useState<Location | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [centers, setCenters] = useState<MedicalCenter[]>([])
  const [isLoadingCenters, setIsLoadingCenters] = useState(false)
  const [filterType, setFilterType] = useState<'all' | 'hospital' | 'pharmacy'>('all')
  const [sortBy, setSortBy] = useState<'distance' | 'priority' | 'rating'>('distance')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  const [emergencyMode, setEmergencyMode] = useState(false)

  // Estados de optimización
  const [lastLocationUpdate, setLastLocationUpdate] = useState<number>(0)
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null)
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(false)

  // Geolocalización inteligente con cache
  const getLocation = useCallback(async (force = false) => {
    const cacheKey = 'user-location'
    const cached = locationCache.get(cacheKey)
    
    if (!force && cached && Date.now() - cached.timestamp < LOCATION_CACHE_DURATION) {
      setLocation(cached.data)
      return cached.data
    }

    setIsGettingLocation(true)
    setLocationError(null)

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000
        })
      })

      const newLocation: Location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        address: await getAddressFromCoords(position.coords.latitude, position.coords.longitude),
        accuracy: position.coords.accuracy,
        timestamp: Date.now()
      }

      setLocation(newLocation)
      setLocationAccuracy(position.coords.accuracy)
      setLastLocationUpdate(Date.now())
      
      // Cache de ubicación
      locationCache.set(cacheKey, { data: newLocation, timestamp: Date.now() })
      
      return newLocation
    } catch (error) {
      const errorMessage = error instanceof GeolocationPositionError 
        ? getLocationErrorMessage(error.code)
        : 'Error obteniendo ubicación'
      
      setLocationError(errorMessage)
      toast({
        title: "Error de ubicación",
        description: errorMessage,
        variant: "destructive"
      })
      return null
    } finally {
      setIsGettingLocation(false)
    }
  }, [])

  // Obtener dirección desde coordenadas
  const getAddressFromCoords = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      )
      const data = await response.json()
      return data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`
    } catch {
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`
    }
  }

  // Obtener centros médicos con cache y optimización
  const getMedicalCenters = useCallback(async (userLocation: Location) => {
    const cacheKey = `${userLocation.lat.toFixed(3)}-${userLocation.lng.toFixed(3)}-${filterType}`
    const cached = centersCache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setCenters(cached.data)
      return cached.data
    }

    setIsLoadingCenters(true)

    try {
      // Simular API call con datos de ejemplo optimizados
      const mockCenters: MedicalCenter[] = generateMockCenters(userLocation, filterType)
      
      // Aplicar filtros y ordenamiento
      const filteredCenters = applyFiltersAndSorting(mockCenters, searchQuery, sortBy)
      
      setCenters(filteredCenters)
      
      // Cache de centros médicos
      centersCache.set(cacheKey, { data: filteredCenters, timestamp: Date.now() })
      
      return filteredCenters
    } catch (error) {
      toast({
        title: "Error cargando centros médicos",
        description: "No se pudieron cargar los centros médicos cercanos",
        variant: "destructive"
      })
      return []
    } finally {
      setIsLoadingCenters(false)
    }
  }, [filterType, searchQuery, sortBy])

  // Generar centros médicos de ejemplo optimizados
  const generateMockCenters = (userLocation: Location, type: string): MedicalCenter[] => {
    const baseCenters = [
      {
        id: '1',
        name: 'Hospital Central de Emergencias',
        type: 'hospital' as const,
        address: 'Calle 123 #45-67, Centro Médico, Bogotá',
        phone: '+57 300 123 4567',
        coordinates: { lat: userLocation.lat + 0.001, lng: userLocation.lng + 0.001 },
        isOpen: true,
        is24h: true,
        emergency: true,
        rating: 4.8,
        specialties: ['Trauma', 'Cardiología', 'Neurología', 'Emergencias'],
        waitTime: '15-30 min',
        priority: 10
      },
      {
        id: '2',
        name: 'Clínica San José',
        type: 'hospital' as const,
        address: 'Avenida 68 #45-67, Chapinero, Bogotá',
        phone: '+57 310 987 6543',
        coordinates: { lat: userLocation.lat + 0.002, lng: userLocation.lng - 0.001 },
        isOpen: true,
        is24h: false,
        emergency: false,
        rating: 4.5,
        specialties: ['Medicina General', 'Ginecología', 'Ortopedia'],
        waitTime: '45-60 min',
        priority: 7
      },
      {
        id: '3',
        name: 'Farmacia 24 Horas',
        type: 'pharmacy' as const,
        address: 'Carrera 15 #93-47, Bogotá',
        phone: '+57 315 555 1234',
        coordinates: { lat: userLocation.lat - 0.001, lng: userLocation.lng + 0.002 },
        isOpen: true,
        is24h: true,
        emergency: false,
        rating: 4.2,
        specialties: ['Medicamentos', 'Primeros auxilios'],
        waitTime: '5-10 min',
        priority: 5
      },
      {
        id: '4',
        name: 'Centro Médico Especializado',
        type: 'hospital' as const,
        address: 'Calle 85 #12-34, Zona T, Bogotá',
        phone: '+57 320 444 5678',
        coordinates: { lat: userLocation.lat + 0.003, lng: userLocation.lng + 0.003 },
        isOpen: false,
        is24h: false,
        emergency: true,
        rating: 4.6,
        specialties: ['Dermatología', 'Oftalmología', 'Odontología'],
        waitTime: '30-45 min',
        priority: 8
      }
    ]

    return baseCenters
      .filter(center => type === 'all' || center.type === type)
      .map(center => ({
        ...center,
        distance: calculateDistance(userLocation, center.coordinates),
        eta: calculateETA(calculateDistance(userLocation, center.coordinates))
      }))
  }

  // Calcular distancia entre dos puntos
  const calculateDistance = (point1: Location, point2: { lat: number; lng: number }): number => {
    const R = 6371 // Radio de la Tierra en km
    const dLat = (point2.lat - point1.lat) * Math.PI / 180
    const dLng = (point2.lng - point1.lng) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  // Calcular tiempo estimado de llegada
  const calculateETA = (distance: number): string => {
    const avgSpeed = 30 // km/h en ciudad
    const timeInMinutes = Math.round((distance / avgSpeed) * 60)
    
    if (timeInMinutes < 5) return '<5 min'
    if (timeInMinutes < 15) return '5-15 min'
    if (timeInMinutes < 30) return '15-30 min'
    if (timeInMinutes < 60) return '30-60 min'
    return '>60 min'
  }

  // Aplicar filtros y ordenamiento
  const applyFiltersAndSorting = (
    centers: MedicalCenter[], 
    query: string, 
    sortBy: string
  ): MedicalCenter[] => {
    let filtered = centers

    // Filtro por búsqueda
    if (query) {
      filtered = filtered.filter(center =>
        center.name.toLowerCase().includes(query.toLowerCase()) ||
        center.address.toLowerCase().includes(query.toLowerCase()) ||
        center.specialties.some(specialty => 
          specialty.toLowerCase().includes(query.toLowerCase())
        )
      )
    }

    // Ordenamiento
    switch (sortBy) {
      case 'distance':
        filtered.sort((a, b) => a.distance - b.distance)
        break
      case 'priority':
        filtered.sort((a, b) => b.priority - a.priority)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
    }

    return filtered
  }

  // Mensajes de error de geolocalización
  const getLocationErrorMessage = (code: number): string => {
    switch (code) {
      case 1: return 'Acceso denegado a la ubicación'
      case 2: return 'Ubicación no disponible'
      case 3: return 'Tiempo de espera agotado'
      default: return 'Error desconocido'
    }
  }

  // Auto-refresh de ubicación
  useEffect(() => {
    if (location && !emergencyMode) {
      const interval = setInterval(() => {
        const timeSinceUpdate = Date.now() - lastLocationUpdate
        if (timeSinceUpdate > 5 * 60 * 1000) { // 5 minutos
          getLocation(true)
        }
      }, 60000) // Verificar cada minuto

      return () => clearInterval(interval)
    }
  }, [location, lastLocationUpdate, emergencyMode, getLocation])

  // Cargar centros médicos cuando cambie la ubicación
  useEffect(() => {
    if (location) {
      getMedicalCenters(location)
    }
  }, [location, filterType, searchQuery, sortBy, getMedicalCenters])

  // Cargar ubicación inicial
  useEffect(() => {
    getLocation()
  }, [getLocation])

  // Modo emergencia
  const activateEmergencyMode = () => {
    setEmergencyMode(true)
    getLocation(true) // Forzar actualización de ubicación
    toast({
      title: "Modo emergencia activado",
      description: "Mostrando centros médicos más cercanos",
    })
  }

  // Componente de centro médico optimizado
  const MedicalCenterCard = ({ center }: { center: MedicalCenter }) => {
    const priorityColor = center.priority >= 8 ? 'red' : center.priority >= 5 ? 'orange' : 'blue'
    
    return (
      <Card className={`border-${priorityColor}-200 hover:shadow-lg transition-all duration-200`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h5 className="font-semibold text-gray-900">{center.name}</h5>
                {center.emergency && (
                  <Badge variant="destructive" className="text-xs">
                    🚨 Emergencias
                  </Badge>
                )}
                {center.isOpen ? (
                  <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                    ✅ Abierto
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">
                    ❌ Cerrado
                  </Badge>
                )}
                {center.is24h && (
                  <Badge variant="outline" className="text-xs">
                    24h
                  </Badge>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-1">📍 {center.address}</p>
              <p className="text-sm text-gray-500 mb-2">📞 {center.phone}</p>
              
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                <span>📏 {center.distance.toFixed(1)} km</span>
                <span>⏱️ {center.eta}</span>
                <span>⭐ {center.rating}/5.0</span>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {center.specialties.slice(0, 3).map((specialty, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
                {center.specialties.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{center.specialties.length - 3} más
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex flex-col gap-2 ml-4">
              <Button
                size="sm"
                onClick={() => onEmergencyCall?.(center)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <PhoneCall className="w-3 h-3 mr-1" />
                Llamar
              </Button>
              
              <Button
                size="sm"
                onClick={() => onGetDirections?.(center)}
                variant="outline"
                className="border-green-300 text-green-700 hover:bg-green-50"
              >
                <Navigation className="w-3 h-3 mr-1" />
                Ruta
              </Button>
              
              <Button
                size="sm"
                onClick={() => onShareLocation?.(center)}
                variant="outline"
                className="border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                <Share2 className="w-3 h-3 mr-1" />
                Compartir
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-500" />
              Ubicación y Centros Médicos
            </CardTitle>
            <CardDescription>
              Tu posición actual y servicios médicos más cercanos
            </CardDescription>
          </div>
          
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => getLocation(true)}
              disabled={isGettingLocation}
              className="border-green-300 text-green-700 hover:bg-green-50"
            >
              {isGettingLocation ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Navigation className="w-4 h-4" />
              )}
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={activateEmergencyMode}
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              <Zap className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Ubicación Actual Optimizada */}
        {location ? (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 p-4 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-green-800 flex items-center gap-2 mb-3">
                  <Navigation className="w-4 h-4" />
                  📍 Ubicación Actual
                </h4>
                <p className="text-green-700 text-sm mb-2 font-medium">{location.address}</p>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-green-600">Latitud: {location.lat.toFixed(6)}</p>
                    <p className="text-green-600">Longitud: {location.lng.toFixed(6)}</p>
                  </div>
                  <div>
                    <p className="text-green-600">
                      Precisión: ±{locationAccuracy ? Math.round(locationAccuracy) : 'N/A'}m
                    </p>
                    <p className="text-green-500">
                      Actualizado: {new Date(lastLocationUpdate).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <Button
                  size="sm"
                  onClick={() => onShareLocation?.(centers[0])}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Share2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div className="flex-1">
                <p className="font-medium text-yellow-900">Ubicación no disponible</p>
                <p className="text-sm text-yellow-700">{locationError || "Activando GPS..."}</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="mt-3 w-full bg-transparent border-yellow-300 text-yellow-700 hover:bg-yellow-100"
              onClick={() => getLocation(true)}
              disabled={isGettingLocation}
            >
              {isGettingLocation ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Obteniendo ubicación...
                </div>
              ) : (
                "🔄 Intentar Nuevamente"
              )}
            </Button>
          </div>
        )}

        <Separator />

        {/* Filtros y Búsqueda Optimizados */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={filterType === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterType('all')}
              className={filterType === 'all' ? 'bg-purple-600 hover:bg-purple-700' : ''}
            >
              🏥 Todos ({centers.length})
            </Button>
            <Button
              size="sm"
              variant={filterType === 'hospital' ? 'default' : 'outline'}
              onClick={() => setFilterType('hospital')}
              className={filterType === 'hospital' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              🏥 Hospitales ({centers.filter(c => c.type === 'hospital').length})
            </Button>
            <Button
              size="sm"
              variant={filterType === 'pharmacy' ? 'default' : 'outline'}
              onClick={() => setFilterType('pharmacy')}
              className={filterType === 'pharmacy' ? 'bg-blue-600 hover:bg-blue-700' : ''}
            >
              💊 Farmacias ({centers.filter(c => c.type === 'pharmacy').length})
            </Button>
          </div>

          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar centros médicos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Ordenar por..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="distance">📏 Distancia</SelectItem>
                <SelectItem value="priority">⭐ Prioridad</SelectItem>
                <SelectItem value="rating">🏆 Calificación</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Lista de Centros Médicos Optimizada */}
        {isLoadingCenters ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-32 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : centers.length > 0 ? (
          <div className="space-y-3">
            {centers.map((center) => (
              <MedicalCenterCard key={center.id} center={center} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No se encontraron centros médicos cercanos</p>
            <p className="text-sm">Intenta ampliar el radio de búsqueda</p>
          </div>
        )}

        {/* Modo Emergencia */}
        {emergencyMode && centers.length > 0 && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-2">
              🚨 CENTRO MÉDICO MÁS CERCANO
            </h4>
            <MedicalCenterCard center={centers[0]} />
          </div>
        )}
      </CardContent>
    </Card>
  )
} 