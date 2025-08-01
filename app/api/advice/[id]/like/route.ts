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

    // Verificar si ya existe el like
    const { data: existingLike } = await supabase
      .from('advice_likes')
      .select('id')
      .eq('adviceId', id)
      .eq('userId', userId)
      .single()

    if (existingLike) {
      // Si ya existe, eliminar el like
      const { error: deleteError } = await supabase
        .from('advice_likes')
        .delete()
        .eq('adviceId', id)
        .eq('userId', userId)

      if (deleteError) {
        console.error('Error removing like:', deleteError)
        return NextResponse.json({ error: 'Error al quitar like' }, { status: 500 })
      }

      return NextResponse.json({ liked: false })
    } else {
      // Si no existe, agregar el like
      const { error: insertError } = await supabase
        .from('advice_likes')
        .insert({
          adviceId: id,
          userId: userId,
          createdAt: new Date().toISOString()
        })

      if (insertError) {
        console.error('Error adding like:', insertError)
        return NextResponse.json({ error: 'Error al agregar like' }, { status: 500 })
      }

      return NextResponse.json({ liked: true })
    }

  } catch (error) {
    console.error('Error in like API:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
} 