import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'Usuario requerido' }, { status: 400 })
    }

    // Verificar si ya existe el bookmark
    const { data: existingBookmark } = await supabase
      .from('advice_bookmarks')
      .select('id')
      .eq('adviceId', id)
      .eq('userId', userId)
      .single()

    if (existingBookmark) {
      // Si ya existe, eliminar el bookmark
      const { error: deleteError } = await supabase
        .from('advice_bookmarks')
        .delete()
        .eq('adviceId', id)
        .eq('userId', userId)

      if (deleteError) {
        console.error('Error removing bookmark:', deleteError)
        return NextResponse.json({ error: 'Error al quitar bookmark' }, { status: 500 })
      }

      return NextResponse.json({ bookmarked: false })
    } else {
      // Si no existe, agregar el bookmark
      const { error: insertError } = await supabase
        .from('advice_bookmarks')
        .insert({
          adviceId: id,
          userId: userId,
          createdAt: new Date().toISOString()
        })

      if (insertError) {
        console.error('Error adding bookmark:', insertError)
        return NextResponse.json({ error: 'Error al agregar bookmark' }, { status: 500 })
      }

      return NextResponse.json({ bookmarked: true })
    }

  } catch (error) {
    console.error('Error in bookmark API:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
} 