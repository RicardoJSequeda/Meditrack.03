import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'

const emergencyContactSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  relationship: z.string().min(1, 'La relación es requerida'),
  phone: z.string().min(1, 'El teléfono es requerido'),
  isPrimary: z.boolean().default(false),
  isOnline: z.boolean().default(false),
  lastSeen: z.string().datetime('Fecha de última vista inválida').optional(),
  userId: z.string().min(1, 'ID de usuario requerido')
})

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Creando contacto de emergencia...')
    
    const body = await request.json()
    console.log('📝 Datos recibidos:', JSON.stringify(body, null, 2))
    
    const contactData = emergencyContactSchema.parse(body)
    console.log('✅ Datos validados:', JSON.stringify(contactData, null, 2))

    // Convert date if provided
    const processedData = {
      ...contactData,
      lastSeen: contactData.lastSeen ? new Date(contactData.lastSeen) : undefined
    }

    console.log('🚀 Insertando contacto en Supabase...')
    
    const { data: contact, error } = await supabase
      .from('emergency_contacts')
      .insert({
        id: crypto.randomUUID(),
        ...processedData
      })
      .select('*')
      .single()

    if (error) {
      console.error('❌ Error creando contacto:', error)
      return NextResponse.json(
        { success: false, error: `Error creating emergency contact: ${error.message}` },
        { status: 400 }
      )
    }

    console.log('✅ Contacto creado exitosamente:', contact)

    return NextResponse.json({
      success: true,
      data: contact
    })
  } catch (error) {
    console.error('❌ Error en POST /emergency-contacts:', error)
    
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

    console.log('🔍 Obteniendo contactos de emergencia para usuario:', userId)

    const { data: contacts, error } = await supabase
      .from('emergency_contacts')
      .select('*')
      .eq('userId', userId)
      .order('isPrimary', { ascending: false })
      .order('name', { ascending: true })

    if (error) {
      console.error('❌ Error obteniendo contactos:', error)
      return NextResponse.json(
        { success: false, error: `Error fetching emergency contacts: ${error.message}` },
        { status: 400 }
      )
    }

    console.log('✅ Contactos obtenidos:', contacts.length)

    return NextResponse.json({
      success: true,
      data: contacts
    })
  } catch (error) {
    console.error('❌ Error en GET /emergency-contacts:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 