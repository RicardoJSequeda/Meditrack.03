require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son requeridos en .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkMedicalHistoryTables() {
  console.log('🔍 Verificando tablas del historial médico...\n')

  const tables = [
    'diagnoses',
    'treatments', 
    'medical_events',
    'medical_documents'
  ]

  let existingTables = 0
  let missingTables = 0

  for (const tableName of tables) {
    try {
      console.log(`🔍 Verificando tabla: ${tableName}`)
      
      // Intentar hacer una consulta simple para verificar si la tabla existe
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1)
      
      if (error) {
        if (error.message.includes('does not exist') || error.message.includes('relation')) {
          console.log(`   ❌ Tabla ${tableName} NO existe`)
          missingTables++
        } else {
          console.log(`   ⚠️ Tabla ${tableName} existe pero hay un error: ${error.message}`)
          existingTables++
        }
      } else {
        console.log(`   ✅ Tabla ${tableName} existe`)
        existingTables++
        
        // Contar registros si la tabla existe
        const { count, error: countError } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true })
        
        if (!countError) {
          console.log(`      📊 Registros: ${count}`)
        }
      }
    } catch (error) {
      console.log(`   ❌ Error verificando tabla ${tableName}: ${error.message}`)
      missingTables++
    }
  }

  console.log('\n📊 Resumen:')
  console.log(`   ✅ Tablas existentes: ${existingTables}`)
  console.log(`   ❌ Tablas faltantes: ${missingTables}`)
  console.log(`   📋 Total de tablas: ${tables.length}`)

  if (missingTables > 0) {
    console.log('\n⚠️ Algunas tablas no existen')
    console.log('\n📋 Para crear las tablas:')
    console.log('1. Ve a tu dashboard de Supabase')
    console.log('2. Navega a SQL Editor')
    console.log('3. Copia y pega el contenido de SQL-CREATE-MEDICAL-HISTORY-TABLES.sql')
    console.log('4. Ejecuta el script')
    console.log('5. Ejecuta este script nuevamente para verificar')
  } else {
    console.log('\n🎉 ¡Todas las tablas existen!')
    console.log('\n📋 Próximos pasos:')
    console.log('1. Ejecuta el script de datos de prueba')
    console.log('2. Prueba las APIs del historial médico')
    console.log('3. Verifica la página de historial médico')
  }
}

checkMedicalHistoryTables().catch(console.error) 