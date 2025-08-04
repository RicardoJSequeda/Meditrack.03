"use client"

import { useState, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'

interface DynamicImportOptions {
  preload?: boolean
  priority?: 'high' | 'medium' | 'low'
}

export function useDynamicImport() {
  const [loadedComponents, setLoadedComponents] = useState<Set<string>>(new Set())
  const [loadingComponents, setLoadingComponents] = useState<Set<string>>(new Set())
  const pathname = usePathname()

  // Componentes disponibles para carga dinámica
  const componentMap = {
    '/medical-history': () => import('@/app/medical-history/page'),
    '/reports': () => import('@/app/reports/page'),
    '/advice': () => import('@/app/advice/page'),
    '/notes': () => import('@/app/notes/page'),
    '/reminders': () => import('@/app/reminders/page'),
    '/settings': () => import('@/app/settings/page'),
    '/appointments': () => import('@/app/appointments/page'),
    '/emergency': () => import('@/app/emergency/page'),
  }

  // Cargar componente dinámicamente
  const loadComponent = useCallback(async (path: string) => {
    if (loadedComponents.has(path) || loadingComponents.has(path)) {
      return
    }

    const importFn = componentMap[path as keyof typeof componentMap]
    if (!importFn) {
      return
    }

    setLoadingComponents(prev => new Set(prev).add(path))

    try {
      await importFn()
      setLoadedComponents(prev => new Set(prev).add(path))
    } catch (error) {
      console.error(`Error loading component for ${path}:`, error)
    } finally {
      setLoadingComponents(prev => {
        const newSet = new Set(prev)
        newSet.delete(path)
        return newSet
      })
    }
  }, [loadedComponents, loadingComponents])

  // Preload componentes críticos
  const preloadCriticalComponents = useCallback(() => {
    const criticalPaths = ['/appointments', '/emergency']
    criticalPaths.forEach(path => {
      if (!loadedComponents.has(path)) {
        loadComponent(path)
      }
    })
  }, [loadedComponents, loadComponent])

  // Preload componentes basado en proximidad
  const preloadNearbyComponents = useCallback((currentPath: string) => {
    const nearbyPaths: Record<string, string[]> = {
      '/': ['/appointments', '/emergency'],
      '/appointments': ['/emergency', '/medical-history'],
      '/emergency': ['/appointments', '/medical-history'],
      '/medical-history': ['/reports', '/notes'],
      '/reports': ['/medical-history', '/advice'],
      '/advice': ['/reports', '/notes'],
      '/notes': ['/advice', '/reminders'],
      '/reminders': ['/notes', '/settings'],
      '/settings': ['/reminders']
    }

    const pathsToPreload = nearbyPaths[currentPath] || []
    pathsToPreload.forEach(path => {
      if (!loadedComponents.has(path) && !loadingComponents.has(path)) {
        // Preload con delay para no bloquear la navegación actual
        setTimeout(() => loadComponent(path), 1000)
      }
    })
  }, [loadedComponents, loadingComponents, loadComponent])

  // Cargar componente para la ruta actual
  useEffect(() => {
    if (pathname && componentMap[pathname as keyof typeof componentMap]) {
      loadComponent(pathname)
    }
  }, [pathname, loadComponent])

  // Preload componentes críticos al montar
  useEffect(() => {
    preloadCriticalComponents()
  }, [preloadCriticalComponents])

  // Preload componentes cercanos cuando cambia la ruta
  useEffect(() => {
    preloadNearbyComponents(pathname)
  }, [pathname, preloadNearbyComponents])

  return {
    loadComponent,
    isComponentLoaded: (path: string) => loadedComponents.has(path),
    isComponentLoading: (path: string) => loadingComponents.has(path),
    preloadComponent: loadComponent,
    loadedComponents: Array.from(loadedComponents),
    loadingComponents: Array.from(loadingComponents)
  }
} 