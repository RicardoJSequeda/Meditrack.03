import { useState, useEffect, useCallback, useMemo } from 'react'
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

interface MedicalCentersState {
  centers: MedicalCenter[]
  isLoading: boolean
  error: string | null
  lastUpdate: number
}

// Cache para centros médicos
const centersCache = new Map<string, { data: MedicalCenter[]; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

export function useMedicalCenters(location: Location | null, filterType: string = 'all') {
  const [state, setState] = useState<MedicalCentersState>({
    centers: [],
    isLoading: false,
    error: null,
    lastUpdate: 0
  })

  // Calcular distancia entre dos puntos
  const calculateDistance = useCallback((point1: Location, point2: { lat: number; lng: number }): number => {
    const R = 6371 // Radio de la Tierra en km
    const dLat = (point2.lat - point1.lat) * Math.PI / 180
    const dLng = (point2.lng - point1.lng) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }, [])

  // Calcular tiempo estimado de llegada
  const calculateETA = useCallback((distance: number): string => {
    const avgSpeed = 30 // km/h en ciudad
    const timeInMinutes = Math.round((distance / avgSpeed) * 60)
    
    if (timeInMinutes < 5) return '<5 min'
    if (timeInMinutes < 15) return '5-15 min'
    if (timeInMinutes < 30) return '15-30 min'
    if (timeInMinutes < 60) return '30-60 min'
    return '>60 min'
  }, [])

  // Generar centros médicos de ejemplo optimizados
  const generateMockCenters = useCallback((userLocation: Location, type: string): MedicalCenter[] => {
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
      },
      {
        id: '5',
        name: 'Hospital Universitario',
        type: 'hospital' as const,
        address: 'Carrera 78 #90-12, Campus Universitario, Bogotá',
        phone: '+57 315 555 1234',
        coordinates: { lat: userLocation.lat + 0.004, lng: userLocation.lng - 0.002 },
        isOpen: true,
        is24h: true,
        emergency: true,
        rating: 4.9,
        specialties: ['Oncología', 'Transplantes', 'Investigación', 'Emergencias'],
        waitTime: '10-20 min',
        priority: 9
      },
      {
        id: '6',
        name: 'Farmacia San José',
        type: 'pharmacy' as const,
        address: 'Avenida 68 #45-67, Chapinero, Bogotá',
        phone: '+57 310 987 6543',
        coordinates: { lat: userLocation.lat - 0.002, lng: userLocation.lng - 0.003 },
        isOpen: true,
        is24h: false,
        emergency: false,
        rating: 4.3,
        specialties: ['Medicamentos', 'Primeros auxilios'],
        waitTime: '5-10 min',
        priority: 4
      }
    ]

    return baseCenters
      .filter(center => type === 'all' || center.type === type)
      .map(center => ({
        ...center,
        distance: calculateDistance(userLocation, center.coordinates),
        eta: calculateETA(calculateDistance(userLocation, center.coordinates))
      }))
  }, [calculateDistance, calculateETA])

  // Obtener centros médicos con cache
  const getMedicalCenters = useCallback(async (userLocation: Location, type: string = 'all') => {
    const cacheKey = `${userLocation.lat.toFixed(3)}-${userLocation.lng.toFixed(3)}-${type}`
    const cached = centersCache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setState(prev => ({
        ...prev,
        centers: cached.data,
        lastUpdate: cached.timestamp,
        isLoading: false,
        error: null
      }))
      return cached.data
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const centers = generateMockCenters(userLocation, type)
      
      setState(prev => ({
        ...prev,
        centers,
        lastUpdate: Date.now(),
        isLoading: false,
        error: null
      }))
      
      // Guardar en cache
      centersCache.set(cacheKey, { 
        data: centers, 
        timestamp: Date.now() 
      })
      
      return centers
    } catch (error) {
      const errorMessage = 'Error cargando centros médicos'
      
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false
      }))

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })

      return []
    }
  }, [generateMockCenters])

  // Cargar centros médicos cuando cambie la ubicación
  useEffect(() => {
    if (location) {
      getMedicalCenters(location, filterType)
    }
  }, [location, filterType, getMedicalCenters])

  // Centros filtrados y ordenados
  const filteredCenters = useMemo(() => {
    return state.centers.sort((a, b) => {
      // Priorizar por emergencias primero
      if (a.emergency && !b.emergency) return -1
      if (!a.emergency && b.emergency) return 1
      
      // Luego por distancia
      return a.distance - b.distance
    })
  }, [state.centers])

  // Estadísticas
  const stats = useMemo(() => {
    const hospitals = state.centers.filter(c => c.type === 'hospital')
    const pharmacies = state.centers.filter(c => c.type === 'pharmacy')
    const emergencyCenters = state.centers.filter(c => c.emergency)
    const openCenters = state.centers.filter(c => c.isOpen)
    
    return {
      total: state.centers.length,
      hospitals: hospitals.length,
      pharmacies: pharmacies.length,
      emergency: emergencyCenters.length,
      open: openCenters.length
    }
  }, [state.centers])

  return {
    centers: filteredCenters,
    isLoading: state.isLoading,
    error: state.error,
    lastUpdate: state.lastUpdate,
    stats,
    refresh: () => location && getMedicalCenters(location, filterType)
  }
} 