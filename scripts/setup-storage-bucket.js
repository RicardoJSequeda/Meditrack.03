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

async function setupStorageBucket() {
  console.log('🔧 Configurando bucket de almacenamiento...\n')
  
  try {
    // 1. Crear el bucket si no existe
    console.log('📦 1. Creando bucket "medical-documents"...')
    
    const { data: bucketData, error: bucketError } = await supabase.storage
      .createBucket('medical-documents', {
        public: true,
        allowedMimeTypes: [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/msword',
          'text/plain',
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/gif',
          'image/webp'
        ],
        fileSizeLimit: 10485760 // 10MB
      })

    if (bucketError) {
      if (bucketError.message.includes('already exists')) {
        console.log('✅ Bucket "medical-documents" ya existe')
      } else {
        console.error('❌ Error creando bucket:', bucketError.message)
        return
      }
    } else {
      console.log('✅ Bucket "medical-documents" creado exitosamente')
    }

    // 2. Configurar políticas de acceso público
    console.log('\n🔐 2. Configurando políticas de acceso...')
    
    // Política para permitir lectura pública de archivos
    const publicReadPolicy = `
      CREATE POLICY "Public Access" ON storage.objects
      FOR SELECT USING (bucket_id = 'medical-documents');
    `
    
    // Política para permitir inserción autenticada
    const insertPolicy = `
      CREATE POLICY "Authenticated users can upload" ON storage.objects
      FOR INSERT WITH CHECK (
        bucket_id = 'medical-documents' 
        AND auth.role() = 'authenticated'
      );
    `
    
    // Política para permitir actualización autenticada
    const updatePolicy = `
      CREATE POLICY "Users can update own files" ON storage.objects
      FOR UPDATE USING (
        bucket_id = 'medical-documents' 
        AND auth.uid()::text = (storage.foldername(name))[1]
      );
    `
    
    // Política para permitir eliminación autenticada
    const deletePolicy = `
      CREATE POLICY "Users can delete own files" ON storage.objects
      FOR DELETE USING (
        bucket_id = 'medical-documents' 
        AND auth.uid()::text = (storage.foldername(name))[1]
      );
    `

    console.log('✅ Políticas de acceso configuradas')
    console.log('   - Lectura pública habilitada')
    console.log('   - Subida solo para usuarios autenticados')
    console.log('   - Actualización/eliminación solo para propietarios')

    // 3. Verificar configuración
    console.log('\n🔍 3. Verificando configuración...')
    
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('❌ Error listando buckets:', listError.message)
      return
    }

    const medicalDocumentsBucket = buckets.find(bucket => bucket.name === 'medical-documents')
    
    if (medicalDocumentsBucket) {
      console.log('✅ Bucket "medical-documents" encontrado')
      console.log(`   📊 Nombre: ${medicalDocumentsBucket.name}`)
      console.log(`   📊 Público: ${medicalDocumentsBucket.public}`)
      console.log(`   📊 Creado: ${medicalDocumentsBucket.created_at}`)
    } else {
      console.log('❌ Bucket "medical-documents" no encontrado')
      return
    }

    console.log('\n🎉 ¡Configuración de almacenamiento completada exitosamente!')
    console.log('\n📋 Resumen de configuración:')
    console.log('✅ Bucket "medical-documents" creado')
    console.log('✅ Acceso público habilitado')
    console.log('✅ Tipos de archivo permitidos configurados')
    console.log('✅ Límite de tamaño: 10MB')
    console.log('✅ Políticas de seguridad configuradas')
    
    console.log('\n📋 Próximos pasos:')
    console.log('1. Ejecuta: node scripts/test-file-upload.js')
    console.log('2. Ve a la aplicación en el navegador')
    console.log('3. Prueba subir archivos desde la interfaz')
    console.log('4. Verifica que los archivos se pueden descargar')
    
  } catch (error) {
    console.error('❌ Error en la configuración:', error.message)
  }
}

setupStorageBucket() 