import { useState, useCallback, useEffect } from 'react'

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  details?: any
}

interface UseApiOptions {
  onSuccess?: (data: any) => void
  onError?: (error: string) => void
  skipAuth?: boolean
}

export function useApi<T = any>(options: UseApiOptions = {}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<T | null>(null)

  const getToken = useCallback(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token')
    }
    return null
  }, [])

  const createHeaders = useCallback((customHeaders?: Record<string, string>) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(customHeaders || {})
    }

    const token = getToken()
    if (token && !options.skipAuth) {
      headers.Authorization = `Bearer ${token}`
    }

    return headers
  }, [getToken, options.skipAuth])

  const handleTokenError = useCallback(async (response: Response) => {
    if (response.status === 401) {
      console.log('🔐 Token inválido, limpiando...')
      localStorage.removeItem('token')
      localStorage.removeItem('auth-checked')
      localStorage.removeItem('auth-check-time')
      
      // Redirigir a login si estamos en el cliente
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
  }, [])

  const apiCall = useCallback(async (
    url: string,
    requestOptions: RequestInit & { onSuccess?: (data: any) => void; onError?: (error: string) => void } = {}
  ): Promise<ApiResponse<T>> => {
    setLoading(true)
    setError(null)

    try {
      const headers = createHeaders(requestOptions.headers as Record<string, string>)
      
      console.log(`🌐 API Call: ${requestOptions.method || 'GET'} ${url}`)
      console.log(`📤 Headers:`, headers)

      const response = await fetch(url, {
        ...requestOptions,
        headers
      })

      console.log(`📥 Response: ${response.status} ${response.statusText}`)

      // Manejar errores de token
      if (response.status === 401) {
        await handleTokenError(response)
        throw new Error('Token inválido o expirado')
      }

      // Para peticiones que no devuelven JSON (como HEAD)
      if (requestOptions.method === 'HEAD') {
        if (response.ok) {
          return { success: true }
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
      }

      const result: ApiResponse<T> = await response.json()

      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      if (result.success) {
        setData(result.data || null)
        requestOptions.onSuccess?.(result.data)
        return result
      } else {
        throw new Error(result.error || 'Error desconocido')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      console.error(`❌ API Error: ${errorMessage}`)
      setError(errorMessage)
      requestOptions.onError?.(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [createHeaders, handleTokenError, options])

  const get = useCallback((url: string) => {
    return apiCall(url, { method: 'GET' })
  }, [apiCall])

  const post = useCallback((url: string, body: any) => {
    return apiCall(url, {
      method: 'POST',
      body: JSON.stringify(body)
    })
  }, [apiCall])

  const put = useCallback((url: string, body: any) => {
    return apiCall(url, {
      method: 'PUT',
      body: JSON.stringify(body)
    })
  }, [apiCall])

  const del = useCallback((url: string) => {
    return apiCall(url, { method: 'DELETE' })
  }, [apiCall])

  const head = useCallback((url: string) => {
    return apiCall(url, { method: 'HEAD' })
  }, [apiCall])

  return {
    loading,
    error,
    data,
    apiCall,
    get,
    post,
    put,
    delete: del,
    head,
    setData,
    setError
  }
}

// Hook específico para autenticación optimizado
export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [initialized, setInitialized] = useState(false)

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Error en el login')
      }

      if (result.success && result.data) {
        localStorage.setItem('token', result.data.token)
        // Limpiar cache de auth para forzar nueva verificación
        localStorage.removeItem('auth-checked')
        localStorage.removeItem('auth-check-time')
        setUser(result.data.user)
        return result.data
      } else {
        throw new Error(result.error || 'Error desconocido')
      }
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (userData: any) => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Error en el registro')
      }

      if (result.success && result.data) {
        localStorage.setItem('token', result.data.token)
        // Limpiar cache de auth para forzar nueva verificación
        localStorage.removeItem('auth-checked')
        localStorage.removeItem('auth-check-time')
        setUser(result.data.user)
        return result.data
      } else {
        throw new Error(result.error || 'Error desconocido')
      }
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    console.log('🚪 Cerrando sesión...')
    localStorage.removeItem('token')
    localStorage.removeItem('auth-checked')
    localStorage.removeItem('auth-check-time')
    setUser(null)
    
    // Redirigir a login
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
  }, [])

  const checkAuth = useCallback(async () => {
    // Solo verificar en el cliente
    if (typeof window === 'undefined') {
      return false
    }

    const token = localStorage.getItem('token')
    if (!token) {
      console.log('❌ No hay token en localStorage')
      setUser(null)
      setInitialized(true)
      return false
    }

    try {
      console.log('🔍 Verificando autenticación...')
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          console.log('✅ Usuario autenticado:', result.data)
          setUser(result.data)
          setInitialized(true)
          return true
        }
      } else {
        console.log('❌ Error en verificación de auth:', response.status)
      }
    } catch (error) {
      console.error('❌ Auth check error:', error)
    }

    console.log('❌ Token inválido, limpiando...')
    localStorage.removeItem('token')
    localStorage.removeItem('auth-checked')
    localStorage.removeItem('auth-check-time')
    setUser(null)
    setInitialized(true)
    return false
  }, [])

  // Verificar auth al montar
  useEffect(() => {
    if (!initialized) {
      checkAuth()
    }
  }, [checkAuth, initialized])

  return {
    user,
    loading,
    initialized,
    login,
    register,
    logout,
    checkAuth
  }
} 