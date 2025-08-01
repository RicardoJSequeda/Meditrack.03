import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'

const noteSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  content: z.string().min(1, 'El contenido es requerido'),
  category: z.string().optional(),
  isPinned: z.boolean().default(false),
  isFavorite: z.boolean().default(false),
  isArchived: z.boolean().default(false),
  userId: z.string().min(1, 'ID de usuario requerido')
})

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Creando nota médica...')
    
    const body = await request.json()
    console.log('📝 Datos recibidos:', JSON.stringify(body, null, 2))
    
    const noteData = noteSchema.parse(body)
    console.log('✅ Datos validados:', JSON.stringify(noteData, null, 2))

    console.log('🚀 Insertando nota en Supabase...')
    
    const { data: note, error } = await supabase
      .from('medical_notes')
      .insert({
        id: crypto.randomUUID(),
        ...noteData
      })
      .select('*')
      .single()

    if (error) {
      console.error('❌ Error creando nota:', error)
      return NextResponse.json(
        { success: false, error: `Error creating note: ${error.message}` },
        { status: 400 }
      )
    }

    console.log('✅ Nota creada exitosamente:', note)

    return NextResponse.json({
      success: true,
      data: note
    })
  } catch (error) {
    console.error('❌ Error en POST /notes:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId es requerido' },
        { status: 400 }
      )
    }

    console.log('🔍 Obteniendo notas para usuario:', userId)

    const { data: notes, error } = await supabase
      .from('medical_notes')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false })

    if (error) {
      console.error('❌ Error obteniendo notas:', error)
      return NextResponse.json(
        { success: false, error: `Error fetching notes: ${error.message}` },
        { status: 400 }
      )
    }

    console.log('✅ Notas obtenidas:', notes.length)

    return NextResponse.json({
      success: true,
      data: notes
    })
  } catch (error) {
    console.error('❌ Error en GET /notes:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 