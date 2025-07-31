import useSWR from 'swr'
import { getToken, getUserId } from '@/lib/api-functions'

interface AdviceAuthor {
  id: string
  name: string
  credentials: string
  avatar?: string
  verified: boolean
  bio?: string
  specialty?: string
  experience?: number
  website?: string
  socialMedia?: any
}

interface AdviceCategory {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  color?: string
  isActive: boolean
  sortOrder: number
}

interface AdviceTag {
  id: string
  name: string
  slug: string
  color?: string
  isActive: boolean
}

interface Advice {
  id: string
  title: string
  content: string
  excerpt?: string
  difficulty: 'FACIL' | 'INTERMEDIO' | 'AVANZADO'
  readTime: number
  featured: boolean
  trending: boolean
  published: boolean
  publishedAt: string
  authorId: string
  categoryId: string
  createdAt: string
  updatedAt: string
  author: AdviceAuthor
  category: AdviceCategory
  tags: AdviceTag[]
  _count: {
    likes: number
    bookmarks: number
    shares: number
    views: number
  }
  userLiked?: boolean
  userBookmarked?: boolean
}

interface AdviceFilters {
  category?: string
  difficulty?: string
  featured?: boolean
  trending?: boolean
  search?: string
  tags?: string[]
  sortBy?: string
}

const fetcher = async (url: string) => {
  const token = getToken()
  const userId = getUserId()

  if (!token) {
    throw new Error('No hay token de autenticación')
  }

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  if (!response.ok) {
    throw new Error('Error fetching data')
  }

  return response.json()
}

export function useAdvice(filters: AdviceFilters = {}) {
  const queryParams = new URLSearchParams()
  
  if (filters.category) queryParams.append('category', filters.category)
  if (filters.difficulty) queryParams.append('difficulty', filters.difficulty)
  if (filters.featured !== undefined) queryParams.append('featured', filters.featured.toString())
  if (filters.trending !== undefined) queryParams.append('trending', filters.trending.toString())
  if (filters.search) queryParams.append('search', filters.search)
  if (filters.tags?.length) queryParams.append('tags', filters.tags.join(','))
  if (filters.sortBy) queryParams.append('sortBy', filters.sortBy)

  const url = `/api/advice${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  
  const { data, error, mutate, isLoading } = useSWR(url, fetcher, { 
    refreshInterval: 30000,
    revalidateOnFocus: true
  })
  
  return {
    advice: data?.advice || [],
    isLoading,
    isError: error,
    mutate
  }
}

export function useAdviceById(id: string) {
  const { data, error, mutate, isLoading } = useSWR(
    id ? `/api/advice/${id}` : null, 
    fetcher, 
    { 
      refreshInterval: 30000,
      revalidateOnFocus: true
    }
  )
  
  return {
    advice: data?.data,
    isLoading,
    isError: error,
    mutate
  }
}

export function useAdviceCategories() {
  const { data, error, mutate, isLoading } = useSWR('/api/advice/categories', fetcher, { 
    refreshInterval: 60000,
    revalidateOnFocus: true
  })
  
  return {
    categories: data?.data || [],
    isLoading,
    isError: error,
    mutate
  }
}

export function useAdviceTags() {
  const { data, error, mutate, isLoading } = useSWR('/api/advice/tags', fetcher, { 
    refreshInterval: 60000,
    revalidateOnFocus: true
  })
  
  return {
    tags: data?.data || [],
    isLoading,
    isError: error,
    mutate
  }
}

export async function likeAdvice(adviceId: string) {
  const token = getToken()
  const userId = getUserId()

  console.log('likeAdvice - token:', token ? 'presente' : 'ausente')
  console.log('likeAdvice - userId:', userId)

  if (!token || !userId) {
    throw new Error('No hay token de autenticación o userId')
  }

  const response = await fetch(`/api/advice/${adviceId}/like`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ userId })
  })

  console.log('likeAdvice - response status:', response.status)
  console.log('likeAdvice - response ok:', response.ok)

  if (!response.ok) {
    const errorData = await response.json()
    console.log('likeAdvice - error data:', errorData)
    throw new Error(errorData.error || 'Error al dar like')
  }

  return response.json()
}

export async function unlikeAdvice(adviceId: string) {
  const token = getToken()
  const userId = getUserId()

  if (!token || !userId) {
    throw new Error('No hay token de autenticación o userId')
  }

  const response = await fetch(`/api/advice/${adviceId}/like`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ userId })
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Error al quitar like')
  }

  return response.json()
}

export async function bookmarkAdvice(adviceId: string) {
  const token = getToken()
  const userId = getUserId()

  if (!token || !userId) {
    throw new Error('No hay token de autenticación o userId')
  }

  const response = await fetch(`/api/advice/${adviceId}/bookmark`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ userId })
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Error al guardar bookmark')
  }

  return response.json()
}

export async function removeBookmark(adviceId: string) {
  const token = getToken()
  const userId = getUserId()

  if (!token || !userId) {
    throw new Error('No hay token de autenticación o userId')
  }

  const response = await fetch(`/api/advice/${adviceId}/bookmark`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ userId })
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Error al quitar bookmark')
  }

  return response.json()
}

export async function shareAdvice(adviceId: string, platform?: string) {
  const token = getToken()
  const userId = getUserId()

  if (!token || !userId) {
    throw new Error('No hay token de autenticación o userId')
  }

  const response = await fetch(`/api/advice/${adviceId}/share`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ userId, platform })
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Error al compartir')
  }

  return response.json()
}

export async function viewAdvice(adviceId: string) {
  const token = getToken()
  const userId = getUserId()

  const response = await fetch(`/api/advice/${adviceId}/view`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify({ 
      userId: userId || null,
      ipAddress: null, // Se capturará en el servidor
      userAgent: navigator.userAgent
    })
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Error al registrar vista')
  }

  return response.json()
} 