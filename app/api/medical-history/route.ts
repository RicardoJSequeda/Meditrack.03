import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/middleware'
import { prisma } from '@/lib/database'

async function handler(request: NextRequest & { user: any }) {
  try {
    const userId = request.user.id

    // Get all medical data for the user
    const [diagnoses, treatments, events, documents] = await Promise.all([
      prisma.diagnosis.findMany({
        where: { userId },
        include: {
          treatments: true
        },
        orderBy: { diagnosedDate: 'desc' }
      }),
      prisma.treatment.findMany({
        where: { userId },
        include: {
          diagnosis: true
        },
        orderBy: { startDate: 'desc' }
      }),
      prisma.medicalEvent.findMany({
        where: { userId },
        orderBy: { date: 'desc' }
      }),
      prisma.medicalDocument.findMany({
        where: { userId },
        orderBy: { date: 'desc' }
      })
    ])

    // Calculate statistics
    const stats = {
      diagnoses: diagnoses.length,
      treatments: treatments.length,
      events: events.length,
      documents: documents.length,
      activeTreatments: treatments.filter((t: any) => t.status === 'ACTIVO').length,
      controlledConditions: diagnoses.filter((d: any) => d.status === 'CONTROLADA').length,
      activeConditions: diagnoses.filter((d: any) => d.status === 'ACTIVA').length
    }

    return NextResponse.json({
      success: true,
      data: {
        user: request.user,
        diagnoses,
        treatments,
        events,
        documents,
        stats
      }
    })
  } catch (error) {
    console.error('Medical history error:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export const GET = withAuth(handler) 