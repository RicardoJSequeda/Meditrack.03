import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

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

    console.log('🔍 Calculando estadísticas médicas para usuario:', userId)

    // Obtener diagnósticos
    const { data: diagnoses, error: diagnosesError } = await supabase
      .from('diagnoses')
      .select('*')
      .eq('userId', userId)

    if (diagnosesError) {
      console.error('❌ Error obteniendo diagnósticos:', diagnosesError)
      return NextResponse.json(
        { success: false, error: `Error fetching diagnoses: ${diagnosesError.message}` },
        { status: 400 }
      )
    }

    // Obtener tratamientos
    const { data: treatments, error: treatmentsError } = await supabase
      .from('treatments')
      .select('*')
      .eq('userId', userId)

    if (treatmentsError) {
      console.error('❌ Error obteniendo tratamientos:', treatmentsError)
      return NextResponse.json(
        { success: false, error: `Error fetching treatments: ${treatmentsError.message}` },
        { status: 400 }
      )
    }

    // Obtener eventos médicos
    const { data: events, error: eventsError } = await supabase
      .from('medical_events')
      .select('*')
      .eq('userId', userId)
      .order('date', { ascending: false })

    if (eventsError) {
      console.error('❌ Error obteniendo eventos médicos:', eventsError)
      return NextResponse.json(
        { success: false, error: `Error fetching medical events: ${eventsError.message}` },
        { status: 400 }
      )
    }

    // Obtener documentos médicos
    const { data: documents, error: documentsError } = await supabase
      .from('medical_documents')
      .select('*')
      .eq('userId', userId)

    if (documentsError) {
      console.error('❌ Error obteniendo documentos médicos:', documentsError)
      return NextResponse.json(
        { success: false, error: `Error fetching medical documents: ${documentsError.message}` },
        { status: 400 }
      )
    }

    // Calcular estadísticas de salud general
    const totalDiagnoses = diagnoses?.length || 0
    const controlledDiagnoses = diagnoses?.filter(d => d.status === 'CONTROLADA').length || 0
    const activeDiagnoses = diagnoses?.filter(d => d.status === 'ACTIVA').length || 0
    const resolvedDiagnoses = diagnoses?.filter(d => d.status === 'RESUELTA').length || 0

    const generalHealthPercentage = totalDiagnoses > 0 
      ? Math.round(((controlledDiagnoses + resolvedDiagnoses) / totalDiagnoses) * 100)
      : 100

    let generalHealthStatus: 'Excelente' | 'Bueno' | 'Regular' | 'Necesita Atención'
    if (generalHealthPercentage >= 80) generalHealthStatus = 'Excelente'
    else if (generalHealthPercentage >= 60) generalHealthStatus = 'Bueno'
    else if (generalHealthPercentage >= 40) generalHealthStatus = 'Regular'
    else generalHealthStatus = 'Necesita Atención'

    // Calcular estadísticas de adherencia
    const totalTreatments = treatments?.length || 0
    const activeTreatments = treatments?.filter(t => t.status === 'ACTIVO').length || 0
    const completedTreatments = treatments?.filter(t => t.status === 'COMPLETADO').length || 0
    const suspendedTreatments = treatments?.filter(t => t.status === 'SUSPENDIDO').length || 0

    const adherencePercentage = totalTreatments > 0 
      ? Math.round(((activeTreatments + completedTreatments) / totalTreatments) * 100)
      : 100

    let adherenceStatus: 'Activo' | 'Regular' | 'Bajo'
    if (adherencePercentage >= 80) adherenceStatus = 'Activo'
    else if (adherencePercentage >= 50) adherenceStatus = 'Regular'
    else adherenceStatus = 'Bajo'

    // Calcular estadísticas de eventos
    const totalEvents = events?.length || 0
    const lastEvent = events?.[0]
    const lastAppointment = lastEvent ? new Date(lastEvent.date).toLocaleDateString('es-ES') : 'N/A'
    
    // Buscar próximo control en diagnósticos
    const nextCheckup = diagnoses
      ?.filter(d => d.nextCheckup && new Date(d.nextCheckup) > new Date())
      ?.sort((a, b) => new Date(a.nextCheckup).getTime() - new Date(b.nextCheckup).getTime())[0]
    
    const nextCheckupDate = nextCheckup?.nextCheckup 
      ? new Date(nextCheckup.nextCheckup).toLocaleDateString('es-ES')
      : 'No programado'

    let eventsStatus: 'Reciente' | 'Pendiente' | 'Actualizado'
    if (lastEvent) {
      const daysSinceLastEvent = Math.floor((Date.now() - new Date(lastEvent.date).getTime()) / (1000 * 60 * 60 * 24))
      if (daysSinceLastEvent <= 7) eventsStatus = 'Reciente'
      else if (daysSinceLastEvent <= 30) eventsStatus = 'Actualizado'
      else eventsStatus = 'Pendiente'
    } else {
      eventsStatus = 'Pendiente'
    }

    // Calcular estadísticas de documentos
    const totalDocuments = documents?.length || 0
    const analysisDocuments = documents?.filter(d => d.type === 'ANALISIS').length || 0
    const otherDocuments = totalDocuments - analysisDocuments

    let documentsStatus: 'Actualizado' | 'Pendiente' | 'Completo'
    if (totalDocuments >= 20) documentsStatus = 'Completo'
    else if (totalDocuments >= 10) documentsStatus = 'Actualizado'
    else documentsStatus = 'Pendiente'

    const stats = {
      generalHealth: {
        percentage: generalHealthPercentage,
        controlled: controlledDiagnoses,
        monitoring: activeDiagnoses,
        status: generalHealthStatus
      },
      adherence: {
        percentage: adherencePercentage,
        active: activeTreatments,
        completed: completedTreatments,
        status: adherenceStatus
      },
      events: {
        total: totalEvents,
        lastAppointment,
        nextCheckup: nextCheckupDate,
        status: eventsStatus
      },
      documents: {
        total: totalDocuments,
        analysis: analysisDocuments,
        others: otherDocuments,
        status: documentsStatus
      }
    }

    console.log('✅ Estadísticas calculadas exitosamente:', stats)

    return NextResponse.json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.error('❌ Error en GET /medical-stats:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 