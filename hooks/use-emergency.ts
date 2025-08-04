import useSWR from 'swr'

// Función simple para decodificar JWT sin verificar (solo para obtener el payload)
function decodeJWT(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decodificando JWT:', error);
    return null;
  }
}

// Hook para eventos de emergencia
export function useEmergencyEvents() {
  const fetcher = async (url: string) => {
    console.log('🔍 use-emergency-events: Iniciando fetcher...')
    
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    
    if (!token) {
      console.error('❌ use-emergency-events: No hay token de autenticación')
      throw new Error('No hay token de autenticación')
    }

    try {
      const payload = decodeJWT(token)
      if (!payload || !payload.userId) {
        console.error('❌ use-emergency-events: Token inválido o sin userId')
        throw new Error('Token inválido')
      }
      
      const userId = payload.userId
      console.log('✅ use-emergency-events: Token válido, userId:', userId)

      const urlWithUserId = `${url}?userId=${userId}`
      console.log('📡 use-emergency-events: URL de consulta:', urlWithUserId)
      
      const res = await fetch(urlWithUserId, {
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      
      console.log('📊 use-emergency-events: Status de respuesta:', res.status)
      
      if (!res.ok) {
        let errorData
        try {
          errorData = await res.json()
        } catch (jsonError) {
          // Si no se puede parsear como JSON, probablemente es HTML
          const textResponse = await res.text()
          console.error('❌ Respuesta no-JSON recibida:', textResponse.substring(0, 200))
          throw new Error(`Error del servidor (${res.status}): Respuesta no válida`)
        }
        console.error('❌ use-emergency-events: Error en respuesta:', errorData)
        throw new Error(errorData.error || 'Error al cargar eventos de emergencia')
      }
      
      const data = await res.json()
      console.log('✅ use-emergency-events: Datos obtenidos:', data)
      return data
    } catch (error) {
      console.error('❌ use-emergency-events: Error en fetcher:', error)
      throw error
    }
  }

  const { data, error, mutate, isLoading } = useSWR('/api/emergency', fetcher, {
    refreshInterval: 10000, // Actualizar cada 10 segundos
    revalidateOnFocus: true
  })

  return {
    events: data?.data || [],
    isLoading,
    isError: error,
    mutate
  }
}

// Hook para contactos de emergencia
export function useEmergencyContacts() {
  const fetcher = async (url: string) => {
    console.log('🔍 use-emergency-contacts: Iniciando fetcher...')
    
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    
    if (!token) {
      console.error('❌ use-emergency-contacts: No hay token de autenticación')
      throw new Error('No hay token de autenticación')
    }

    try {
      const payload = decodeJWT(token)
      if (!payload || !payload.userId) {
        console.error('❌ use-emergency-contacts: Token inválido o sin userId')
        throw new Error('Token inválido')
      }
      
      const userId = payload.userId
      console.log('✅ use-emergency-contacts: Token válido, userId:', userId)

      const urlWithUserId = `${url}?userId=${userId}`
      console.log('📡 use-emergency-contacts: URL de consulta:', urlWithUserId)
      
      const res = await fetch(urlWithUserId, {
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      
      console.log('📊 use-emergency-contacts: Status de respuesta:', res.status)
      
      if (!res.ok) {
        let errorData
        try {
          errorData = await res.json()
        } catch (jsonError) {
          // Si no se puede parsear como JSON, probablemente es HTML
          const textResponse = await res.text()
          console.error('❌ Respuesta no-JSON recibida:', textResponse.substring(0, 200))
          throw new Error(`Error del servidor (${res.status}): Respuesta no válida`)
        }
        console.error('❌ use-emergency-contacts: Error en respuesta:', errorData)
        throw new Error(errorData.error || 'Error al cargar contactos de emergencia')
      }
      
      const data = await res.json()
      console.log('✅ use-emergency-contacts: Datos obtenidos:', data)
      return data
    } catch (error) {
      console.error('❌ use-emergency-contacts: Error en fetcher:', error)
      throw error
    }
  }

  const { data, error, mutate, isLoading } = useSWR('/api/emergency-contacts', fetcher, {
    refreshInterval: 30000, // Actualizar cada 30 segundos
    revalidateOnFocus: true
  })

  return {
    contacts: data?.data || [],
    isLoading,
    isError: error,
    mutate
  }
}

// Función para guardar evento de emergencia
export async function saveEmergencyEvent(event: any) {
  console.log('🔍 saveEmergencyEvent: Iniciando guardado...')
  
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
    console.log('✅ saveEmergencyEvent: Token válido, userId:', userId)

    const eventData = {
      ...event,
      userId: userId
    }

    console.log('📝 saveEmergencyEvent: Datos a enviar:', eventData)

    const res = await fetch('/api/emergency', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(eventData)
    })
    
    console.log('📊 saveEmergencyEvent: Status de respuesta:', res.status)
    
    if (!res.ok) {
      const errorData = await res.json()
      console.error('❌ saveEmergencyEvent: Error en respuesta:', errorData)
      throw new Error(errorData.error || 'Error al guardar evento de emergencia')
    }
    
    const result = await res.json()
    console.log('✅ saveEmergencyEvent: Evento guardado exitosamente:', result)
    return result
  } catch (error) {
    console.error('❌ saveEmergencyEvent: Error:', error)
    throw error
  }
}

// Función para crear contacto de emergencia
export async function createEmergencyContact(contact: any) {
  console.log('🔍 createEmergencyContact: Iniciando creación...')
  
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
    console.log('✅ createEmergencyContact: Token válido, userId:', userId)

    const contactData = {
      ...contact,
      userId: userId
    }

    console.log('📝 createEmergencyContact: Datos a enviar:', contactData)

    const res = await fetch('/api/emergency-contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(contactData)
    })
    
    console.log('📊 createEmergencyContact: Status de respuesta:', res.status)
    
    if (!res.ok) {
      const errorData = await res.json()
      console.error('❌ createEmergencyContact: Error en respuesta:', errorData)
      throw new Error(errorData.error || 'Error al crear contacto de emergencia')
    }
    
    const result = await res.json()
    console.log('✅ createEmergencyContact: Contacto creado exitosamente:', result)
    return result
  } catch (error) {
    console.error('❌ createEmergencyContact: Error:', error)
    throw error
  }
}

