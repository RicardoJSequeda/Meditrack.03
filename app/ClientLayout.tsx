"use client"

import type React from "react"
import { useState, useMemo, Suspense, useEffect } from "react"
import { usePathname } from "next/navigation"
import Sidebar from "@/components/sidebar"
import AuthGuard from "@/components/auth-guard"
import PageLoading from "@/components/page-loading"
import { useHydration } from "@/hooks/use-hydration"
import { useServiceWorker } from "@/hooks/use-service-worker"
import { useDynamicImport } from "@/hooks/use-dynamic-import"
import { VirtualAssistant } from "@/components/virtual-assistant"

// Componente skeleton para mostrar mientras hidrata
const LoadingSkeleton = () => (
  <div className="flex h-screen bg-gray-50 overflow-hidden">
    <div className="w-64 bg-white border-r border-gray-200 shadow-lg">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="bg-green-600 p-2 rounded-lg">
            <div className="w-6 h-6 bg-white rounded"></div>
          </div>
          <div>
            <div className="h-6 bg-gray-200 rounded w-24"></div>
            <div className="h-3 bg-gray-100 rounded w-32 mt-1"></div>
          </div>
        </div>
      </div>
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-3 bg-gray-100 rounded w-16 mt-1"></div>
          </div>
        </div>
      </div>
      <div className="p-4 space-y-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
        ))}
      </div>
    </div>
    <div className="flex-1 flex flex-col min-w-0">
      <main className="flex-1 overflow-auto">
        <div className="h-full w-full flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            <span>Cargando MediTrack...</span>
          </div>
        </div>
      </main>
    </div>
  </div>
)

// Componente para mostrar estado de optimizaciones
const PerformanceIndicator = ({ 
  isServiceWorkerActive, 
  loadedComponents, 
  loadingComponents 
}: {
  isServiceWorkerActive: boolean
  loadedComponents: string[]
  loadingComponents: string[]
}) => {
  const [showIndicator, setShowIndicator] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowIndicator(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  if (!showIndicator) return null

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs space-y-1 z-50">
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${isServiceWorkerActive ? 'bg-green-500' : 'bg-gray-400'}`} />
        <span>SW: {isServiceWorkerActive ? 'Activo' : 'Inactivo'}</span>
      </div>
      <div className="text-gray-600">
        Cargados: {loadedComponents.length}
      </div>
      {loadingComponents.length > 0 && (
        <div className="text-blue-600">
          Cargando: {loadingComponents.length}
        </div>
      )}
    </div>
  )
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const pathname = usePathname()
  const isHydrated = useHydration()
  
  // Hooks de optimización
  const { isActive: isServiceWorkerActive } = useServiceWorker()
  const { loadedComponents, loadingComponents } = useDynamicImport()
  
  // Memoizar la detección de páginas públicas
  const isPublicPage = useMemo(() => {
    return pathname === "/login" || pathname === "/auth/register"
  }, [pathname])

  // Si es una página pública, mostrar sin AuthGuard
  if (isPublicPage) {
    return <>{children}</>
  }

  // Si no está hidratado, mostrar skeleton
  if (!isHydrated) {
    return <LoadingSkeleton />
  }

  // Si es una página protegida, usar AuthGuard
  return (
    <AuthGuard>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <Sidebar onCollapseChange={setSidebarCollapsed} />
        <div className="flex-1 flex flex-col min-w-0">
          <main
            className={`
              flex-1 overflow-auto transition-all duration-200 ease-out
              w-full
              will-change-margin
            `}
          >
            <div className="h-full w-full">
              <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600"></div>
                    <span className="text-gray-600">Cargando...</span>
                  </div>
                </div>
              }>
                <PageLoading delay={0}>
                  {children}
                </PageLoading>
              </Suspense>
            </div>
          </main>
        </div>
      </div>

      {/* Indicador de rendimiento (solo en desarrollo) */}
      {process.env.NODE_ENV === 'development' && (
        <PerformanceIndicator
          isServiceWorkerActive={isServiceWorkerActive}
          loadedComponents={loadedComponents}
          loadingComponents={loadingComponents}
        />
      )}

      {/* Asistente Virtual */}
      <VirtualAssistant />
    </AuthGuard>
  )
}
