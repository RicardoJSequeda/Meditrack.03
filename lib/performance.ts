// Configuración de rendimiento para la aplicación

export const PERFORMANCE_CONFIG = {
  // Configuración de navegación
  navigation: {
    prefetchDelay: 100, // ms antes de hacer prefetch
    loadingDelay: 50, // ms para mostrar loading
    transitionDuration: 200, // ms para transiciones
    maxPrefetchRoutes: 4, // máximo de rutas para prefetch
  },

  // Configuración de caché
  cache: {
    userData: 5 * 60 * 1000, // 5 minutos
    navigationHistory: 10, // máximo de elementos en historial
    componentCache: 10 * 60 * 1000, // 10 minutos
  },

  // Rutas prioritarias para prefetch
  priorityRoutes: [
    "/",
    "/appointments", 
    "/emergency",
    "/profile"
  ],

  // Rutas de baja prioridad (no prefetch)
  lowPriorityRoutes: [
    "/settings",
    "/advice",
    "/notes"
  ],

  // Configuración de lazy loading
  lazyLoading: {
    threshold: 0.1, // porcentaje visible para cargar
    rootMargin: "50px", // margen para precarga
  },

  // Configuración de animaciones
  animations: {
    duration: 200,
    easing: "ease-out",
    reducedMotion: "prefers-reduced-motion: reduce",
  },

  // Configuración de debounce
  debounce: {
    search: 300, // ms para búsquedas
    resize: 100, // ms para resize
    scroll: 16, // ms para scroll (60fps)
  },

  // Configuración de throttling
  throttle: {
    scroll: 16, // ms para scroll
    resize: 100, // ms para resize
    mousemove: 16, // ms para mousemove
  }
}

// Función para verificar si el dispositivo es lento
export function isSlowDevice(): boolean {
  if (typeof navigator === "undefined") return false
  
  const connection = (navigator as any).connection
  if (connection) {
    return connection.effectiveType === "slow-2g" || 
           connection.effectiveType === "2g" ||
           connection.saveData
  }
  
  return false
}

// Función para optimizar configuraciones según el dispositivo
export function getOptimizedConfig() {
  const slow = isSlowDevice()
  
  return {
    ...PERFORMANCE_CONFIG,
    navigation: {
      ...PERFORMANCE_CONFIG.navigation,
      loadingDelay: slow ? 0 : PERFORMANCE_CONFIG.navigation.loadingDelay,
      transitionDuration: slow ? 100 : PERFORMANCE_CONFIG.navigation.transitionDuration,
    },
    animations: {
      ...PERFORMANCE_CONFIG.animations,
      duration: slow ? 100 : PERFORMANCE_CONFIG.animations.duration,
    }
  }
}

// Función para precargar recursos críticos
export function preloadCriticalResources() {
  if (typeof window === "undefined") return

  // Precargar fuentes críticas
  const fontLink = document.createElement("link")
  fontLink.rel = "preload"
  fontLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
  fontLink.as = "style"
  document.head.appendChild(fontLink)

  // Precargar iconos críticos
  const iconLink = document.createElement("link")
  iconLink.rel = "preload"
  iconLink.href = "/placeholder.svg"
  iconLink.as = "image"
  document.head.appendChild(iconLink)
}

// Función para limpiar caché
export function clearPerformanceCache() {
  if (typeof window === "undefined") return

  // Limpiar caché de imágenes
  if ("caches" in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        caches.delete(name)
      })
    })
  }

  // Limpiar localStorage de navegación
  const navigationKeys = Object.keys(localStorage).filter(key => 
    key.startsWith("navigation_") || key.startsWith("cache_")
  )
  navigationKeys.forEach(key => localStorage.removeItem(key))
}

// Función para medir rendimiento
export function measurePerformance(name: string, fn: () => void) {
  if (typeof performance === "undefined") {
    fn()
    return
  }

  const start = performance.now()
  fn()
  const end = performance.now()
  
  console.log(`Performance [${name}]: ${(end - start).toFixed(2)}ms`)
}

// Función para optimizar imágenes
export function optimizeImageUrl(url: string, width: number = 400): string {
  if (!url || url.startsWith("data:")) return url
  
  // Si es una URL externa, agregar parámetros de optimización
  if (url.includes("placeholder")) {
    return `${url}?w=${width}&q=80&fit=crop`
  }
  
  return url
} 