import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data: tags, error } = await supabase
      .from('advice_tags')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching tags:', error)
      return NextResponse.json({ error: 'Error al obtener tags' }, { status: 500 })
    }

    return NextResponse.json(tags)

  } catch (error) {
    console.error('Error in tags API:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
} 