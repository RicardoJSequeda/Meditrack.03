"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

interface UseNavigationOptions {
  onNavigate?: (to: string) => void
  onComplete?: () => void
  loadingDelay?: number
}

export function useNavigation(options: UseNavigationOptions = {}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isNavigating, setIsNavigating] = useState(false)
  const [navigationPath, setNavigationPath] = useState("")
  const [navigationHistory, setNavigationHistory] = useState<string[]>([])

  const { onNavigate, onComplete, loadingDelay = 0 } = options // Cambiar a 0 por defecto

  // Optimizar navegación con prefetch
  const prefetch = useCallback((href: string) => {
    if (typeof window !== "undefined") {
      // Prefetch solo para rutas importantes
      const importantRoutes = ["/", "/appointments", "/emergency", "/profile"]
      if (importantRoutes.includes(href)) {
        router.prefetch(href)
      }
    }
  }, [router])

  // Navegación optimizada sin delay
  const navigate = useCallback((href: string, options?: { replace?: boolean }) => {
    if (href === pathname) return

    setIsNavigating(true)
    setNavigationPath(href)
    onNavigate?.(href)

    // Agregar a historial de navegación
    setNavigationHistory(prev => [...prev.slice(-4), href])

    // Navegación inmediata sin delay
    if (options?.replace) {
      router.replace(href)
    } else {
      router.push(href)
    }
  }, [pathname, router, onNavigate])

  // Detectar cuando la navegación se completa
  useEffect(() => {
    if (isNavigating && navigationPath && navigationPath !== pathname) {
      setIsNavigating(false)
      setNavigationPath("")
      onComplete?.()
    }
  }, [pathname, navigationPath, isNavigating, onComplete])

  // Prefetch rutas importantes al montar
  useEffect(() => {
    const importantRoutes = ["/", "/appointments", "/emergency", "/profile"]
    importantRoutes.forEach(route => {
      if (route !== pathname) {
        prefetch(route)
      }
    })
  }, [pathname, prefetch])

  // Limpiar historial de navegación
  const clearHistory = useCallback(() => {
    setNavigationHistory([])
  }, [])

  // Obtener ruta anterior
  const getPreviousPath = useCallback(() => {
    return navigationHistory[navigationHistory.length - 2] || "/"
  }, [navigationHistory])

  // Navegar hacia atrás
  const goBack = useCallback(() => {
    const previousPath = getPreviousPath()
    if (previousPath !== pathname) {
      navigate(previousPath)
    }
  }, [navigate, getPreviousPath, pathname])

  return {
    isNavigating,
    navigationPath,
    navigate,
    prefetch,
    goBack,
    clearHistory,
    navigationHistory,
    getPreviousPath,
  }
} 