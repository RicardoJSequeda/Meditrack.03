require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son requeridos en .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// ID de usuario de prueba
const TEST_USER_ID = 'c868eb3d-8eeb-448f-a4d0-eaffabfbcf23'

async function registerAllSampleData() {
  console.log('🚀 Registrando datos de muestra masivos...\n')

  try {
    // Datos de diagnósticos de muestra
    const diagnoses = [
      {
        id: crypto.randomUUID(),
        condition: 'Diabetes Tipo 1',
        diagnosedDate: new Date('2023-06-10T09:00:00Z'),
        doctor: 'Dr. Ana Rodríguez',
        specialty: 'Endocrinología',
        severity: 'GRAVE',
        status: 'ACTIVA',
        lastReading: '180 mg/dL',
        nextCheckup: new Date('2024-02-10T09:00:00Z'),
        notes: 'Diabetes tipo 1 insulinodependiente. Requiere monitoreo constante de glucosa.',
        userId: TEST_USER_ID
      },
      {
        id: crypto.randomUUID(),
        condition: 'Asma Bronquial',
        diagnosedDate: new Date('2022-03-15T11:30:00Z'),
        doctor: 'Dra. María López',
        specialty: 'Neumología',
        severity: 'LEVE',
        status: 'CONTROLADA',
        lastReading: 'FEV1: 85%',
        nextCheckup: new Date('2024-04-15T11:30:00Z'),
        notes: 'Asma controlada con inhaladores. Evitar alérgenos y ejercicio moderado.',
        userId: TEST_USER_ID
      },
      {
        id: crypto.randomUUID(),
        condition: 'Artritis Reumatoide',
        diagnosedDate: new Date('2023-09-20T14:00:00Z'),
        doctor: 'Dr. Roberto Silva',
        specialty: 'Reumatología',
        severity: 'MODERADA',
        status: 'ACTIVA',
        lastReading: 'Factor reumatoideo: 45 UI/mL',
        nextCheckup: new Date('2024-01-20T14:00:00Z'),
        notes: 'Artritis reumatoide en fase activa. Tratamiento con metotrexato.',
        userId: TEST_USER_ID
      }
    ]

    // Datos de tratamientos de muestra
    const treatments = [
      {
        id: crypto.randomUUID(),
        medication: 'Insulina Glargina',
        dosage: '20 unidades',
        frequency: '1 vez al día',
        startDate: new Date('2023-06-15T00:00:00Z'),
        adherence: 95,
        status: 'ACTIVO',
        sideEffects: 'Hipoglucemia ocasional',
        doctorNotes: 'Aplicar por la noche. Monitorear glucosa antes de dormir.',
        prescribedBy: 'Dr. Ana Rodríguez',
        diagnosisId: null,
        userId: TEST_USER_ID
      },
      {
        id: crypto.randomUUID(),
        medication: 'Salbutamol',
        dosage: '100 mcg',
        frequency: '2 inhalaciones cada 4-6 horas',
        startDate: new Date('2022-03-20T00:00:00Z'),
        adherence: 88,
        status: 'ACTIVO',
        sideEffects: 'Temblores leves',
        doctorNotes: 'Usar solo cuando sea necesario. Mantener inhalador siempre disponible.',
        prescribedBy: 'Dra. María López',
        diagnosisId: null,
        userId: TEST_USER_ID
      },
      {
        id: crypto.randomUUID(),
        medication: 'Methotrexate',
        dosage: '15mg',
        frequency: '1 vez por semana',
        startDate: new Date('2023-09-25T00:00:00Z'),
        adherence: 82,
        status: 'ACTIVO',
        sideEffects: 'Náuseas, fatiga',
        doctorNotes: 'Tomar con ácido fólico. Monitorear función hepática mensualmente.',
        prescribedBy: 'Dr. Roberto Silva',
        diagnosisId: null,
        userId: TEST_USER_ID
      }
    ]

    // Datos de eventos médicos de muestra
    const events = [
      {
        id: crypto.randomUUID(),
        type: 'CONSULTA',
        title: 'Control de Diabetes',
        date: new Date('2024-01-10T10:00:00Z'),
        location: 'Clínica Endocrinológica',
        doctor: 'Dr. Ana Rodríguez',
        description: 'Control rutinario de diabetes tipo 1. Ajuste de dosis de insulina.',
        outcome: 'Glucosa controlada. Mantener dosis actual de insulina.',
        followUp: 'Próximo control en 3 meses',
        userId: TEST_USER_ID
      },
      {
        id: crypto.randomUUID(),
        type: 'VACUNA',
        title: 'Vacuna contra la Influenza',
        date: new Date('2023-10-15T14:00:00Z'),
        location: 'Centro de Vacunación',
        doctor: 'Dr. Vacunador',
        description: 'Aplicación de vacuna anual contra la influenza.',
        outcome: 'Vacuna aplicada exitosamente. Sin efectos secundarios.',
        userId: TEST_USER_ID
      },
      {
        id: crypto.randomUUID(),
        type: 'PROCEDIMIENTO',
        title: 'Análisis de Sangre Completo',
        date: new Date('2023-12-05T08:00:00Z'),
        location: 'Laboratorio Central',
        doctor: 'Dr. Laboratorio',
        description: 'Análisis rutinario de sangre para control de diabetes y artritis.',
        outcome: 'Resultados normales. Glucosa y marcadores inflamatorios en rango.',
        userId: TEST_USER_ID
      },
      {
        id: crypto.randomUUID(),
        type: 'CONSULTA',
        title: 'Control de Asma',
        date: new Date('2023-11-20T15:30:00Z'),
        location: 'Clínica Neumológica',
        doctor: 'Dra. María López',
        description: 'Control de asma bronquial. Revisión de función pulmonar.',
        outcome: 'Asma bien controlada. Continuar con tratamiento actual.',
        followUp: 'Próximo control en 6 meses',
        userId: TEST_USER_ID
      }
    ]

    console.log('📋 Registrando diagnósticos...')
    for (const diagnosis of diagnoses) {
      const { error } = await supabase
        .from('diagnoses')
        .insert(diagnosis)
      
      if (error) {
        console.error(`❌ Error insertando diagnóstico ${diagnosis.condition}:`, error.message)
      } else {
        console.log(`✅ Diagnóstico insertado: ${diagnosis.condition}`)
      }
    }

    console.log('\n💊 Registrando tratamientos...')
    for (const treatment of treatments) {
      const { error } = await supabase
        .from('treatments')
        .insert(treatment)
      
      if (error) {
        console.error(`❌ Error insertando tratamiento ${treatment.medication}:`, error.message)
      } else {
        console.log(`✅ Tratamiento insertado: ${treatment.medication}`)
      }
    }

    console.log('\n📅 Registrando eventos médicos...')
    for (const event of events) {
      const { error } = await supabase
        .from('medical_events')
        .insert(event)
      
      if (error) {
        console.error(`❌ Error insertando evento ${event.title}:`, error.message)
      } else {
        console.log(`✅ Evento insertado: ${event.title}`)
      }
    }

    // Verificar totales
    console.log('\n📊 Verificando totales...')
    
    const { count: diagnosesCount } = await supabase
      .from('diagnoses')
      .select('*', { count: 'exact', head: true })
      .eq('userId', TEST_USER_ID)

    const { count: treatmentsCount } = await supabase
      .from('treatments')
      .select('*', { count: 'exact', head: true })
      .eq('userId', TEST_USER_ID)

    const { count: eventsCount } = await supabase
      .from('medical_events')
      .select('*', { count: 'exact', head: true })
      .eq('userId', TEST_USER_ID)

    console.log(`📋 Total diagnósticos: ${diagnosesCount}`)
    console.log(`💊 Total tratamientos: ${treatmentsCount}`)
    console.log(`📅 Total eventos: ${eventsCount}`)

    console.log('\n🎉 ¡Datos de muestra registrados exitosamente!')
    console.log('\n📋 Resumen:')
    console.log(`   • ${diagnoses.length} diagnósticos nuevos`)
    console.log(`   • ${treatments.length} tratamientos nuevos`)
    console.log(`   • ${events.length} eventos nuevos`)
    
    console.log('\n🔗 Próximos pasos:')
    console.log('1. Ve a la aplicación en el navegador')
    console.log('2. Navega a la página de Historial Médico')
    console.log('3. Verifica que los nuevos datos aparecen')
    console.log('4. Prueba las diferentes pestañas y filtros')

  } catch (error) {
    console.error('❌ Error general:', error.message)
  }
}

registerAllSampleData().catch(console.error) 