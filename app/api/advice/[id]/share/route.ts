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
    const { userId, platform } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'Usuario requerido' }, { status: 400 })
    }

    // Registrar el share
    const { error: insertError } = await supabase
      .from('advice_shares')
      .insert({
        adviceId: id,
        userId: userId,
        platform: platform || 'web',
        createdAt: new Date().toISOString()
      })

    if (insertError) {
      console.error('Error recording share:', insertError)
      return NextResponse.json({ error: 'Error al registrar share' }, { status: 500 })
    }

    return NextResponse.json({ shared: true })

  } catch (error) {
    console.error('Error in share API:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
} 