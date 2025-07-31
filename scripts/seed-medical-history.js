require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son requeridos en .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// ID de usuario de prueba (debe existir en auth.users)
const TEST_USER_ID = 'c868eb3d-8eeb-448f-a4d0-eaffabfbcf23'

async function seedMedicalHistory() {
  console.log('🌱 Insertando datos de prueba para el historial médico...\n')

  try {
    // Datos de diagnósticos
    const diagnoses = [
      {
        id: 'd1',
        condition: 'Diabetes Tipo 2',
        diagnosedDate: '2023-01-15T10:00:00Z',
        doctor: 'Dr. García Martínez',
        specialty: 'Endocrinología',
        severity: 'MODERADA',
        status: 'CONTROLADA',
        lastReading: '120 mg/dL',
        nextCheckup: '2024-02-15T10:00:00Z',
        notes: 'Paciente responde bien al tratamiento con metformina. Mantener dieta baja en carbohidratos.',
        userId: TEST_USER_ID
      },
      {
        id: 'd2',
        condition: 'Hipertensión Arterial',
        diagnosedDate: '2022-08-20T14:30:00Z',
        doctor: 'Dra. López Hernández',
        specialty: 'Cardiología',
        severity: 'LEVE',
        status: 'CONTROLADA',
        lastReading: '130/85 mmHg',
        nextCheckup: '2024-03-20T14:30:00Z',
        notes: 'Control adecuado con enalapril. Reducir consumo de sal.',
        userId: TEST_USER_ID
      },
      {
        id: 'd3',
        condition: 'Artritis Reumatoide',
        diagnosedDate: '2023-06-10T09:00:00Z',
        doctor: 'Dr. Rodríguez Silva',
        specialty: 'Reumatología',
        severity: 'GRAVE',
        status: 'ACTIVA',
        lastReading: 'Factor reumatoideo positivo',
        nextCheckup: '2024-01-25T09:00:00Z',
        notes: 'Progresión lenta de la enfermedad. Considerar cambio de medicación.',
        userId: TEST_USER_ID
      }
    ]

    // Datos de tratamientos
    const treatments = [
      {
        id: 't1',
        medication: 'Metformina',
        dosage: '500mg',
        frequency: '2 veces al día',
        startDate: '2023-01-20T00:00:00Z',
        adherence: 95,
        status: 'ACTIVO',
        sideEffects: 'Náuseas leves ocasionales',
        doctorNotes: 'Tomar con las comidas principales. Monitorear función renal.',
        prescribedBy: 'Dr. García Martínez',
        diagnosisId: 'd1',
        userId: TEST_USER_ID
      },
      {
        id: 't2',
        medication: 'Enalapril',
        dosage: '10mg',
        frequency: '1 vez al día',
        startDate: '2022-08-25T00:00:00Z',
        adherence: 98,
        status: 'ACTIVO',
        doctorNotes: 'Tomar en la mañana. Evitar durante el embarazo.',
        prescribedBy: 'Dra. López Hernández',
        diagnosisId: 'd2',
        userId: TEST_USER_ID
      },
      {
        id: 't3',
        medication: 'Methotrexate',
        dosage: '15mg',
        frequency: '1 vez por semana',
        startDate: '2023-06-15T00:00:00Z',
        adherence: 85,
        status: 'ACTIVO',
        sideEffects: 'Fatiga, náuseas',
        doctorNotes: 'Tomar con ácido fólico. Monitorear función hepática.',
        prescribedBy: 'Dr. Rodríguez Silva',
        diagnosisId: 'd3',
        userId: TEST_USER_ID
      }
    ]

    // Datos de eventos médicos
    const medicalEvents = [
      {
        id: 'e1',
        type: 'CONSULTA',
        title: 'Control de Diabetes',
        date: '2024-01-10T10:00:00Z',
        location: 'Clínica Endocrinológica',
        doctor: 'Dr. García Martínez',
        description: 'Control rutinario de diabetes. Revisión de niveles de glucosa y ajuste de medicación.',
        outcome: 'Niveles estables. Continuar con metformina 500mg.',
        followUp: 'Próximo control en 3 meses',
        userId: TEST_USER_ID
      },
      {
        id: 'e2',
        type: 'VACUNA',
        title: 'Vacuna contra la Influenza',
        date: '2023-10-15T14:00:00Z',
        location: 'Centro de Vacunación',
        doctor: 'Dr. Vacunador',
        description: 'Aplicación de vacuna anual contra la influenza.',
        outcome: 'Vacuna aplicada exitosamente. Sin efectos secundarios.',
        userId: TEST_USER_ID
      },
      {
        id: 'e3',
        type: 'CONSULTA',
        title: 'Análisis de Sangre Completo',
        date: '2023-12-05T08:00:00Z',
        location: 'Laboratorio Central',
        doctor: 'Dr. Laboratorio',
        description: 'Análisis rutinario de sangre para control de diabetes e hipertensión.',
        outcome: 'Resultados normales. Glucosa en rango aceptable.',
        userId: TEST_USER_ID
      }
    ]

    // Datos de documentos médicos
    const medicalDocuments = [
      {
        id: 'doc1',
        type: 'ANALISIS',
        title: 'Análisis de Glucosa',
        date: '2024-01-10T08:00:00Z',
        doctor: 'Dr. García Martínez',
        category: 'Laboratorio',
        description: 'Análisis de glucosa en ayunas y hemoglobina glicosilada.',
        results: 'Glucosa: 120 mg/dL, HbA1c: 6.2%',
        recommendations: 'Mantener dieta y ejercicio. Continuar con metformina.',
        userId: TEST_USER_ID
      },
      {
        id: 'doc2',
        type: 'RADIOGRAFIA',
        title: 'Radiografía de Tórax',
        date: '2023-11-20T15:30:00Z',
        doctor: 'Dr. Radiólogo',
        category: 'Imagenología',
        description: 'Radiografía de tórax para descartar patología pulmonar.',
        results: 'Tórax normal. Sin hallazgos patológicos.',
        recommendations: 'Continuar con controles rutinarios.',
        userId: TEST_USER_ID
      },
      {
        id: 'doc3',
        type: 'INFORME',
        title: 'Informe Cardiológico',
        date: '2023-09-15T11:00:00Z',
        doctor: 'Dra. López Hernández',
        category: 'Cardiología',
        description: 'Evaluación cardiológica completa con electrocardiograma.',
        results: 'Función cardíaca normal. Presión arterial controlada.',
        recommendations: 'Continuar con enalapril. Control en 6 meses.',
        userId: TEST_USER_ID
      }
    ]

    console.log('📋 Insertando diagnósticos...')
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

    console.log('\n💊 Insertando tratamientos...')
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

    console.log('\n📅 Insertando eventos médicos...')
    for (const event of medicalEvents) {
      const { error } = await supabase
        .from('medical_events')
        .insert(event)
      
      if (error) {
        console.error(`❌ Error insertando evento ${event.title}:`, error.message)
      } else {
        console.log(`✅ Evento insertado: ${event.title}`)
      }
    }

    console.log('\n📄 Insertando documentos médicos...')
    for (const document of medicalDocuments) {
      const { error } = await supabase
        .from('medical_documents')
        .insert(document)
      
      if (error) {
        console.error(`❌ Error insertando documento ${document.title}:`, error.message)
      } else {
        console.log(`✅ Documento insertado: ${document.title}`)
      }
    }

    console.log('\n🎉 Datos de prueba insertados exitosamente!')
    console.log('\n📊 Resumen:')
    console.log(`   • ${diagnoses.length} diagnósticos`)
    console.log(`   • ${treatments.length} tratamientos`)
    console.log(`   • ${medicalEvents.length} eventos médicos`)
    console.log(`   • ${medicalDocuments.length} documentos médicos`)
    
    console.log('\n🔗 Próximos pasos:')
    console.log('1. Verifica los datos en Supabase')
    console.log('2. Prueba la página de historial médico')
    console.log('3. Verifica que los datos se cargan correctamente')

  } catch (error) {
    console.error('❌ Error general:', error.message)
  }
}

seedMedicalHistory().catch(console.error) 