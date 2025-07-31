import useSWR from 'swr'
import { getToken, getUserId } from '@/lib/api-functions'

export interface ReminderSettings {
  notifications: {
    push: boolean
    email: boolean
    sound: boolean
    vibration: boolean
    desktop: boolean
  }
  timing: {
    defaultAdvanceTime: number
    snoozeOptions: number[]
    timezone: string
    workHours: {
      start: string
      end: string
    }
  }
  appearance: {
    theme: 'light' | 'dark' | 'auto'
    accentColor: string
    showCompleted: boolean
    showOverdue: boolean
  }
  privacy: {
    shareWithFamily: boolean
    emergencyContacts: string[]
    dataRetention: number
  }
  integrations: {
    calendarSync: boolean
    healthApps: boolean
    backupEnabled: boolean
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

export function useReminderSettings() {
  const { data, error, mutate, isLoading } = useSWR('/api/reminder-settings', fetcher, {
    refreshInterval: 60000, // Actualizar cada minuto
    revalidateOnFocus: true
  })

  return {
    settings: data?.data?.settings || null,
    isLoading,
    isError: error,
    mutate
  }
}

export async function saveReminderSettings(settings: ReminderSettings) {
  const token = getToken()
  const userId = getUserId()

  if (!token || !userId) {
    throw new Error('No hay token de autenticación o userId')
  }

  const response = await fetch('/api/reminder-settings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      ...settings,
      userId
    })
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Error guardando configuración')
  }

  return response.json()
} 