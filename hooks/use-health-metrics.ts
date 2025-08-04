import useSWR from 'swr'

function decodeJWT(token: string) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Error decodificando token:', error)
    return null
  }
}

export function useHealthMetrics() {
  const fetcher = async (url: string) => {
    console.log('🔍 use-health-metrics: Iniciando fetcher...')
    
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    
    if (!token) {
      console.error('❌ use-health-metrics: No hay token de autenticación')
      throw new Error('No hay token de autenticación')
    }

    try {
      const payload = decodeJWT(token)
      if (!payload || !payload.userId) {
        console.error('❌ use-health-metrics: Token inválido o sin userId')
        throw new Error('Token inválido')
      }
      
      const userId = payload.userId
      console.log('✅ use-health-metrics: Token válido, userId:', userId)

      const urlWithUserId = `${url}?userId=${userId}`
      console.log('📡 use-health-metrics: URL de consulta:', urlWithUserId)
      
      const res = await fetch(urlWithUserId, {
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      
      console.log('📊 use-health-metrics: Status de respuesta:', res.status)
      
      if (!res.ok) {
        let errorData
        try {
          errorData = await res.json()
        } catch (jsonError) {
          const textResponse = await res.text()
          console.error('❌ Respuesta no-JSON recibida:', textResponse.substring(0, 200))
          throw new Error(`Error del servidor (${res.status}): Respuesta no válida`)
        }
        console.error('❌ use-health-metrics: Error en respuesta:', errorData)
        throw new Error(errorData.error || 'Error al cargar métricas de salud')
      }
      
      const data = await res.json()
      console.log('✅ use-health-metrics: Datos obtenidos:', data)
      return data
    } catch (error) {
      console.error('❌ use-health-metrics: Error en fetcher:', error)
      throw error
    }
  }

  const { data, error, mutate, isLoading } = useSWR('/api/health-metrics', fetcher, {
    refreshInterval: 30000, // Actualizar cada 30 segundos
    revalidateOnFocus: true
  })

  return {
    metrics: data?.data || [],
    isLoading,
    isError: error,
    mutate
  }
}

export async function createHealthMetric(metric: any) {
  console.log('🔍 createHealthMetric: Iniciando creación...')
  
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  
  if (!token) {
    throw new Error('No hay token de autenticación')
  }

  try {
    const payload = decodeJWT(token)
    if (!payload || !payload.userId) {
      throw new Error('Token inválido')
    }
    
    const userId = payload.userId
    console.log('✅ createHealthMetric: Token válido, userId:', userId)

    const metricData = {
      ...metric,
      userId: userId
    }

    console.log('📝 createHealthMetric: Datos a enviar:', metricData)

    const res = await fetch('/api/health-metrics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(metricData)
    })
    
    console.log('📊 createHealthMetric: Status de respuesta:', res.status)
    
    if (!res.ok) {
      let errorData
      try {
        errorData = await res.json()
      } catch (jsonError) {
        const textResponse = await res.text()
        console.error('❌ Respuesta no-JSON recibida:', textResponse.substring(0, 200))
        throw new Error(`Error del servidor (${res.status}): Respuesta no válida`)
      }
      console.error('❌ createHealthMetric: Error en respuesta:', errorData)
      throw new Error(errorData.error || 'Error al crear métrica de salud')
    }
    
    const result = await res.json()
    console.log('✅ createHealthMetric: Métrica creada exitosamente:', result)
    return result
  } catch (error) {
    console.error('❌ createHealthMetric: Error:', error)
    throw error
  }
} 