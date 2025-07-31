import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { userId } = await request.json()

    console.log('API like - adviceId:', id)
    console.log('API like - userId:', userId)

    if (!userId) {
      console.log('API like - error: usuario requerido')
      return NextResponse.json({ error: 'Usuario requerido' }, { status: 400 })
    }

    // Verificar si ya existe el like
    const { data: existingLike, error: checkError } = await supabase
      .from('advice_likes')
      .select('id')
      .eq('adviceId', id)
      .eq('userId', userId)
      .single()

    console.log('API like - existingLike:', existingLike)
    console.log('API like - checkError:', checkError)

    if (existingLike) {
      // Si ya existe, eliminar el like
      const { error: deleteError } = await supabase
        .from('advice_likes')
        .delete()
        .eq('adviceId', id)
        .eq('userId', userId)

      console.log('API like - deleteError:', deleteError)

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

      console.log('API like - insertError:', insertError)

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