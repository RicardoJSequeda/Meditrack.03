import useSWR from 'swr'

const fetcher = async (url: string) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  })
  if (!res.ok) throw new Error('Error al cargar notas')
  return res.json()
}

export function useNotes() {
  const { data, error, mutate, isLoading } = useSWR('/api/notes', fetcher, { refreshInterval: 5000 })
  return {
    notes: data?.data || [],
    isLoading,
    isError: error,
    mutate
  }
}

export async function updateNote(id: string, data: any) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const res = await fetch('/api/notes', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ id, ...data })
  })
  if (!res.ok) throw new Error('Error al actualizar nota')
  return res.json()
}

export async function deleteNote(id: string) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const res = await fetch('/api/notes', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ id })
  })
  if (!res.ok) throw new Error('Error al eliminar nota')
  return res.json()
} 