import useSWR from 'swr'
import { getToken, getUserId } from '@/lib/api-functions'

type BackendType = 'MEDICATION' | 'APPOINTMENT' | 'EXERCISE' | 'TEST' | 'OTHER';

const fetcher = async (url: string) => {
  const token = getToken()
  const userId = getUserId()

  if (!token || !userId) {
    throw new Error('No hay token de autenticación o userId')
  }

  const response = await fetch(`${url}?userId=${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  if (!response.ok) {
    throw new Error('Error fetching data')
  }

  return response.json()
}

// Mapeo de tipos del backend al frontend
const typeMapping: Record<BackendType, string> = {
  MEDICATION: 'medicacion',
  APPOINTMENT: 'cita',
  EXERCISE: 'ejercicio',
  TEST: 'medicion',
  OTHER: 'general'
}

// Mapeo inverso del frontend al backend
const reverseTypeMapping: Record<string, BackendType> = {
  medicacion: 'MEDICATION',
  cita: 'APPOINTMENT',
  ejercicio: 'EXERCISE',
  medicion: 'TEST',
  general: 'OTHER'
}

export function useReminders() {
  const { data, error, mutate, isLoading } = useSWR('/api/reminders', fetcher, { 
    refreshInterval: 30000, // Actualizar cada 30 segundos
    revalidateOnFocus: true
  })
  
  // Adaptar los datos de la API al modelo del frontend
  const reminders = (data?.data || []).map((r: any) => ({
    ...r,
    type: typeMapping[r.type as BackendType] || 'general',
    priority: r.priority || 'media', // Usar prioridad del backend si existe, sino 'media'
    frequency: r.frequency || 'una-vez', // Usar frecuencia del backend si existe, sino 'una-vez'
    time: r.date ? new Date(r.date).toISOString().slice(11, 16) : '09:00',
    isActive: !r.isCompleted, // Un recordatorio está activo si no está completado
    notifications: { 
      push: r.pushNotifications || false, 
      email: r.emailNotifications || false, 
      sound: r.soundNotifications || false 
    },
    completedDates: r.completedDates || [],
    nextDue: r.date,
  }))
  
  return {
    reminders,
    isLoading,
    isError: error,
    mutate
  }
}

export async function createReminder(reminder: any) {
  const token = getToken()
  const userId = getUserId()

  if (!token || !userId) {
    throw new Error('No hay token de autenticación o userId')
  }

  const response = await fetch('/api/reminders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      ...reminder,
      userId
    })
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Error al crear recordatorio')
  }

  return response.json()
}

export async function updateReminder(id: string, data: any) {
  const token = getToken()

  if (!token) {
    throw new Error('No hay token de autenticación')
  }

  // Si se está actualizando el tipo, mapearlo al formato del backend
  if (data.type && reverseTypeMapping[data.type]) {
    data.type = reverseTypeMapping[data.type]
  }

  const response = await fetch(`/api/reminders/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Error al editar recordatorio')
  }

  return response.json()
}

export async function completeReminder(id: string) {
  return updateReminder(id, { isCompleted: true })
}

export async function removeReminder(id: string) {
  const token = getToken()

  if (!token) {
    throw new Error('No hay token de autenticación')
  }

  const response = await fetch(`/api/reminders/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Error al eliminar recordatorio')
  }

  return response.json()
} 