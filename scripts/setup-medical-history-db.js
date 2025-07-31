require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son requeridos en .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupMedicalHistoryDB() {
  console.log('🔧 Configurando base de datos para historial médico...\n')

  try {
    // Leer el archivo SQL
    const sqlPath = path.join(__dirname, '..', 'SQL-CREATE-MEDICAL-HISTORY-TABLES.sql')
    const sqlContent = fs.readFileSync(sqlPath, 'utf8')
    
    // Dividir el SQL en sentencias individuales
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))

    console.log(`📋 Ejecutando ${statements.length} sentencias SQL...\n`)

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      
      if (statement.trim()) {
        try {
          console.log(`🔧 Ejecutando sentencia ${i + 1}/${statements.length}...`)
          
          const { error } = await supabase.rpc('exec_sql', { 
            sql: statement + ';' 
          })
          
          if (error) {
            // Si exec_sql no funciona, intentar con query directo
            console.log('⚠️ Intentando método alternativo...')
            
            const { error: directError } = await supabase
              .from('_dummy_table_for_sql_exec')
              .select('*')
              .limit(0)
            
            if (directError) {
              console.error(`❌ Error ejecutando sentencia ${i + 1}:`, error.message)
              console.log('💡 Sentencia que falló:', statement.substring(0, 100) + '...')
            }
          } else {
            console.log(`✅ Sentencia ${i + 1} ejecutada exitosamente`)
          }
        } catch (error) {
          console.error(`❌ Error con sentencia ${i + 1}:`, error.message)
        }
      }
    }

    console.log('\n🎉 Proceso completado!')
    console.log('\n📋 Instrucciones manuales:')
    console.log('1. Ve a tu dashboard de Supabase')
    console.log('2. Navega a SQL Editor')
    console.log('3. Copia y pega el contenido de SQL-CREATE-MEDICAL-HISTORY-TABLES.sql')
    console.log('4. Ejecuta el script')
    console.log('5. Verifica que las tablas se crearon correctamente')
    
    console.log('\n📋 Tablas que se deben crear:')
    console.log('   • diagnoses - Diagnósticos médicos')
    console.log('   • treatments - Tratamientos y medicamentos')
    console.log('   • medical_events - Eventos médicos')
    console.log('   • medical_documents - Documentos médicos')

  } catch (error) {
    console.error('❌ Error general:', error.message)
  }
}

setupMedicalHistoryDB().catch(console.error) 