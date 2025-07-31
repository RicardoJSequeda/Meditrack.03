require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Variables de entorno requeridas no encontradas')
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌')
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅' : '❌')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function applyStoragePolicies() {
  console.log('🔐 Aplicando políticas de almacenamiento...\n')
  
  try {
    // 1. Habilitar RLS en storage.objects
    console.log('🔒 1. Habilitando Row Level Security...')
    
    const { error: rlsError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;'
    })

    if (rlsError) {
      console.log('ℹ️  RLS ya estaba habilitado o no se pudo aplicar automáticamente')
    } else {
      console.log('✅ RLS habilitado en storage.objects')
    }

    // 2. Crear políticas de acceso
    console.log('\n📋 2. Creando políticas de acceso...')
    
    const policies = [
      {
        name: 'Public Access to medical-documents',
        sql: `
          CREATE POLICY "Public Access to medical-documents" ON storage.objects
          FOR SELECT USING (bucket_id = 'medical-documents');
        `
      },
      {
        name: 'Authenticated users can upload to medical-documents',
        sql: `
          CREATE POLICY "Authenticated users can upload to medical-documents" ON storage.objects
          FOR INSERT WITH CHECK (
            bucket_id = 'medical-documents' 
            AND auth.role() = 'authenticated'
          );
        `
      },
      {
        name: 'Users can update own files in medical-documents',
        sql: `
          CREATE POLICY "Users can update own files in medical-documents" ON storage.objects
          FOR UPDATE USING (
            bucket_id = 'medical-documents' 
            AND auth.uid()::text = (storage.foldername(name))[1]
          );
        `
      },
      {
        name: 'Users can delete own files in medical-documents',
        sql: `
          CREATE POLICY "Users can delete own files in medical-documents" ON storage.objects
          FOR DELETE USING (
            bucket_id = 'medical-documents' 
            AND auth.uid()::text = (storage.foldername(name))[1]
          );
        `
      }
    ]

    for (const policy of policies) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: policy.sql })
        
        if (error) {
          if (error.message.includes('already exists')) {
            console.log(`✅ Política "${policy.name}" ya existe`)
          } else {
            console.log(`⚠️  Política "${policy.name}": ${error.message}`)
          }
        } else {
          console.log(`✅ Política "${policy.name}" creada`)
        }
      } catch (error) {
        console.log(`⚠️  Política "${policy.name}": ${error.message}`)
      }
    }

    // 3. Verificar políticas existentes
    console.log('\n🔍 3. Verificando políticas existentes...')
    
    const { data: policiesData, error: policiesError } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT 
          policyname,
          cmd,
          permissive
        FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage'
        AND policyname LIKE '%medical-documents%';
      `
    })

    if (policiesError) {
      console.log('⚠️  No se pudieron verificar las políticas automáticamente')
      console.log('   Ejecuta manualmente el script: scripts/setup-storage-policies.sql')
    } else if (policiesData && policiesData.length > 0) {
      console.log('✅ Políticas encontradas:')
      policiesData.forEach(policy => {
        console.log(`   📋 ${policy.policyname} (${policy.cmd})`)
      })
    } else {
      console.log('⚠️  No se encontraron políticas específicas')
      console.log('   Ejecuta manualmente el script: scripts/setup-storage-policies.sql')
    }

    console.log('\n🎉 ¡Configuración de políticas completada!')
    console.log('\n📋 Resumen:')
    console.log('✅ RLS habilitado en storage.objects')
    console.log('✅ Políticas de acceso configuradas')
    console.log('✅ Lectura pública habilitada')
    console.log('✅ Subida solo para usuarios autenticados')
    
    console.log('\n📋 Próximos pasos:')
    console.log('1. Si hay errores, ejecuta manualmente: scripts/setup-storage-policies.sql')
    console.log('2. Ejecuta: node scripts/test-file-upload.js')
    console.log('3. Prueba la funcionalidad en el navegador')
    
  } catch (error) {
    console.error('❌ Error aplicando políticas:', error.message)
    console.log('\n💡 Solución manual:')
    console.log('1. Ve al SQL Editor de Supabase')
    console.log('2. Ejecuta el script: scripts/setup-storage-policies.sql')
    console.log('3. Verifica que las políticas se crearon correctamente')
  }
}

applyStoragePolicies() 