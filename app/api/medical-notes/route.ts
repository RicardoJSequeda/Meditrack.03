import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { verifyToken } from '@/lib/auth'
import { z } from 'zod'

// Schema de validación para notas médicas
const MedicalNoteSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  content: z.string().min(1, 'El contenido es requerido'),
  category: z.string().optional()
})

// GET - Obtener todas las notas médicas del usuario
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Token no proporcionado' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    const notes = await prisma.medicalNote.findMany({
      where: { userId: decoded.userId },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ data: notes })
  } catch (error) {
    console.error('Error al obtener notas médicas:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Crear nueva nota médica
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Token no proporcionado' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    const body = await request.json()
    
    // Validar datos
    const validatedData = MedicalNoteSchema.parse(body)
    
    // Crear nota médica
    const note = await prisma.medicalNote.create({
      data: {
        ...validatedData,
        userId: decoded.userId
      }
    })

    return NextResponse.json({ 
      message: 'Nota médica creada exitosamente',
      data: note 
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      )
    }
    
    console.error('Error al crear nota médica:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 