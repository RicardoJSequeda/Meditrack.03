// Script para verificar la autenticación y token
console.log('🔍 Verificando autenticación y token...')

// Simular verificación de token en localStorage
function checkLocalStorage() {
  console.log('\n📦 Verificando localStorage:')
  
  // Simular localStorage
  const mockLocalStorage = {
    'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0LXVzZXItaWQiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJuYW1lIjoiVXN1YXJpbyBUZXN0IiwiaWF0IjoxNjM5NzQ5NjAwLCJleHAiOjE2NDA0NzA4MDB9.mock-signature'
  }
  
  const token = mockLocalStorage['token']
  
  if (token) {
    console.log('✅ Token encontrado en localStorage')
    console.log('📝 Token:', token.substring(0, 50) + '...')
    
    // Verificar formato del token
    const parts = token.split('.')
    if (parts.length === 3) {
      console.log('✅ Formato de token JWT válido')
      
      // Decodificar payload (sin verificar firma)
      try {
        const payload = JSON.parse(atob(parts[1]))
        console.log('📊 Payload del token:')
        console.log(`  - userId: ${payload.userId}`)
        console.log(`  - email: ${payload.email}`)
        console.log(`  - name: ${payload.name}`)
        console.log(`  - iat: ${new Date(payload.iat * 1000)}`)
        console.log(`  - exp: ${new Date(payload.exp * 1000)}`)
        
        // Verificar si el token ha expirado
        const now = Math.floor(Date.now() / 1000)
        if (payload.exp > now) {
          console.log('✅ Token no ha expirado')
        } else {
          console.log('❌ Token ha expirado')
        }
      } catch (error) {
        console.log('❌ Error decodificando token:', error.message)
      }
    } else {
      console.log('❌ Formato de token inválido')
    }
  } else {
    console.log('❌ No se encontró token en localStorage')
  }
}

// Simular headers de autorización
function createAuthHeaders(token) {
  const headers = {
    'Content-Type': 'application/json'
  }
  
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  
  return headers
}

// Simular petición a la API
function simulateApiCall(token) {
  console.log('\n🌐 Simulando petición a la API:')
  console.log('URL: /api/user/profile')
  console.log('Método: GET')
  
  const headers = createAuthHeaders(token)
  console.log('📤 Headers:')
  console.log(JSON.stringify(headers, null, 2))
  
  if (headers.Authorization) {
    console.log('✅ Header Authorization presente')
  } else {
    console.log('❌ Header Authorization faltante')
  }
}

// Probar diferentes escenarios
console.log('\n🧪 Escenarios de prueba:')

console.log('\n1. ✅ Escenario exitoso:')
console.log('   - Token válido en localStorage')
console.log('   - Header Authorization enviado')
console.log('   - API responde con datos del usuario')

console.log('\n2. ❌ Escenario de error - Sin token:')
console.log('   - No hay token en localStorage')
console.log('   - API responde con 401 Unauthorized')

console.log('\n3. ❌ Escenario de error - Token expirado:')
console.log('   - Token existe pero ha expirado')
console.log('   - API responde con 401 Unauthorized')

console.log('\n4. ❌ Escenario de error - Token inválido:')
console.log('   - Token malformado')
console.log('   - API responde con 401 Unauthorized')

// Ejecutar verificaciones
checkLocalStorage()
simulateApiCall('mock-token')

console.log('\n🎯 Pasos para verificar en el navegador:')
console.log('\n1. Abre la consola del navegador (F12)')
console.log('2. Ve a Application/Storage → Local Storage')
console.log('3. Busca la clave "token"')
console.log('4. Si existe, copia el valor')

console.log('\n5. Ve a la pestaña Network')
console.log('6. Recarga la página de perfil')
console.log('7. Busca la petición a /api/user/profile')
console.log('8. Verifica que el header Authorization esté presente')

console.log('\n9. En la consola, revisa los logs:')
console.log('   - 🔄 useEffect ejecutándose')
console.log('   - 👤 Usuario autenticado')
console.log('   - 🔍 GET /api/user/profile - Iniciando...')
console.log('   - 📊 Datos del usuario:')

console.log('\n🔧 Problemas comunes:')
console.log('- Token no guardado en localStorage')
console.log('- Token expirado')
console.log('- Token malformado')
console.log('- Header Authorization no enviado')
console.log('- Usuario no autenticado')

console.log('\n✅ Verificación completada!') 