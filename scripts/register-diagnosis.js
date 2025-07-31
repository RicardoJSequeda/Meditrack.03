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

async function registerDiagnosis() {
  console.log('🩺 Probando registro de diagnóstico...\n')

  try {
    // Datos de prueba para diagnóstico
    const diagnosisData = {
      id: crypto.randomUUID(),
      condition: 'Hipertensión Arterial',
      diagnosedDate: new Date('2024-01-15T10:00:00Z'),
      doctor: 'Dr. Carlos Mendoza',
      specialty: 'Cardiología',
      severity: 'MODERADA',
      status: 'ACTIVA',
      lastReading: '140/90 mmHg',
      nextCheckup: new Date('2024-03-15T10:00:00Z'),
      notes: 'Paciente presenta hipertensión arterial. Se recomienda dieta baja en sal y ejercicio regular.',
      userId: TEST_USER_ID
    }

    console.log('📝 Datos del diagnóstico:')
    console.log(JSON.stringify(diagnosisData, null, 2))

    console.log('\n🚀 Insertando diagnóstico en Supabase...')

    const { data, error } = await supabase
      .from('diagnoses')
      .insert(diagnosisData)
      .select('*')
      .single()

    if (error) {
      console.error('❌ Error insertando diagnóstico:', error.message)
      console.error('Detalles del error:', error)
      return
    }

    console.log('✅ Diagnóstico registrado exitosamente!')
    console.log('📊 Datos guardados:')
    console.log(JSON.stringify(data, null, 2))

    // Verificar que se puede leer el diagnóstico
    console.log('\n🔍 Verificando lectura del diagnóstico...')
    
    const { data: readData, error: readError } = await supabase
      .from('diagnoses')
      .select('*')
      .eq('id', data.id)
      .single()

    if (readError) {
      console.error('❌ Error leyendo diagnóstico:', readError.message)
    } else {
      console.log('✅ Diagnóstico leído correctamente:')
      console.log(JSON.stringify(readData, null, 2))
    }

    // Contar total de diagnósticos
    const { count, error: countError } = await supabase
      .from('diagnoses')
      .select('*', { count: 'exact', head: true })
      .eq('userId', TEST_USER_ID)

    if (!countError) {
      console.log(`\n📊 Total de diagnósticos para el usuario: ${count}`)
    }

  } catch (error) {
    console.error('❌ Error general:', error.message)
  }
}

registerDiagnosis().catch(console.error) 