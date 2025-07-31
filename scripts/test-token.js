// Script para verificar el token de autorización
console.log('🔍 Verificando token de autorización...')

// Simular el proceso de obtención del token
function getToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token')
  }
  return null
}

// Simular headers de autorización
function createHeaders(token) {
  const headers = {
    'Content-Type': 'application/json'
  }
  
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  
  return headers
}

// Simular petición a la API
async function testApiCall(url, token) {
  const headers = createHeaders(token)
  
  console.log('📤 Headers de la petición:')
  console.log(JSON.stringify(headers, null, 2))
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers
    })
    
    console.log('📥 Status de la respuesta:', response.status)
    console.log('📥 Headers de la respuesta:', Object.fromEntries(response.headers.entries()))
    
    const data = await response.json()
    console.log('📥 Datos de la respuesta:', JSON.stringify(data, null, 2))
    
    return { success: response.ok, data }
  } catch (error) {
    console.error('❌ Error en la petición:', error)
    return { success: false, error: error.message }
  }
}

// Simular diferentes escenarios
console.log('\n🧪 Escenario 1: Sin token')
testApiCall('/api/user/profile', null)

console.log('\n🧪 Escenario 2: Con token válido')
// Simular un token válido (esto es solo para demostración)
const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0LXVzZXItaWQiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJuYW1lIjoiVXN1YXJpbyBUZXN0IiwiaWF0IjoxNjM5NzQ5NjAwLCJleHAiOjE2NDA0NzA4MDB9.mock-signature'
testApiCall('/api/user/profile', mockToken)

console.log('\n🎯 Verificaciones en el navegador:')
console.log('1. Abre la consola del navegador (F12)')
console.log('2. Ve a Application/Storage → Local Storage')
console.log('3. Busca la clave "token"')
console.log('4. Si existe, copia el valor y verifica que no esté vacío')
console.log('5. Ve a la pestaña Network')
console.log('6. Recarga la página de perfil')
console.log('7. Busca la petición a /api/user/profile')
console.log('8. Verifica que el header Authorization esté presente')

console.log('\n🔧 Problemas comunes:')
console.log('- Token no guardado en localStorage')
console.log('- Token expirado')
console.log('- Token malformado')
console.log('- Headers no enviados correctamente')

console.log('\n✅ Verificación completada!') 