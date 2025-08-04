import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { verifyToken } from '@/lib/auth'

// GET - Obtener estadísticas del usuario
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

    // Obtener estadísticas en paralelo
    const [
      totalDiagnoses,
      activeDiagnoses,
      totalTreatments,
      activeTreatments,
      totalEvents,
      totalDocuments,
      totalAppointments,
      upcomingAppointments,
      totalReminders,
      pendingReminders,
      totalNotes
    ] = await Promise.all([
      // Diagnósticos
      prisma.diagnosis.count({ where: { userId: decoded.userId } }),
      prisma.diagnosis.count({ where: { userId: decoded.userId, status: 'ACTIVA' } }),
      
      // Tratamientos
      prisma.treatment.count({ where: { userId: decoded.userId } }),
      prisma.treatment.count({ where: { userId: decoded.userId, status: 'ACTIVO' } }),
      
      // Eventos médicos
      prisma.medicalEvent.count({ where: { userId: decoded.userId } }),
      
      // Documentos médicos
      prisma.medicalDocument.count({ where: { userId: decoded.userId } }),
      
      // Citas
      prisma.appointment.count({ where: { userId: decoded.userId } }),
      prisma.appointment.count({ 
        where: { 
          userId: decoded.userId,
          date: { gte: new Date() },
          status: { in: ['SCHEDULED', 'CONFIRMED'] }
        }
      }),
      
      // Recordatorios
      prisma.reminder.count({ where: { userId: decoded.userId } }),
      prisma.reminder.count({ 
        where: { 
          userId: decoded.userId,
          isCompleted: false,
          date: { gte: new Date() }
        }
      }),
      
      // Notas médicas
      prisma.medicalNote.count({ where: { userId: decoded.userId } })
    ])

    // Obtener diagnósticos recientes
    const recentDiagnoses = await prisma.diagnosis.findMany({
      where: { userId: decoded.userId },
      orderBy: { diagnosedDate: 'desc' },
      take: 5,
      select: {
        id: true,
        condition: true,
        diagnosedDate: true,
        doctor: true,
        status: true
      }
    })

    // Obtener próximas citas
    const upcomingAppointmentsList = await prisma.appointment.findMany({
      where: { 
        userId: decoded.userId,
        date: { gte: new Date() },
        status: { in: ['SCHEDULED', 'CONFIRMED'] }
      },
      orderBy: { date: 'asc' },
      take: 5,
      select: {
        id: true,
        title: true,
        date: true,
        doctor: true,
        location: true
      }
    })

    // Obtener recordatorios pendientes
    const pendingRemindersList = await prisma.reminder.findMany({
      where: { 
        userId: decoded.userId,
        isCompleted: false,
        date: { gte: new Date() }
      },
      orderBy: { date: 'asc' },
      take: 5,
      select: {
        id: true,
        title: true,
        date: true,
        type: true
      }
    })

    const stats = {
      summary: {
        totalDiagnoses,
        activeDiagnoses,
        totalTreatments,
        activeTreatments,
        totalEvents,
        totalDocuments,
        totalAppointments,
        upcomingAppointments,
        totalReminders,
        pendingReminders,
        totalNotes
      },
      recent: {
        diagnoses: recentDiagnoses,
        appointments: upcomingAppointmentsList,
        reminders: pendingRemindersList
      }
    }

    return NextResponse.json({ data: stats })
  } catch (error) {
    console.error('Error al obtener estadísticas:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 