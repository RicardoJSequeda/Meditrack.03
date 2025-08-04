import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Tipos de archivos permitidos
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/vnd.ms-excel', // .xls
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/msword', // .doc
  'text/plain', // .txt
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp'
]

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Iniciando subida de archivo...')
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    const userId = formData.get('userId') as string
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      )
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId es requerido' },
        { status: 400 }
      )
    }

    // Validar tipo de archivo
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Tipo de archivo no permitido. Solo se permiten: PDF, Excel, Word, TXT e imágenes' 
        },
        { status: 400 }
      )
    }

    // Validar tamaño del archivo
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'El archivo es demasiado grande. Máximo 10MB' 
        },
        { status: 400 }
      )
    }

    // Generar nombre único para el archivo
    const fileExtension = file.name.split('.').pop()
    const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`
    
    console.log('📁 Subiendo archivo:', fileName)
    console.log('📊 Tamaño:', file.size, 'bytes')
    console.log('📋 Tipo:', file.type)

    // Convertir File a Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Subir archivo a Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('medical-documents')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      console.error('❌ Error subiendo archivo:', uploadError)
      return NextResponse.json(
        { success: false, error: `Error subiendo archivo: ${uploadError.message}` },
        { status: 500 }
      )
    }

    // Obtener URL pública del archivo
    const { data: urlData } = supabase.storage
      .from('medical-documents')
      .getPublicUrl(fileName)

    console.log('✅ Archivo subido exitosamente')
    console.log('🔗 URL pública:', urlData.publicUrl)

    return NextResponse.json({
      success: true,
      data: {
        fileName: file.name,
        fileUrl: urlData.publicUrl,
        fileSize: file.size,
        fileType: file.type,
        storagePath: fileName
      }
    })

  } catch (error) {
    console.error('❌ Error en POST /upload-file:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 