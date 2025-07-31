import useSWR from 'swr'

const fetcher = async (url: string) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  })
  if (!res.ok) throw new Error('Error al cargar contactos de emergencia')
  return res.json()
}

export function useEmergencyContacts() {
  const { data, error, mutate, isLoading } = useSWR('/api/emergency-contacts', fetcher)
  return {
    contacts: data?.data || [],
    isLoading,
    isError: error,
    mutate
  }
}

export async function saveEmergencyContact(contact: any) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const res = await fetch('/api/emergency-contacts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(contact)
  })
  if (!res.ok) throw new Error('Error al guardar contacto de emergencia')
  return res.json()
} 