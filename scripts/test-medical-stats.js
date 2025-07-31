const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son requeridos')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Token de prueba (reemplaza con un token válido)
const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjODY4ZWIzZC04ZWViLTQ0OGYtYTRkMC1lYWZmYWJmYmNmMjMiLCJpYXQiOjE3NTM4MjAwMDAwMDB9.test'

async function testMedicalStats() {
  try {
    console.log('🧪 Probando API de estadísticas médicas...')
    
    // Simular petición HTTP a la API
    const userId = 'c868eb3d-8eeb-448f-a4d0-eaffabfbcf23'
    
    console.log('📊 1. Obteniendo diagnósticos...')
    const { data: diagnoses, error: diagnosesError } = await supabase
      .from('diagnoses')
      .select('*')
      .eq('userId', userId)
    
    if (diagnosesError) {
      console.error('❌ Error obteniendo diagnósticos:', diagnosesError)
      return
    }
    
    console.log(`✅ Diagnósticos encontrados: ${diagnoses?.length || 0}`)
    
    console.log('📊 2. Obteniendo tratamientos...')
    const { data: treatments, error: treatmentsError } = await supabase
      .from('treatments')
      .select('*')
      .eq('userId', userId)
    
    if (treatmentsError) {
      console.error('❌ Error obteniendo tratamientos:', treatmentsError)
      return
    }
    
    console.log(`✅ Tratamientos encontrados: ${treatments?.length || 0}`)
    
    console.log('📊 3. Obteniendo eventos médicos...')
    const { data: events, error: eventsError } = await supabase
      .from('medical_events')
      .select('*')
      .eq('userId', userId)
      .order('date', { ascending: false })
    
    if (eventsError) {
      console.error('❌ Error obteniendo eventos médicos:', eventsError)
      return
    }
    
    console.log(`✅ Eventos médicos encontrados: ${events?.length || 0}`)
    
    console.log('📊 4. Obteniendo documentos médicos...')
    const { data: documents, error: documentsError } = await supabase
      .from('medical_documents')
      .select('*')
      .eq('userId', userId)
    
    if (documentsError) {
      console.error('❌ Error obteniendo documentos médicos:', documentsError)
      return
    }
    
    console.log(`✅ Documentos médicos encontrados: ${documents?.length || 0}`)
    
    // Calcular estadísticas manualmente
    console.log('📈 5. Calculando estadísticas...')
    
    // Salud General
    const totalDiagnoses = diagnoses?.length || 0
    const controlledDiagnoses = diagnoses?.filter(d => d.status === 'CONTROLADA').length || 0
    const activeDiagnoses = diagnoses?.filter(d => d.status === 'ACTIVA').length || 0
    const resolvedDiagnoses = diagnoses?.filter(d => d.status === 'RESUELTA').length || 0
    
    const generalHealthPercentage = totalDiagnoses > 0 
      ? Math.round(((controlledDiagnoses + resolvedDiagnoses) / totalDiagnoses) * 100)
      : 100
    
    let generalHealthStatus = 'Excelente'
    if (generalHealthPercentage >= 80) generalHealthStatus = 'Excelente'
    else if (generalHealthPercentage >= 60) generalHealthStatus = 'Bueno'
    else if (generalHealthPercentage >= 40) generalHealthStatus = 'Regular'
    else generalHealthStatus = 'Necesita Atención'
    
    // Adherencia
    const totalTreatments = treatments?.length || 0
    const activeTreatments = treatments?.filter(t => t.status === 'ACTIVO').length || 0
    const completedTreatments = treatments?.filter(t => t.status === 'COMPLETADO').length || 0
    
    const adherencePercentage = totalTreatments > 0 
      ? Math.round(((activeTreatments + completedTreatments) / totalTreatments) * 100)
      : 100
    
    let adherenceStatus = 'Activo'
    if (adherencePercentage >= 80) adherenceStatus = 'Activo'
    else if (adherencePercentage >= 50) adherenceStatus = 'Regular'
    else adherenceStatus = 'Bajo'
    
    // Eventos
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
    
    let eventsStatus = 'Pendiente'
    if (lastEvent) {
      const daysSinceLastEvent = Math.floor((Date.now() - new Date(lastEvent.date).getTime()) / (1000 * 60 * 60 * 24))
      if (daysSinceLastEvent <= 7) eventsStatus = 'Reciente'
      else if (daysSinceLastEvent <= 30) eventsStatus = 'Actualizado'
      else eventsStatus = 'Pendiente'
    }
    
    // Documentos
    const totalDocuments = documents?.length || 0
    const analysisDocuments = documents?.filter(d => d.type === 'ANALISIS').length || 0
    const otherDocuments = totalDocuments - analysisDocuments
    
    let documentsStatus = 'Pendiente'
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
    
    console.log('✅ Estadísticas calculadas exitosamente:')
    console.log('')
    console.log('🏥 SALUD GENERAL:')
    console.log(`   📊 Porcentaje: ${stats.generalHealth.percentage}%`)
    console.log(`   📊 Estado: ${stats.generalHealth.status}`)
    console.log(`   📊 Controladas: ${stats.generalHealth.controlled}`)
    console.log(`   📊 Monitorear: ${stats.generalHealth.monitoring}`)
    console.log('')
    console.log('💊 ADHERENCIA:')
    console.log(`   📊 Porcentaje: ${stats.adherence.percentage}%`)
    console.log(`   📊 Estado: ${stats.adherence.status}`)
    console.log(`   📊 Activos: ${stats.adherence.active}`)
    console.log(`   📊 Completados: ${stats.adherence.completed}`)
    console.log('')
    console.log('📅 EVENTOS:')
    console.log(`   📊 Total: ${stats.events.total}`)
    console.log(`   📊 Estado: ${stats.events.status}`)
    console.log(`   📊 Última cita: ${stats.events.lastAppointment}`)
    console.log(`   📊 Próximo control: ${stats.events.nextCheckup}`)
    console.log('')
    console.log('📄 DOCUMENTOS:')
    console.log(`   📊 Total: ${stats.documents.total}`)
    console.log(`   📊 Estado: ${stats.documents.status}`)
    console.log(`   📊 Análisis: ${stats.documents.analysis}`)
    console.log(`   📊 Otros: ${stats.documents.others}`)
    console.log('')
    console.log('🎉 ¡Estadísticas médicas calculadas exitosamente!')
    console.log('')
    console.log('📋 Próximos pasos:')
    console.log('1. Ve a la aplicación en el navegador')
    console.log('2. Verifica que las tarjetas muestran datos dinámicos')
    console.log('3. Los datos se actualizan automáticamente cada 30 segundos')
    
  } catch (error) {
    console.error('❌ Error general:', error)
  }
}

// Ejecutar la prueba
testMedicalStats() 