// Función para actualizar contacto de emergencia
export async function updateEmergencyContact(contactId: string, contact: any) {
  console.log('🔍 updateEmergencyContact: Iniciando actualización...')
  
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
    console.log('✅ updateEmergencyContact: Token válido, userId:', userId)

    const contactData = {
      ...contact,
      userId: userId
    }

    console.log('📝 updateEmergencyContact: Datos a enviar:', contactData)

    const res = await fetch(`/api/emergency-contacts/${contactId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(contactData)
    })
    
    console.log('📊 updateEmergencyContact: Status de respuesta:', res.status)
    
    if (!res.ok) {
      const errorData = await res.json()
      console.error('❌ updateEmergencyContact: Error en respuesta:', errorData)
      throw new Error(errorData.error || 'Error al actualizar contacto de emergencia')
    }
    
    const result = await res.json()
    console.log('✅ updateEmergencyContact: Contacto actualizado exitosamente:', result)
    return result
  } catch (error) {
    console.error('❌ updateEmergencyContact: Error:', error)
    throw error
  }
}

// Función para eliminar contacto de emergencia
export async function deleteEmergencyContact(contactId: string) {
  console.log('🔍 deleteEmergencyContact: Iniciando eliminación...')
  
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
    console.log('✅ deleteEmergencyContact: Token válido, userId:', userId)

    console.log('📝 deleteEmergencyContact: Eliminando contacto:', contactId)

    const res = await fetch(`/api/emergency-contacts/${contactId}?userId=${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    
    console.log('📊 deleteEmergencyContact: Status de respuesta:', res.status)
    
    if (!res.ok) {
      const errorData = await res.json()
      console.error('❌ deleteEmergencyContact: Error en respuesta:', errorData)
      throw new Error(errorData.error || 'Error al eliminar contacto de emergencia')
    }
    
    const result = await res.json()
    console.log('✅ deleteEmergencyContact: Contacto eliminado exitosamente:', result)
    return result
  } catch (error) {
    console.error('❌ deleteEmergencyContact: Error:', error)
    throw error
  }
} 