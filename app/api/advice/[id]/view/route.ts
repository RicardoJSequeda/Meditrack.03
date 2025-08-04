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

    // Registrar la vista
    const { error: insertError } = await supabase
      .from('advice_views')
      .insert({
        adviceId: id,
        userId: userId,
        viewedAt: new Date().toISOString()
      })

    if (insertError) {
      console.error('Error recording view:', insertError)
      return NextResponse.json({ error: 'Error al registrar vista' }, { status: 500 })
    }

    return NextResponse.json({ viewed: true })

  } catch (error) {
    console.error('Error in view API:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
} 