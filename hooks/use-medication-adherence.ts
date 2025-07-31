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

export function useMedicationAdherence() {
  const fetcher = async (url: string) => {
    console.log('🔍 use-medication-adherence: Iniciando fetcher...')
    
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    
    if (!token) {
      console.error('❌ use-medication-adherence: No hay token de autenticación')
      throw new Error('No hay token de autenticación')
    }

    try {
      const payload = decodeJWT(token)
      if (!payload || !payload.userId) {
        console.error('❌ use-medication-adherence: Token inválido o sin userId')
        throw new Error('Token inválido')
      }
      
      const userId = payload.userId
      console.log('✅ use-medication-adherence: Token válido, userId:', userId)

      const urlWithUserId = `${url}?userId=${userId}`
      console.log('📡 use-medication-adherence: URL de consulta:', urlWithUserId)
      
      const res = await fetch(urlWithUserId, {
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      
      console.log('📊 use-medication-adherence: Status de respuesta:', res.status)
      
      if (!res.ok) {
        let errorData
        try {
          errorData = await res.json()
        } catch (jsonError) {
          const textResponse = await res.text()
          console.error('❌ Respuesta no-JSON recibida:', textResponse.substring(0, 200))
          throw new Error(`Error del servidor (${res.status}): Respuesta no válida`)
        }
        console.error('❌ use-medication-adherence: Error en respuesta:', errorData)
        throw new Error(errorData.error || 'Error al cargar adherencia a medicamentos')
      }
      
      const data = await res.json()
      console.log('✅ use-medication-adherence: Datos obtenidos:', data)
      return data
    } catch (error) {
      console.error('❌ use-medication-adherence: Error en fetcher:', error)
      throw error
    }
  }

  const { data, error, mutate, isLoading } = useSWR('/api/medication-adherence', fetcher, {
    refreshInterval: 30000, // Actualizar cada 30 segundos
    revalidateOnFocus: true
  })

  return {
    adherence: data?.data || [],
    isLoading,
    isError: error,
    mutate
  }
}

export async function createMedicationAdherence(adherence: any) {
  console.log('🔍 createMedicationAdherence: Iniciando creación...')
  
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
    console.log('✅ createMedicationAdherence: Token válido, userId:', userId)

    const adherenceData = {
      ...adherence,
      userId: userId
    }

    console.log('📝 createMedicationAdherence: Datos a enviar:', adherenceData)

    const res = await fetch('/api/medication-adherence', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(adherenceData)
    })
    
    console.log('📊 createMedicationAdherence: Status de respuesta:', res.status)
    
    if (!res.ok) {
      let errorData
      try {
        errorData = await res.json()
      } catch (jsonError) {
        const textResponse = await res.text()
        console.error('❌ Respuesta no-JSON recibida:', textResponse.substring(0, 200))
        throw new Error(`Error del servidor (${res.status}): Respuesta no válida`)
      }
      console.error('❌ createMedicationAdherence: Error en respuesta:', errorData)
      throw new Error(errorData.error || 'Error al crear adherencia a medicamentos')
    }
    
    const result = await res.json()
    console.log('✅ createMedicationAdherence: Adherencia creada exitosamente:', result)
    return result
  } catch (error) {
    console.error('❌ createMedicationAdherence: Error:', error)
    throw error
  }
} 