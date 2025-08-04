import { useState, useEffect, useCallback } from 'react'
import { toast } from '@/hooks/use-toast'

interface Location {
  lat: number
  lng: number
  address: string
  accuracy?: number
  timestamp: number
}

interface LocationState {
  location: Location | null
  error: string | null
  isLoading: boolean
  accuracy: number | null
  lastUpdate: number
}

// Cache para ubicación
const locationCache = new Map<string, { data: Location; timestamp: number }>()
const LOCATION_CACHE_DURATION = 2 * 60 * 1000 // 2 minutos

export function useSmartLocation() {
  const [state, setState] = useState<LocationState>({
    location: null,
    error: null,
    isLoading: false,
    accuracy: null,
    lastUpdate: 0
  })

  // Obtener dirección desde coordenadas usando Nominatim
  const getAddressFromCoords = useCallback(async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      )
      const data = await response.json()
      return data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`
    } catch (error) {
      console.warn('Error obteniendo dirección:', error)
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`
    }
  }, [])

  // Obtener ubicación con cache inteligente
  const getLocation = useCallback(async (force = false): Promise<Location | null> => {
    const cacheKey = 'user-location'
    const cached = locationCache.get(cacheKey)
    
    // Usar cache si no es forzado y está válido
    if (!force && cached && Date.now() - cached.timestamp < LOCATION_CACHE_DURATION) {
      setState(prev => ({
        ...prev,
        location: cached.data,
        lastUpdate: cached.timestamp,
        isLoading: false,
        error: null
      }))
      return cached.data
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000
        })
      })

      const address = await getAddressFromCoords(
        position.coords.latitude, 
        position.coords.longitude
      )

      const newLocation: Location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        address,
        accuracy: position.coords.accuracy,
        timestamp: Date.now()
      }

      // Actualizar estado
      setState(prev => ({
        ...prev,
        location: newLocation,
        accuracy: position.coords.accuracy,
        lastUpdate: Date.now(),
        isLoading: false,
        error: null
      }))

      // Guardar en cache
      locationCache.set(cacheKey, { 
        data: newLocation, 
        timestamp: Date.now() 
      })

      return newLocation
    } catch (error) {
      const errorMessage = error instanceof GeolocationPositionError 
        ? getLocationErrorMessage(error.code)
        : 'Error obteniendo ubicación'
      
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false
      }))

      toast({
        title: "Error de ubicación",
        description: errorMessage,
        variant: "destructive"
      })

      return null
    }
  }, [getAddressFromCoords])

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
    if (state.location && !state.isLoading) {
      const interval = setInterval(() => {
        const timeSinceUpdate = Date.now() - state.lastUpdate
        if (timeSinceUpdate > 5 * 60 * 1000) { // 5 minutos
          getLocation(true)
        }
      }, 60000) // Verificar cada minuto

      return () => clearInterval(interval)
    }
  }, [state.location, state.lastUpdate, state.isLoading, getLocation])

  // Cargar ubicación inicial
  useEffect(() => {
    getLocation()
  }, [getLocation])

  return {
    ...state,
    getLocation,
    refreshLocation: () => getLocation(true)
  }
} 