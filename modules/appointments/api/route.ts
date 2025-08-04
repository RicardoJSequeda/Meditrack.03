import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { verifyToken } from '@/lib/auth'
import { z } from 'zod'

// Schema de validación para citas
const AppointmentSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  date: z.string().datetime(),
  duration: z.number().min(15, 'La duración mínima es 15 minutos'),
  doctor: z.string().min(1, 'El doctor es requerido'),
  specialty: z.string().min(1, 'La especialidad es requerida'),
  location: z.string().min(1, 'La ubicación es requerida'),
  notes: z.string().optional(),
  status: z.enum(['SCHEDULED', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW']).default('SCHEDULED')
})

// GET - Obtener todas las citas del usuario
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

    const appointments = await prisma.appointment.findMany({
      where: { userId: decoded.userId },
      orderBy: { date: 'asc' }
    })

    return NextResponse.json({ data: appointments })
  } catch (error) {
    console.error('Error al obtener citas:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Crear nueva cita
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
    const validatedData = AppointmentSchema.parse(body)
    
    // Crear cita
    const appointment = await prisma.appointment.create({
      data: {
        ...validatedData,
        userId: decoded.userId,
        date: new Date(validatedData.date)
      }
    })

    return NextResponse.json({ 
      message: 'Cita creada exitosamente',
      data: appointment 
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      )
    }
    
    console.error('Error al crear cita:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 