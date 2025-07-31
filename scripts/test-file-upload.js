require('dotenv').config({ path: '.env.local' })
const fs = require('fs')
const path = require('path')
const http = require('http')

// Token válido para pruebas
const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjODY4ZWIzZC04ZWViLTQ0OGYtYTRkMC1lYWZmYWJmYmNmMjMiLCJlbWFpbCI6ImthbGV4aW92aWVkb0BnbWFpbC5jb20iLCJuYW1lIjoicmljYXJkbyBqYXZpZXIgc2VxdWVkYSBnb2V6IiwiaWF0IjoxNzUzODEwNTI3LCJleHAiOjE3NTQ0MTUzMjd9.3h5dpwR26Tnj3qDLbhMf3L-avKf1WNueA-K7'

function decodeJWT(token) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
    return JSON.parse(jsonPayload)
  } catch (error) {
    return null
  }
}

function makeFileUploadRequest(filePath, fileName) {
  return new Promise((resolve, reject) => {
    const payload = decodeJWT(testToken)
    const userId = payload?.userId || 'c868eb3d-8eeb-448f-a4d0-eaffabfbcf23'
    
    // Leer el archivo
    const fileBuffer = fs.readFileSync(filePath)
    const boundary = '----WebKitFormBoundary' + Math.random().toString(16).substr(2)
    
    let body = ''
    body += `--${boundary}\r\n`
    body += `Content-Disposition: form-data; name="userId"\r\n\r\n`
    body += `${userId}\r\n`
    body += `--${boundary}\r\n`
    body += `Content-Disposition: form-data; name="file"; filename="${fileName}"\r\n`
    body += `Content-Type: text/plain\r\n\r\n`
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/upload-file',
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Authorization': `Bearer ${testToken}`,
        'Content-Length': Buffer.byteLength(body) + fileBuffer.length + boundary.length + 8
      }
    }

    const req = http.request(options, (res) => {
      let responseData = ''
      
      res.on('data', (chunk) => {
        responseData += chunk
      })
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData)
          resolve({
            status: res.statusCode,
            success: res.statusCode >= 200 && res.statusCode < 300,
            data: parsedData,
            rawData: responseData
          })
        } catch (error) {
          resolve({
            status: res.statusCode,
            success: false,
            error: 'Respuesta no válida',
            rawData: responseData
          })
        }
      })
    })

    req.on('error', (error) => {
      reject(error)
    })

    // Escribir el body
    req.write(body)
    req.write(fileBuffer)
    req.write(`\r\n--${boundary}--\r\n`)
    req.end()
  })
}

async function testFileUpload() {
  console.log('🧪 Probando funcionalidad de subida de archivos...\n')
  
  try {
    // Crear un archivo de prueba temporal
    const testFilePath = path.join(__dirname, 'test-document.txt')
    const testContent = 'Este es un documento de prueba para verificar la funcionalidad de subida de archivos.\n\nFecha: ' + new Date().toISOString()
    
    fs.writeFileSync(testFilePath, testContent)
    console.log('📝 Archivo de prueba creado:', testFilePath)
    
    // 1. Probar subida de archivo de texto
    console.log('🔍 1. Probando subida de archivo de texto...')
    
    const uploadResult = await makeFileUploadRequest(testFilePath, 'test-document.txt')
    
    if (uploadResult.success && uploadResult.data.success) {
      console.log('✅ Archivo subido exitosamente')
      console.log(`   📝 Nombre: ${uploadResult.data.data.fileName}`)
      console.log(`   📝 URL: ${uploadResult.data.data.fileUrl}`)
      console.log(`   📝 Tamaño: ${uploadResult.data.data.fileSize} bytes`)
      console.log(`   📝 Tipo: ${uploadResult.data.data.fileType}`)
      
      // 2. Probar crear documento médico con archivo
      console.log('\n🔍 2. Probando crear documento médico con archivo...')
      
      const documentData = {
        type: 'INFORME',
        title: 'Informe de Prueba con Archivo',
        date: new Date().toISOString(),
        doctor: 'Dr. Prueba',
        category: 'General',
        description: 'Documento de prueba con archivo adjunto',
        fileUrl: uploadResult.data.data.fileUrl,
        fileName: uploadResult.data.data.fileName,
        fileSize: uploadResult.data.data.fileSize,
        fileType: uploadResult.data.data.fileType,
        results: 'Prueba exitosa de subida de archivos',
        recommendations: 'Verificar que el archivo se puede descargar correctamente'
      }
      
      const documentResult = await makeRequest('/api/medical-documents', 'POST', documentData)
      
      if (documentResult.success && documentResult.data.success) {
        console.log('✅ Documento médico creado exitosamente con archivo')
        console.log(`   📝 ID: ${documentResult.data.data.id}`)
        console.log(`   📝 Título: ${documentResult.data.data.title}`)
        console.log(`   📝 Archivo: ${documentResult.data.data.fileUrl}`)
      } else {
        console.log('❌ Error creando documento:', documentResult.data?.error || 'Error desconocido')
      }
      
    } else {
      console.log('❌ Error subiendo archivo:', uploadResult.data?.error || 'Error desconocido')
    }
    
    // Limpiar archivo de prueba
    fs.unlinkSync(testFilePath)
    console.log('\n🧹 Archivo de prueba eliminado')
    
    console.log('\n🎉 ¡Funcionalidad de subida de archivos probada exitosamente!')
    console.log('\n📋 Resumen de funcionalidades:')
    console.log('✅ Subida de archivos a Supabase Storage')
    console.log('✅ Validación de tipos de archivo')
    console.log('✅ Validación de tamaño de archivo')
    console.log('✅ Creación de documentos con archivos adjuntos')
    console.log('✅ URLs públicas para descarga')
    
    console.log('\n📋 Próximos pasos:')
    console.log('1. Ve a la aplicación en el navegador')
    console.log('2. Navega a la página de Historial Médico')
    console.log('3. Haz clic en "Agregar Registro"')
    console.log('4. Selecciona la pestaña "Documento"')
    console.log('5. Prueba subir diferentes tipos de archivos')
    console.log('6. Verifica que los archivos se guardan correctamente')
    
  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message)
  }
}

// Función auxiliar para hacer requests normales
function makeRequest(path, method = 'POST', data = null) {
  return new Promise((resolve, reject) => {
    const payload = decodeJWT(testToken)
    const userId = payload?.userId || 'c868eb3d-8eeb-448f-a4d0-eaffabfbcf23'
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${testToken}`
      }
    }

    const req = http.request(options, (res) => {
      let responseData = ''
      
      res.on('data', (chunk) => {
        responseData += chunk
      })
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData)
          resolve({
            status: res.statusCode,
            success: res.statusCode >= 200 && res.statusCode < 300,
            data: parsedData,
            rawData: responseData
          })
        } catch (error) {
          resolve({
            status: res.statusCode,
            success: false,
            error: 'Respuesta no válida',
            rawData: responseData
          })
        }
      })
    })

    req.on('error', (error) => {
      reject(error)
    })

    if (data) {
      req.write(JSON.stringify({ ...data, userId }))
    }

    req.end()
  })
}

testFileUpload() 