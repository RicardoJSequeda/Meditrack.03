const jwt = require('jsonwebtoken')

function generateNewToken() {
  try {
    console.log('🔄 Generando nuevo token válido...')
    
    const payload = {
      userId: 'c868eb3d-8eeb-448f-a4d0-eaffabfbcf23',
      email: 'kalexioviedo@gmail.com',
      name: 'ricardo javier sequeda goez'
    }
    
    const secret = 'your-super-secret-jwt-key-change-this-in-production'
    const newToken = jwt.sign(payload, secret, { expiresIn: '7d' })
    
    console.log('✅ Nuevo token generado exitosamente!')
    console.log('\n📝 Copia y pega este comando en la consola del navegador:')
    console.log('localStorage.setItem("token", "' + newToken + '")')
    
    console.log('\n🔍 O ejecuta este comando completo:')
    console.log('localStorage.setItem("token", "' + newToken + '"); console.log("Token actualizado!"); window.location.reload();')
    
    return newToken
  } catch (error) {
    console.error('❌ Error generando token:', error.message)
    return null
  }
}

// Verificar el token generado
function verifyToken(token) {
  try {
    const secret = 'your-super-secret-jwt-key-change-this-in-production'
    const decoded = jwt.verify(token, secret)
    
    console.log('\n✅ Token verificado correctamente:')
    console.log('   - userId:', decoded.userId)
    console.log('   - email:', decoded.email)
    console.log('   - name:', decoded.name)
    console.log('   - expira en:', new Date(decoded.exp * 1000))
    
    return decoded
  } catch (error) {
    console.error('❌ Error verificando token:', error.message)
    return null
  }
}

// Generar y verificar el token
const newToken = generateNewToken()
if (newToken) {
  verifyToken(newToken)
  
  console.log('\n🚀 Instrucciones para actualizar el token:')
  console.log('1. Abre la consola del navegador (F12)')
  console.log('2. Ve a la pestaña "Console"')
  console.log('3. Copia y pega el comando de arriba')
  console.log('4. Presiona Enter')
  console.log('5. Recarga la página (F5)')
  console.log('6. Ve a la sección "Mis Citas"')
} 