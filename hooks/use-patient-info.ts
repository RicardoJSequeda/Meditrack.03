import useSWR from 'swr'
import { getToken, getUserId } from '@/lib/api-functions'

export interface PatientInfo {
  name: string
  age: number
  gender: string
  bloodType: string
  medicalId: string
  phone: string
  email: string
  address: string
  emergencyContact: string
  dateOfBirth?: string
  createdAt?: string
  updatedAt?: string
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

export function usePatientInfo(): {
  patientInfo: PatientInfo | null
  isLoading: boolean
  error: Error | null
  mutate: () => void
} {
  const { data, error, isLoading, mutate } = useSWR('/api/patient-info', fetcher, {
    refreshInterval: 30000, // Actualizar cada 30 segundos
    revalidateOnFocus: true
  })

  return {
    patientInfo: data?.data || null,
    isLoading,
    error: error || null,
    mutate
  }
} 