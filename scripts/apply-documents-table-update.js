const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son requeridos')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function updateMedicalDocumentsTable() {
  try {
    console.log('🔧 Actualizando tabla medical_documents...')
    
    // SQL para agregar las nuevas columnas
    const updateSQL = `
      ALTER TABLE medical_documents 
      ADD COLUMN IF NOT EXISTS "fileName" TEXT,
      ADD COLUMN IF NOT EXISTS "fileSize" INTEGER,
      ADD COLUMN IF NOT EXISTS "fileType" TEXT;
    `
    
    const { error } = await supabase.rpc('exec_sql', { sql: updateSQL })
    
    if (error) {
      console.error('❌ Error ejecutando SQL:', error)
      return
    }
    
    console.log('✅ Columnas agregadas exitosamente')
    
    // Verificar que las columnas se agregaron
    const { data: columns, error: checkError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'medical_documents')
      .in('column_name', ['fileName', 'fileSize', 'fileType'])
      .order('column_name')
    
    if (checkError) {
      console.error('❌ Error verificando columnas:', checkError)
      return
    }
    
    console.log('📋 Columnas verificadas:')
    columns.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`)
    })
    
    console.log('✅ Actualización completada exitosamente')
    
  } catch (error) {
    console.error('❌ Error general:', error)
  }
}

// Ejecutar la actualización
updateMedicalDocumentsTable() 