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

async function registerEvent() {
  console.log('📅 Probando registro de evento médico...\n')

  try {
    // Datos de prueba para evento médico
    const eventData = {
      id: crypto.randomUUID(),
      type: 'CONSULTA',
      title: 'Control de Hipertensión',
      date: new Date('2024-01-25T14:00:00Z'),
      location: 'Clínica Cardiovascular',
      doctor: 'Dr. Carlos Mendoza',
      description: 'Control rutinario de hipertensión arterial. Revisión de presión arterial y ajuste de medicación.',
      outcome: 'Presión arterial controlada. Continuar con Losartán 50mg.',
      followUp: 'Próximo control en 2 meses',
      userId: TEST_USER_ID
    }

    console.log('📝 Datos del evento:')
    console.log(JSON.stringify(eventData, null, 2))

    console.log('\n🚀 Insertando evento en Supabase...')

    const { data, error } = await supabase
      .from('medical_events')
      .insert(eventData)
      .select('*')
      .single()

    if (error) {
      console.error('❌ Error insertando evento:', error.message)
      console.error('Detalles del error:', error)
      return
    }

    console.log('✅ Evento registrado exitosamente!')
    console.log('📊 Datos guardados:')
    console.log(JSON.stringify(data, null, 2))

    // Verificar que se puede leer el evento
    console.log('\n🔍 Verificando lectura del evento...')
    
    const { data: readData, error: readError } = await supabase
      .from('medical_events')
      .select('*')
      .eq('id', data.id)
      .single()

    if (readError) {
      console.error('❌ Error leyendo evento:', readError.message)
    } else {
      console.log('✅ Evento leído correctamente:')
      console.log(JSON.stringify(readData, null, 2))
    }

    // Contar total de eventos
    const { count, error: countError } = await supabase
      .from('medical_events')
      .select('*', { count: 'exact', head: true })
      .eq('userId', TEST_USER_ID)

    if (!countError) {
      console.log(`\n📊 Total de eventos para el usuario: ${count}`)
    }

  } catch (error) {
    console.error('❌ Error general:', error.message)
  }
}

registerEvent().catch(console.error) 