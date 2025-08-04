import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const difficulty = searchParams.get('difficulty')
    const tag = searchParams.get('tag')
    const sortBy = searchParams.get('sortBy') || 'trending'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Construir la consulta base
    let query = supabase
      .from('advice')
      .select(`
        *,
        author:advice_authors(name, credentials, avatar, verified),
        category:advice_categories(name, description, color),
        tags:advice_tag_relations(
          tag:advice_tags(name, color)
        ),
        _count:advice_likes(count),
        advice_likes(count),
        advice_bookmarks(count),
        advice_shares(count),
        advice_views(count)
      `)

    // Aplicar filtros
    if (category && category !== 'all') {
      query = query.eq('categoryId', category)
    }

    if (difficulty && difficulty !== 'all') {
      query = query.eq('difficulty', difficulty)
    }

    // Aplicar ordenamiento
    switch (sortBy) {
      case 'trending':
        query = query.order('trending', { ascending: false }).order('createdAt', { ascending: false })
        break
      case 'popular':
        query = query.order('advice_likes.count', { ascending: false })
        break
      case 'recent':
        query = query.order('createdAt', { ascending: false })
        break
      case 'bookmarks':
        query = query.order('advice_bookmarks.count', { ascending: false })
        break
      default:
        query = query.order('createdAt', { ascending: false })
    }

    // Aplicar paginación
    query = query.range(offset, offset + limit - 1)

    const { data: advice, error } = await query

    if (error) {
      console.error('Error fetching advice:', error)
      return NextResponse.json({ error: 'Error al obtener consejos' }, { status: 500 })
    }

    // Transformar los datos para el frontend
    const transformedAdvice = advice?.map(item => ({
      id: item.id,
      title: item.title,
      content: item.content,
      category: item.category?.name?.toLowerCase().replace(/\s+/g, '-') || 'general',
      author: {
        name: item.author?.name || 'Autor Desconocido',
        credentials: item.author?.credentials || '',
        avatar: item.author?.avatar || '/placeholder.svg',
        verified: item.author?.verified || false,
      },
      difficulty: item.difficulty?.toLowerCase() || 'facil',
      readTime: item.readTime || 3,
      likes: item._count?.advice_likes || 0,
      bookmarks: item._count?.advice_bookmarks || 0,
      shares: item._count?.advice_shares || 0,
      tags: item.tags?.map((t: any) => t.tag?.name).filter(Boolean) || [],
      publishedAt: item.createdAt,
      trending: item.trending || false,
      featured: item.featured || false,
    })) || []

    // Filtrar por tag si se especifica
    let filteredAdvice = transformedAdvice
    if (tag && tag !== 'all') {
      filteredAdvice = transformedAdvice.filter(item => 
        item.tags.some((t: string) => t.toLowerCase().includes(tag.toLowerCase()))
      )
    }

    return NextResponse.json({
      advice: filteredAdvice,
      total: filteredAdvice.length,
      hasMore: filteredAdvice.length === limit
    })

  } catch (error) {
    console.error('Error in advice API:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
} 