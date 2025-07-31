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

async function registerTreatment() {
  console.log('💊 Probando registro de tratamiento...\n')

  try {
    // Datos de prueba para tratamiento
    const treatmentData = {
      id: crypto.randomUUID(),
      medication: 'Losartán',
      dosage: '50mg',
      frequency: '1 vez al día',
      startDate: new Date('2024-01-20T00:00:00Z'),
      adherence: 92,
      status: 'ACTIVO',
      sideEffects: 'Mareos leves ocasionales',
      doctorNotes: 'Tomar en la mañana. Monitorear presión arterial semanalmente.',
      prescribedBy: 'Dr. Carlos Mendoza',
      diagnosisId: null, // Se puede vincular a un diagnóstico específico
      userId: TEST_USER_ID
    }

    console.log('📝 Datos del tratamiento:')
    console.log(JSON.stringify(treatmentData, null, 2))

    console.log('\n🚀 Insertando tratamiento en Supabase...')

    const { data, error } = await supabase
      .from('treatments')
      .insert(treatmentData)
      .select('*')
      .single()

    if (error) {
      console.error('❌ Error insertando tratamiento:', error.message)
      console.error('Detalles del error:', error)
      return
    }

    console.log('✅ Tratamiento registrado exitosamente!')
    console.log('📊 Datos guardados:')
    console.log(JSON.stringify(data, null, 2))

    // Verificar que se puede leer el tratamiento
    console.log('\n🔍 Verificando lectura del tratamiento...')
    
    const { data: readData, error: readError } = await supabase
      .from('treatments')
      .select('*')
      .eq('id', data.id)
      .single()

    if (readError) {
      console.error('❌ Error leyendo tratamiento:', readError.message)
    } else {
      console.log('✅ Tratamiento leído correctamente:')
      console.log(JSON.stringify(readData, null, 2))
    }

    // Contar total de tratamientos
    const { count, error: countError } = await supabase
      .from('treatments')
      .select('*', { count: 'exact', head: true })
      .eq('userId', TEST_USER_ID)

    if (!countError) {
      console.log(`\n📊 Total de tratamientos para el usuario: ${count}`)
    }

  } catch (error) {
    console.error('❌ Error general:', error.message)
  }
}

registerTreatment().catch(console.error) 