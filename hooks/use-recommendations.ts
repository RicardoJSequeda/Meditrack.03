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

export function useRecommendations() {
  const fetcher = async (url: string) => {
    console.log('🔍 use-recommendations: Iniciando fetcher...')
    
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    
    if (!token) {
      console.error('❌ use-recommendations: No hay token de autenticación')
      throw new Error('No hay token de autenticación')
    }

    try {
      const payload = decodeJWT(token)
      if (!payload || !payload.userId) {
        console.error('❌ use-recommendations: Token inválido o sin userId')
        throw new Error('Token inválido')
      }
      
      const userId = payload.userId
      console.log('✅ use-recommendations: Token válido, userId:', userId)

      const urlWithUserId = `${url}?userId=${userId}`
      console.log('📡 use-recommendations: URL de consulta:', urlWithUserId)
      
      const res = await fetch(urlWithUserId, {
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      
      console.log('📊 use-recommendations: Status de respuesta:', res.status)
      
      if (!res.ok) {
        let errorData
        try {
          errorData = await res.json()
        } catch (jsonError) {
          const textResponse = await res.text()
          console.error('❌ Respuesta no-JSON recibida:', textResponse.substring(0, 200))
          throw new Error(`Error del servidor (${res.status}): Respuesta no válida`)
        }
        console.error('❌ use-recommendations: Error en respuesta:', errorData)
        throw new Error(errorData.error || 'Error al cargar recomendaciones')
      }
      
      const data = await res.json()
      console.log('✅ use-recommendations: Datos obtenidos:', data)
      return data
    } catch (error) {
      console.error('❌ use-recommendations: Error en fetcher:', error)
      throw error
    }
  }

  const { data, error, mutate, isLoading } = useSWR('/api/recommendations', fetcher, {
    refreshInterval: 30000, // Actualizar cada 30 segundos
    revalidateOnFocus: true
  })

  return {
    recommendations: data?.data || [],
    isLoading,
    isError: error,
    mutate
  }
}

export async function createRecommendation(recommendation: any) {
  console.log('🔍 createRecommendation: Iniciando creación...')
  
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
    console.log('✅ createRecommendation: Token válido, userId:', userId)

    const recommendationData = {
      ...recommendation,
      userId: userId
    }

    console.log('📝 createRecommendation: Datos a enviar:', recommendationData)

    const res = await fetch('/api/recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(recommendationData)
    })
    
    console.log('📊 createRecommendation: Status de respuesta:', res.status)
    
    if (!res.ok) {
      let errorData
      try {
        errorData = await res.json()
      } catch (jsonError) {
        const textResponse = await res.text()
        console.error('❌ Respuesta no-JSON recibida:', textResponse.substring(0, 200))
        throw new Error(`Error del servidor (${res.status}): Respuesta no válida`)
      }
      console.error('❌ createRecommendation: Error en respuesta:', errorData)
      throw new Error(errorData.error || 'Error al crear recomendación')
    }
    
    const result = await res.json()
    console.log('✅ createRecommendation: Recomendación creada exitosamente:', result)
    return result
  } catch (error) {
    console.error('❌ createRecommendation: Error:', error)
    throw error
  }
} 