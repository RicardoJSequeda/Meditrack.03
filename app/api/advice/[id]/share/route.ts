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

    // Incrementar el contador de shares
    const { error: updateError } = await supabase
      .from('advice_shares')
      .upsert({
        adviceId: id,
        userId: userId,
        createdAt: new Date().toISOString()
      })

    if (updateError) {
      console.error('Error updating share count:', updateError)
      return NextResponse.json({ error: 'Error al registrar share' }, { status: 500 })
    }

    return NextResponse.json({ shared: true })

  } catch (error) {
    console.error('Error in share API:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
} 