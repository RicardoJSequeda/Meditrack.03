import useSWR from 'swr'

type BackendStatus = 'SCHEDULED' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';

type AppointmentAPI = {
  id: string;
  title: string;
  doctor: string;
  specialty: string;
  date: string;
  duration: number;
  location: string;
  notes?: string;
  status: BackendStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

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

const fetcher = async (url: string) => {
  console.log('🔍 use-appointments: Iniciando fetcher...')
  
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  
  if (!token) {
    console.error('❌ use-appointments: No hay token de autenticación')
    throw new Error('No hay token de autenticación')
  }

  try {
    // Decodificar el token para obtener el userId (sin verificar)
    const payload = decodeJWT(token)
    if (!payload || !payload.userId) {
      console.error('❌ use-appointments: Token inválido o sin userId')
      throw new Error('Token inválido')
    }
    
    const userId = payload.userId
    console.log('✅ use-appointments: Token válido, userId:', userId)

    // Agregar userId como parámetro de consulta
    const urlWithUserId = `${url}?userId=${userId}`
    console.log('📡 use-appointments: URL de consulta:', urlWithUserId)
    
    const res = await fetch(urlWithUserId, {
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    
    console.log('📊 use-appointments: Status de respuesta:', res.status)
    
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
      console.error('❌ use-appointments: Error en respuesta:', errorData)
      throw new Error(errorData.error || 'Error al cargar citas')
    }
    
    const data = await res.json()
    console.log('✅ use-appointments: Datos obtenidos:', data)
    return data
  } catch (error) {
    console.error('❌ use-appointments: Error en fetcher:', error)
    throw error
  }
}

export function useAppointments() {
  console.log('🔄 use-appointments: Hook iniciado')
  
  const { data, error, mutate, isLoading } = useSWR('/api/appointments', fetcher, { 
    refreshInterval: 5000,
    revalidateOnFocus: true,
    onError: (error) => {
      console.error('❌ use-appointments: Error en SWR:', error)
    },
    onSuccess: (data) => {
      console.log('✅ use-appointments: SWR exitoso:', data)
    }
  })
  
  console.log('📊 use-appointments: Estado actual:', { 
    isLoading, 
    isError: !!error, 
    dataLength: data?.data?.length || 0 
  })
  
  const appointments = (data?.data || []).map((a: AppointmentAPI) => {
    const appointment = {
      ...a,
      // Convertir la fecha y hora para compatibilidad con el frontend
      time: new Date(a.date).toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      // Agregar campos adicionales para compatibilidad
      urgent: a.status === 'CONFIRMED' || a.status === 'SCHEDULED',
      completed: a.status === 'COMPLETED',
      type: 'consulta', // valor por defecto
      reason: a.notes || '',
      address: a.location,
      phone: '', // campo opcional
    }
    console.log('🔄 use-appointments: Cita procesada:', appointment)
    return appointment
  })
  
  console.log('📋 use-appointments: Citas finales:', appointments.length)
  
  return {
    appointments,
    isLoading,
    isError: error,
    mutate
  }
}

export async function createAppointment(appointment: any) {
  console.log('🔍 createAppointment: Iniciando creación...')
  
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
    console.log('✅ createAppointment: Token válido, userId:', userId)

    // Preparar los datos para Supabase
    const appointmentData = {
      title: appointment.title,
      doctor: appointment.doctor,
      specialty: appointment.specialty,
      date: appointment.date,
      duration: appointment.duration || 30,
      location: appointment.location || appointment.address,
      notes: appointment.notes || appointment.reason,
      status: appointment.status || 'SCHEDULED',
      userId: userId
    }

    console.log('📝 createAppointment: Datos a enviar:', appointmentData)

    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(appointmentData)
    })
    
    console.log('📊 createAppointment: Status de respuesta:', res.status)
    
    if (!res.ok) {
      const errorData = await res.json()
      console.error('❌ createAppointment: Error en respuesta:', errorData)
      throw new Error(errorData.error || 'Error al crear cita')
    }
    
    const result = await res.json()
    console.log('✅ createAppointment: Cita creada exitosamente:', result)
    return result
  } catch (error) {
    console.error('❌ createAppointment: Error:', error)
    throw error
  }
}

export async function updateAppointment(id: string, data: any) {
  console.log('🔍 updateAppointment: Iniciando actualización...')
  
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
    console.log('✅ updateAppointment: Token válido, userId:', userId)

    // Preparar los datos para Supabase
    const updateData = {
      ...data,
      userId: userId
    }

    console.log('📝 updateAppointment: Datos a enviar:', updateData)

    const res = await fetch(`/api/appointments/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updateData)
    })
    
    console.log('📊 updateAppointment: Status de respuesta:', res.status)
    
    if (!res.ok) {
      const errorData = await res.json()
      console.error('❌ updateAppointment: Error en respuesta:', errorData)
      throw new Error(errorData.error || 'Error al editar cita')
    }
    
    const result = await res.json()
    console.log('✅ updateAppointment: Cita actualizada exitosamente:', result)
    return result
  } catch (error) {
    console.error('❌ updateAppointment: Error:', error)
    throw error
  }
}

export async function removeAppointment(id: string) {
  console.log('🔍 removeAppointment: Iniciando eliminación...')
  
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
    console.log('✅ removeAppointment: Token válido, userId:', userId)

    const res = await fetch(`/api/appointments/${id}?userId=${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    
    console.log('📊 removeAppointment: Status de respuesta:', res.status)
    
    if (!res.ok) {
      const errorData = await res.json()
      console.error('❌ removeAppointment: Error en respuesta:', errorData)
      throw new Error(errorData.error || 'Error al eliminar cita')
    }
    
    const result = await res.json()
    console.log('✅ removeAppointment: Cita eliminada exitosamente:', result)
    return result
  } catch (error) {
    console.error('❌ removeAppointment: Error:', error)
    throw error
  }
} 