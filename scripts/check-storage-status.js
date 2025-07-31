const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son requeridos')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkStorageStatus() {
  try {
    console.log('🔍 Verificando estado del almacenamiento...')
    
    // 1. Verificar si el bucket existe
    console.log('📦 1. Verificando bucket "medical-documents"...')
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      console.error('❌ Error obteniendo buckets:', bucketsError)
      return
    }
    
    const medicalBucket = buckets.find(bucket => bucket.name === 'medical-documents')
    
    if (medicalBucket) {
      console.log('✅ Bucket "medical-documents" encontrado')
      console.log(`   📊 Nombre: ${medicalBucket.name}`)
      console.log(`   📊 Público: ${medicalBucket.public}`)
      console.log(`   📊 Creado: ${medicalBucket.created_at}`)
    } else {
      console.log('❌ Bucket "medical-documents" no encontrado')
      return
    }
    
    // 2. Verificar políticas de RLS
    console.log('🔒 2. Verificando políticas de RLS...')
    const { data: policies, error: policiesError } = await supabase
      .from('pg_policies')
      .select('*')
      .eq('tablename', 'objects')
      .eq('schemaname', 'storage')
    
    if (policiesError) {
      console.log('⚠️  No se pudieron verificar las políticas automáticamente')
      console.log('   Ejecuta manualmente en el SQL Editor:')
      console.log(`
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'storage' 
AND tablename = 'objects';
      `)
    } else {
      console.log(`📋 Políticas encontradas: ${policies.length}`)
      policies.forEach(policy => {
        console.log(`   - ${policy.policyname} (${policy.cmd})`)
      })
    }
    
    // 3. Verificar RLS habilitado
    console.log('🔐 3. Verificando RLS en storage.objects...')
    const { data: rlsStatus, error: rlsError } = await supabase
      .from('pg_tables')
      .select('rowsecurity')
      .eq('schemaname', 'storage')
      .eq('tablename', 'objects')
      .single()
    
    if (rlsError) {
      console.log('⚠️  No se pudo verificar el estado de RLS automáticamente')
    } else {
      console.log(`📊 RLS habilitado: ${rlsStatus.rowsecurity}`)
    }
    
    // 4. Probar subida de archivo simple
    console.log('🧪 4. Probando subida de archivo...')
    const testContent = 'Test file content'
    const testFileName = `test-${Date.now()}.txt`
    
    try {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('medical-documents')
        .upload(`test/${testFileName}`, testContent, {
          contentType: 'text/plain',
          upsert: false
        })
      
      if (uploadError) {
        console.log('❌ Error en subida de prueba:', uploadError.message)
        console.log('   🔍 Detalles del error:', uploadError)
      } else {
        console.log('✅ Subida de prueba exitosa')
        console.log(`   📁 Archivo: ${uploadData.path}`)
        
        // Limpiar archivo de prueba
        const { error: deleteError } = await supabase.storage
          .from('medical-documents')
          .remove([uploadData.path])
        
        if (deleteError) {
          console.log('⚠️  No se pudo eliminar el archivo de prueba:', deleteError.message)
        } else {
          console.log('🧹 Archivo de prueba eliminado')
        }
      }
    } catch (error) {
      console.log('❌ Error general en subida de prueba:', error.message)
    }
    
    console.log('')
    console.log('📋 Resumen del estado:')
    console.log('✅ Bucket "medical-documents" existe')
    console.log('⚠️  Verificar políticas de RLS manualmente')
    console.log('')
    console.log('🔧 Si hay problemas, ejecuta este SQL en el SQL Editor:')
    console.log(`
-- Verificar políticas existentes
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'storage' 
AND tablename = 'objects';

-- Verificar RLS
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'storage' 
AND tablename = 'objects';
    `)
    
  } catch (error) {
    console.error('❌ Error general:', error)
  }
}

// Ejecutar la verificación
checkStorageStatus() 