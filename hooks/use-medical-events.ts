import useSWR from 'swr'

const fetcher = async (url: string) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  
  // Decodificar el token para obtener el userId
  let userId = null
  if (token) {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))
      const payload = JSON.parse(jsonPayload)
      userId = payload.userId
    } catch (error) {
      console.error('Error decodificando token:', error)
    }
  }

  // Agregar userId como parámetro de consulta
  const urlWithUserId = userId ? `${url}?userId=${userId}` : url
  
  const res = await fetch(urlWithUserId, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  })
  if (!res.ok) throw new Error('Error al cargar eventos médicos')
  return res.json()
}

export function useMedicalEvents() {
  const { data, error, mutate, isLoading } = useSWR('/api/medical-events', fetcher, { refreshInterval: 5000 })
  return {
    medicalEvents: data?.data || [],
    isLoading,
    isError: error,
    mutate
  }
} 