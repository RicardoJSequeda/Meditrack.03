"use client"

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

interface PageLoadingProps {
  children: React.ReactNode
  delay?: number
}

export default function PageLoading({ children, delay = 0 }: PageLoadingProps) {
  const [isLoading, setIsLoading] = useState(false) // Cambiar a false por defecto

  useEffect(() => {
    // Solo mostrar loading si hay un delay específico
    if (delay > 0) {
      setIsLoading(true)
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, delay)

      return () => clearTimeout(timer)
    }
  }, [delay])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
          <span className="text-gray-600">Cargando...</span>
        </div>
      </div>
    )
  }

  return <>{children}</>
} 