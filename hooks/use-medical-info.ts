import useSWR from 'swr'

interface MedicalInfo {
  id?: string
  bloodType: string
  allergies: string[]
  medications: string[]
  conditions: string[]
  emergencyContact: string
  weight: string
  height: string
  insuranceNumber: string
  userId?: string
}

// Función para decodificar JWT sin verificación criptográfica
function decodeJWT(token: string) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Error decodificando JWT:', error)
    return null
  }
}

// Hook para obtener información médica
export function useMedicalInfo() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  
  const fetcher = async (url: string) => {
    if (!token) {
      throw new Error('No hay token de autenticación')
    }

    const payload = decodeJWT(token)
    if (!payload || !payload.userId) {
      throw new Error('Token inválido')
    }

    const response = await fetch(`${url}?userId=${payload.userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Error obteniendo información médica')
    }

    return response.json()
  }

  const { data, error, isLoading, mutate } = useSWR(
    token ? '/api/medical-info' : null,
    fetcher,
    {
      refreshInterval: 30000, // Refrescar cada 30 segundos
      revalidateOnFocus: true
    }
  )

  return {
    medicalInfo: data?.data || null,
    isLoading,
    isError: error,
    mutate
  }
}

// Función para crear información médica
export async function createMedicalInfo(medicalData: MedicalInfo) {
  console.log('🔍 createMedicalInfo: Iniciando creación...')
  
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
    console.log('✅ createMedicalInfo: Token válido, userId:', userId)

    const dataToSend = {
      ...medicalData,
      userId: userId
    }

    console.log('📝 createMedicalInfo: Datos a enviar:', dataToSend)

    const res = await fetch('/api/medical-info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(dataToSend)
    })
    
    console.log('📊 createMedicalInfo: Status de respuesta:', res.status)
    
    if (!res.ok) {
      const errorData = await res.json()
      console.error('❌ createMedicalInfo: Error en respuesta:', errorData)
      throw new Error(errorData.error || 'Error al crear información médica')
    }
    
    const result = await res.json()
    console.log('✅ createMedicalInfo: Información médica creada exitosamente:', result)
    return result
  } catch (error) {
    console.error('❌ createMedicalInfo: Error:', error)
    throw error
  }
}

// Función para actualizar información médica
export async function updateMedicalInfo(medicalInfoId: string, medicalData: Partial<MedicalInfo>) {
  console.log('🔍 updateMedicalInfo: Iniciando actualización...')
  
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
    console.log('✅ updateMedicalInfo: Token válido, userId:', userId)

    const dataToSend = {
      ...medicalData,
      userId: userId
    }

    console.log('📝 updateMedicalInfo: Datos a enviar:', dataToSend)

    const res = await fetch(`/api/medical-info/${medicalInfoId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(dataToSend)
    })
    
    console.log('📊 updateMedicalInfo: Status de respuesta:', res.status)
    
    if (!res.ok) {
      const errorData = await res.json()
      console.error('❌ updateMedicalInfo: Error en respuesta:', errorData)
      throw new Error(errorData.error || 'Error al actualizar información médica')
    }
    
    const result = await res.json()
    console.log('✅ updateMedicalInfo: Información médica actualizada exitosamente:', result)
    return result
  } catch (error) {
    console.error('❌ updateMedicalInfo: Error:', error)
    throw error
  }
} 