"use client"

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-api'
import { useHydration } from '@/hooks/use-hydration'
import { Loader2 } from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { user, loading, initialized, checkAuth } = useAuth()
  const [isChecking, setIsChecking] = useState(true)
  const [authCache, setAuthCache] = useState<boolean | null>(null)
  const router = useRouter()
  const isHydrated = useHydration()

  // Cachear resultado de autenticación
  const cachedAuthCheck = useMemo(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('auth-checked')
      const cachedTime = localStorage.getItem('auth-check-time')
      
      if (cached && cachedTime) {
        const timeDiff = Date.now() - parseInt(cachedTime)
        // Cache válido por 5 minutos
        if (timeDiff < 5 * 60 * 1000) {
          return cached === 'true'
        }
      }
    }
    return null
  }, [])

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Usar cache si está disponible
        if (cachedAuthCheck !== null) {
          setAuthCache(cachedAuthCheck)
          setIsChecking(false)
          
          if (!cachedAuthCheck) {
            router.push('/login')
          }
          return
        }

        const isAuthenticated = await checkAuth()
        
        // Cachear resultado
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth-checked', isAuthenticated.toString())
          localStorage.setItem('auth-check-time', Date.now().toString())
        }
        
        setAuthCache(isAuthenticated)
        
        if (!isAuthenticated) {
          router.push('/login')
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/login')
      } finally {
        setIsChecking(false)
      }
    }

    verifyAuth()
  }, [checkAuth, router, cachedAuthCheck])

  // No renderizar nada hasta que se complete la hidratación
  if (!isHydrated) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Cargando...</span>
        </div>
      </div>
    )
  }

  // Mostrar loading mientras se verifica la autenticación
  if (loading || isChecking || !initialized) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Verificando autenticación...</span>
        </div>
      </div>
    )
  }

  // Si no hay usuario autenticado, no mostrar nada (será redirigido)
  if (!user) {
    return null
  }

  // Si está autenticado, mostrar el contenido
  return <>{children}</>
}
