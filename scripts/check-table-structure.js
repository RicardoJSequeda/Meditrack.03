require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son requeridos en .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkTableStructure() {
  console.log('🔍 Verificando estructura de las tablas...\n')

  const tables = [
    'diagnoses',
    'treatments', 
    'medical_events',
    'medical_documents'
  ]

  for (const tableName of tables) {
    try {
      console.log(`📋 Estructura de la tabla: ${tableName}`)
      
      // Intentar obtener una muestra de datos para inferir la estructura
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1)
      
      if (error) {
        console.log(`   ❌ Error: ${error.message}`)
      } else if (data && data.length > 0) {
        const sample = data[0]
        console.log(`   ✅ Columnas encontradas:`)
        
        Object.keys(sample).forEach(column => {
          const value = sample[column]
          const type = typeof value
          console.log(`      • ${column}: ${type}${value !== null ? ` (${value})` : ' (null)'}`)
        })
      } else {
        console.log(`   ⚠️ Tabla vacía, no se puede inferir estructura`)
      }
      
      console.log('') // Línea en blanco para separar
      
    } catch (error) {
      console.log(`   ❌ Error verificando tabla ${tableName}: ${error.message}`)
    }
  }

  console.log('📋 Instrucciones:')
  console.log('1. Revisa la estructura actual de las tablas')
  console.log('2. Compara con la estructura esperada en SQL-CREATE-MEDICAL-HISTORY-TABLES.sql')
  console.log('3. Si las estructuras no coinciden, actualiza las APIs o las tablas')
}

checkTableStructure().catch(console.error) 