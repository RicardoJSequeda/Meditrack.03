import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'

const medicalDocumentSchema = z.object({
  type: z.enum(['ANALISIS', 'RADIOGRAFIA', 'INFORME', 'RECETA', 'CERTIFICADO', 'NOTA']),
  title: z.string().min(1, 'El título es requerido'),
  date: z.string().datetime('Fecha inválida'),
  doctor: z.string().min(1, 'El doctor es requerido'),
  category: z.string().min(1, 'La categoría es requerida'),
  description: z.string().min(1, 'La descripción es requerida'),
  fileUrl: z.string().optional(),
  fileName: z.string().optional(),
  fileSize: z.number().optional(),
  fileType: z.string().optional(),
  results: z.string().optional(),
  recommendations: z.string().optional(),
  userId: z.string().min(1, 'ID de usuario requerido')
})

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Creando documento médico...')
    
    const body = await request.json()
    console.log('📝 Datos recibidos:', JSON.stringify(body, null, 2))
    
    const documentData = medicalDocumentSchema.parse(body)
    console.log('✅ Datos validados:', JSON.stringify(documentData, null, 2))

    // Convert dates
    const processedData = {
      ...documentData,
      date: new Date(documentData.date)
    }

    console.log('🚀 Insertando documento médico en Supabase...')
    
    const { data: document, error } = await supabase
      .from('medical_documents')
      .insert({
        id: crypto.randomUUID(),
        ...processedData
      })
      .select('*')
      .single()

    if (error) {
      console.error('❌ Error creando documento médico:', error)
      return NextResponse.json(
        { success: false, error: `Error creating medical document: ${error.message}` },
        { status: 400 }
      )
    }

    console.log('✅ Documento médico creado exitosamente:', document)

    return NextResponse.json({
      success: true,
      data: document
    })
  } catch (error) {
    console.error('❌ Error en POST /medical-documents:', error)
    
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

    console.log('🔍 Obteniendo documentos médicos para usuario:', userId)

    const { data: documents, error } = await supabase
      .from('medical_documents')
      .select('*')
      .eq('userId', userId)
      .order('date', { ascending: false })

    if (error) {
      console.error('❌ Error obteniendo documentos médicos:', error)
      return NextResponse.json(
        { success: false, error: `Error fetching medical documents: ${error.message}` },
        { status: 400 }
      )
    }

    console.log('✅ Documentos médicos obtenidos:', documents.length)

    return NextResponse.json({
      success: true,
      data: documents
    })
  } catch (error) {
    console.error('❌ Error en GET /medical-documents:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 