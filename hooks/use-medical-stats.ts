import useSWR from 'swr'
import { getToken, getUserId } from '@/lib/api-functions'

interface MedicalStats {
  generalHealth: {
    percentage: number
    controlled: number
    monitoring: number
    status: 'Excelente' | 'Bueno' | 'Regular' | 'Necesita Atención'
  }
  adherence: {
    percentage: number
    active: number
    completed: number
    status: 'Activo' | 'Regular' | 'Bajo'
  }
  events: {
    total: number
    lastAppointment: string
    nextCheckup: string
    status: 'Reciente' | 'Pendiente' | 'Actualizado'
  }
  documents: {
    total: number
    analysis: number
    others: number
    status: 'Actualizado' | 'Pendiente' | 'Completo'
  }
}

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

export function useMedicalStats(): {
  stats: MedicalStats | null
  isLoading: boolean
  error: Error | null
} {
  const { data, error, isLoading } = useSWR('/api/medical-stats', fetcher, {
    refreshInterval: 30000, // Actualizar cada 30 segundos
    revalidateOnFocus: true
  })

  return {
    stats: data?.data || null,
    isLoading,
    error: error || null
  }
} 