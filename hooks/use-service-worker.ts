"use client"

import { useState, useEffect, useCallback } from 'react'

interface ServiceWorkerState {
  isSupported: boolean
  isInstalled: boolean
  isActive: boolean
  isUpdating: boolean
  registration: ServiceWorkerRegistration | null
}

export function useServiceWorker() {
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: false,
    isInstalled: false,
    isActive: false,
    isUpdating: false,
    registration: null
  })

  // Verificar si el Service Worker es soportado
  const checkSupport = useCallback(() => {
    const isSupported = 'serviceWorker' in navigator
    setState(prev => ({ ...prev, isSupported }))
    return isSupported
  }, [])

  // Registrar el Service Worker
  const registerServiceWorker = useCallback(async () => {
    if (!checkSupport()) {
      console.log('Service Worker no soportado')
      return null
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      })

      console.log('Service Worker registrado:', registration)

      setState(prev => ({
        ...prev,
        isInstalled: true,
        registration
      }))

      return registration
    } catch (error) {
      console.error('Error registrando Service Worker:', error)
      return null
    }
  }, [checkSupport])

  // Verificar estado del Service Worker
  const checkServiceWorkerState = useCallback(async () => {
    if (!state.isSupported) return

    try {
      const registration = await navigator.serviceWorker.getRegistration()
      
      if (registration) {
        setState(prev => ({
          ...prev,
          isInstalled: true,
          isActive: !!registration.active,
          registration
        }))

        // Escuchar cambios de estado
        registration.addEventListener('updatefound', () => {
          setState(prev => ({ ...prev, isUpdating: true }))
        })

        registration.active?.addEventListener('statechange', (event) => {
          const sw = event.target as ServiceWorker
          setState(prev => ({
            ...prev,
            isActive: sw.state === 'activated'
          }))
        })
      }
    } catch (error) {
      console.error('Error verificando estado del Service Worker:', error)
    }
  }, [state.isSupported])

  // Actualizar Service Worker
  const updateServiceWorker = useCallback(async () => {
    if (!state.registration) return

    try {
      await state.registration.update()
      console.log('Service Worker actualizado')
    } catch (error) {
      console.error('Error actualizando Service Worker:', error)
    }
  }, [state.registration])

  // Limpiar cache
  const clearCache = useCallback(async () => {
    if (!state.registration) return

    try {
      const cacheNames = await caches.keys()
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      )
      console.log('Cache limpiado')
    } catch (error) {
      console.error('Error limpiando cache:', error)
    }
  }, [state.registration])

  // Obtener información del cache
  const getCacheInfo = useCallback(async () => {
    try {
      const cacheNames = await caches.keys()
      const cacheInfo = await Promise.all(
        cacheNames.map(async (cacheName) => {
          const cache = await caches.open(cacheName)
          const keys = await cache.keys()
          return {
            name: cacheName,
            size: keys.length,
            urls: keys.map(key => key.url)
          }
        })
      )
      return cacheInfo
    } catch (error) {
      console.error('Error obteniendo información del cache:', error)
      return []
    }
  }, [])

  // Preload recursos críticos
  const preloadCriticalResources = useCallback(async () => {
    if (!state.isActive) return

    const criticalResources = [
      '/appointments',
      '/emergency',
      '/profile',
      '/api/user/profile'
    ]

    try {
      await Promise.all(
        criticalResources.map(url => fetch(url, { method: 'HEAD' }))
      )
      console.log('Recursos críticos precargados')
    } catch (error) {
      console.error('Error precargando recursos:', error)
    }
  }, [state.isActive])

  // Inicializar Service Worker
  useEffect(() => {
    const initServiceWorker = async () => {
      if (checkSupport()) {
        await registerServiceWorker()
        await checkServiceWorkerState()
      }
    }

    initServiceWorker()
  }, [checkSupport, registerServiceWorker, checkServiceWorkerState])

  // Preload recursos cuando el Service Worker esté activo
  useEffect(() => {
    if (state.isActive) {
      preloadCriticalResources()
    }
  }, [state.isActive, preloadCriticalResources])

  return {
    ...state,
    registerServiceWorker,
    updateServiceWorker,
    clearCache,
    getCacheInfo,
    preloadCriticalResources
  }
} 