require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son requeridos en .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function createMedicalHistoryTables() {
  console.log('🔧 Creando tablas para el historial médico...\n')

  const tables = [
    {
      name: 'diagnoses',
      sql: `
        CREATE TABLE IF NOT EXISTS diagnoses (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          condition TEXT NOT NULL,
          diagnosed_date TIMESTAMP WITH TIME ZONE NOT NULL,
          doctor TEXT NOT NULL,
          specialty TEXT NOT NULL,
          severity TEXT CHECK (severity IN ('LEVE', 'MODERADA', 'GRAVE')) NOT NULL,
          status TEXT CHECK (status IN ('ACTIVA', 'CONTROLADA', 'RESUELTA')) NOT NULL,
          last_reading TEXT,
          next_checkup TIMESTAMP WITH TIME ZONE,
          notes TEXT,
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_diagnoses_user_id ON diagnoses(user_id);
        CREATE INDEX IF NOT EXISTS idx_diagnoses_diagnosed_date ON diagnoses(diagnosed_date);
      `
    },
    {
      name: 'treatments',
      sql: `
        CREATE TABLE IF NOT EXISTS treatments (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          medication TEXT NOT NULL,
          dosage TEXT NOT NULL,
          frequency TEXT NOT NULL,
          start_date TIMESTAMP WITH TIME ZONE NOT NULL,
          end_date TIMESTAMP WITH TIME ZONE,
          adherence INTEGER CHECK (adherence >= 0 AND adherence <= 100) DEFAULT 0,
          status TEXT CHECK (status IN ('ACTIVO', 'SUSPENDIDO', 'COMPLETADO')) NOT NULL,
          side_effects TEXT,
          doctor_notes TEXT,
          prescribed_by TEXT NOT NULL,
          diagnosis_id UUID REFERENCES diagnoses(id) ON DELETE SET NULL,
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_treatments_user_id ON treatments(user_id);
        CREATE INDEX IF NOT EXISTS idx_treatments_start_date ON treatments(start_date);
      `
    },
    {
      name: 'medical_events',
      sql: `
        CREATE TABLE IF NOT EXISTS medical_events (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          type TEXT CHECK (type IN ('CIRUGIA', 'EMERGENCIA', 'VACUNA', 'CONSULTA', 'HOSPITALIZACION', 'PROCEDIMIENTO')) NOT NULL,
          title TEXT NOT NULL,
          date TIMESTAMP WITH TIME ZONE NOT NULL,
          location TEXT NOT NULL,
          doctor TEXT NOT NULL,
          description TEXT NOT NULL,
          outcome TEXT NOT NULL,
          follow_up TEXT,
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_medical_events_user_id ON medical_events(user_id);
        CREATE INDEX IF NOT EXISTS idx_medical_events_date ON medical_events(date);
      `
    },
    {
      name: 'medical_documents',
      sql: `
        CREATE TABLE IF NOT EXISTS medical_documents (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          type TEXT CHECK (type IN ('ANALISIS', 'RADIOGRAFIA', 'INFORME', 'RECETA', 'CERTIFICADO', 'NOTA')) NOT NULL,
          title TEXT NOT NULL,
          date TIMESTAMP WITH TIME ZONE NOT NULL,
          doctor TEXT NOT NULL,
          category TEXT NOT NULL,
          description TEXT NOT NULL,
          file_url TEXT,
          results TEXT,
          recommendations TEXT,
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_medical_documents_user_id ON medical_documents(user_id);
        CREATE INDEX IF NOT EXISTS idx_medical_documents_date ON medical_documents(date);
      `
    }
  ]

  for (const table of tables) {
    try {
      console.log(`📋 Creando tabla: ${table.name}`)
      
      const { error } = await supabase.rpc('exec_sql', { sql: table.sql })
      
      if (error) {
        console.error(`❌ Error creando tabla ${table.name}:`, error.message)
      } else {
        console.log(`✅ Tabla ${table.name} creada exitosamente`)
      }
    } catch (error) {
      console.error(`❌ Error con tabla ${table.name}:`, error.message)
    }
  }

  console.log('\n🎉 Proceso completado!')
  console.log('\n📋 Tablas creadas:')
  console.log('   • diagnoses - Diagnósticos médicos')
  console.log('   • treatments - Tratamientos y medicamentos')
  console.log('   • medical_events - Eventos médicos')
  console.log('   • medical_documents - Documentos médicos')
  
  console.log('\n🔗 Próximos pasos:')
  console.log('1. Verifica que las tablas se crearon en Supabase')
  console.log('2. Ejecuta el script de datos de prueba')
  console.log('3. Prueba la página de historial médico')
}

createMedicalHistoryTables().catch(console.error) 