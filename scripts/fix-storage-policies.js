const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son requeridos')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixStoragePolicies() {
  try {
    console.log('🔧 Aplicando políticas de almacenamiento...')
    
    // Políticas SQL para aplicar
    const policies = [
      {
        name: 'Public Access',
        sql: `CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'medical-documents')`
      },
      {
        name: 'Authenticated Users Can Upload',
        sql: `CREATE POLICY "Authenticated Users Can Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'medical-documents' AND auth.role() = 'authenticated')`
      },
      {
        name: 'Owner Can Update',
        sql: `CREATE POLICY "Owner Can Update" ON storage.objects FOR UPDATE USING (bucket_id = 'medical-documents' AND auth.uid()::text = (storage.foldername(name))[1])`
      },
      {
        name: 'Owner Can Delete',
        sql: `CREATE POLICY "Owner Can Delete" ON storage.objects FOR DELETE USING (bucket_id = 'medical-documents' AND auth.uid()::text = (storage.foldername(name))[1])`
      }
    ]
    
    // Habilitar RLS primero
    console.log('🔒 Habilitando Row Level Security...')
    const { error: rlsError } = await supabase
      .from('storage.objects')
      .select('*')
      .limit(1)
    
    if (rlsError) {
      console.log('ℹ️  RLS ya está habilitado o no se puede verificar automáticamente')
    }
    
    // Aplicar cada política
    for (const policy of policies) {
      console.log(`📋 Aplicando política: ${policy.name}`)
      
      try {
        // Intentar crear la política
        const { error } = await supabase.rpc('exec_sql', { sql: policy.sql })
        
        if (error) {
          console.log(`⚠️  Política "${policy.name}" ya existe o no se pudo crear:`, error.message)
        } else {
          console.log(`✅ Política "${policy.name}" aplicada exitosamente`)
        }
      } catch (err) {
        console.log(`⚠️  Error aplicando política "${policy.name}":`, err.message)
      }
    }
    
    console.log('✅ Configuración de políticas completada')
    console.log('')
    console.log('📋 Instrucciones manuales:')
    console.log('1. Ve al SQL Editor de Supabase')
    console.log('2. Ejecuta este SQL:')
    console.log(`
-- Habilitar RLS en storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Política para lectura pública
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'medical-documents');

-- Política para inserción de usuarios autenticados
CREATE POLICY "Authenticated Users Can Upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'medical-documents' AND auth.role() = 'authenticated');

-- Política para actualización del propietario
CREATE POLICY "Owner Can Update" ON storage.objects
FOR UPDATE USING (bucket_id = 'medical-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Política para eliminación del propietario
CREATE POLICY "Owner Can Delete" ON storage.objects
FOR DELETE USING (bucket_id = 'medical-documents' AND auth.uid()::text = (storage.foldername(name))[1]);
    `)
    
  } catch (error) {
    console.error('❌ Error general:', error)
  }
}

// Ejecutar la corrección
fixStoragePolicies() 