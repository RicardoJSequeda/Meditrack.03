// Service Worker para MediTrack
const CACHE_NAME = 'meditrack-v1'
const STATIC_CACHE = 'meditrack-static-v1'
const DYNAMIC_CACHE = 'meditrack-dynamic-v1'

// Recursos críticos para cachear
const STATIC_RESOURCES = [
  '/',
  '/appointments',
  '/emergency',
  '/profile',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/placeholder.svg',
  '/placeholder-logo.png'
]

// Recursos dinámicos para cachear
const DYNAMIC_RESOURCES = [
  '/api/user/profile',
  '/api/medical-info',
  '/api/emergency-contacts'
]

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker instalando...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Cacheando recursos estáticos...')
        return cache.addAll(STATIC_RESOURCES)
      })
      .then(() => {
        console.log('Service Worker instalado correctamente')
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('Error instalando Service Worker:', error)
      })
  )
})

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker activando...')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Eliminando cache obsoleto:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('Service Worker activado correctamente')
        return self.clients.claim()
      })
  )
})

// Interceptar peticiones
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Estrategia para recursos estáticos
  if (isStaticResource(request)) {
    event.respondWith(
      caches.open(STATIC_CACHE)
        .then((cache) => {
          return cache.match(request)
            .then((response) => {
              if (response) {
                console.log('Sirviendo desde cache estático:', request.url)
                return response
              }
              
              return fetch(request)
                .then((response) => {
                  if (response.status === 200) {
                    cache.put(request, response.clone())
                  }
                  return response
                })
            })
        })
    )
    return
  }

  // Estrategia para recursos dinámicos
  if (isDynamicResource(request)) {
    event.respondWith(
      caches.open(DYNAMIC_CACHE)
        .then((cache) => {
          return fetch(request)
            .then((response) => {
              if (response.status === 200) {
                cache.put(request, response.clone())
              }
              return response
            })
            .catch(() => {
              return cache.match(request)
            })
        })
    )
    return
  }

  // Estrategia para navegación
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone()
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(request, responseClone)
              })
          }
          return response
        })
        .catch(() => {
          return caches.match('/')
        })
    )
    return
  }

  // Estrategia por defecto: Network First
  event.respondWith(
    fetch(request)
      .catch(() => {
        return caches.match(request)
      })
  )
})

// Función para identificar recursos estáticos
function isStaticResource(request) {
  const url = request.url
  return (
    url.includes('/static/') ||
    url.includes('/placeholder') ||
    url.includes('/logo') ||
    url.includes('.css') ||
    url.includes('.js') ||
    url.includes('.png') ||
    url.includes('.svg')
  )
}

// Función para identificar recursos dinámicos
function isDynamicResource(request) {
  const url = request.url
  return (
    url.includes('/api/') ||
    url.includes('/medical-info') ||
    url.includes('/emergency-contacts')
  )
}

// Mensajes del Service Worker
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'GET_CACHE_INFO') {
    event.ports[0].postMessage({
      type: 'CACHE_INFO',
      staticCache: STATIC_CACHE,
      dynamicCache: DYNAMIC_CACHE
    })
  }
})

// Manejo de errores
self.addEventListener('error', (event) => {
  console.error('Service Worker error:', event.error)
})

self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker unhandled rejection:', event.reason)
}) 