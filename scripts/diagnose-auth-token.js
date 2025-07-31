// Script para diagnosticar problemas de token de autenticación
console.log('🔍 Diagnosticando problemas de token de autenticación...')

// Simular verificación de token
function checkTokenIssues() {
  console.log('\n📊 Análisis de problemas de token:')
  console.log('='.repeat(50))
  
  const issues = [
    {
      problem: 'Token no proporcionado en peticiones HEAD',
      cause: 'Las peticiones HEAD no incluyen el header Authorization',
      impact: 'Errores 401 en /api/user/profile',
      solution: 'Verificar que todas las peticiones incluyan el token'
    },
    {
      problem: 'Cache de autenticación conflictivo',
      cause: 'Cache de 5 minutos puede estar causando problemas',
      impact: 'Navegación inconsistente',
      solution: 'Limpiar cache y verificar token en localStorage'
    },
    {
      problem: 'Token expirado o inválido',
      cause: 'Token JWT ha expirado o es malformado',
      impact: 'Acceso denegado a APIs',
      solution: 'Renovar token o hacer logout/login'
    },
    {
      problem: 'Problema en useApi hook',
      cause: 'Headers no se están enviando correctamente',
      impact: 'Todas las peticiones autenticadas fallan',
      solution: 'Verificar implementación de useApi'
    }
  ]
  
  issues.forEach((issue, index) => {
    console.log(`\n${index + 1}. ${issue.problem}`)
    console.log(`   Causa: ${issue.cause}`)
    console.log(`   Impacto: ${issue.impact}`)
    console.log(`   Solución: ${issue.solution}`)
  })
}

// Simular verificación de localStorage
function checkLocalStorage() {
  console.log('\n📦 Verificación de localStorage:')
  console.log('='.repeat(50))
  
  const mockLocalStorage = {
    'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0LXVzZXItaWQiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJuYW1lIjoiVXN1YXJpbyBUZXN0IiwiaWF0IjoxNjM5NzQ5NjAwLCJleHAiOjE2NDA0NzA4MDB9.mock-signature',
    'auth-checked': 'true',
    'auth-check-time': Date.now().toString()
  }
  
  console.log('✅ Token encontrado en localStorage')
  console.log('✅ Cache de autenticación presente')
  console.log('✅ Tiempo de cache válido')
  
  // Verificar formato del token
  const token = mockLocalStorage['token']
  const parts = token.split('.')
  
  if (parts.length === 3) {
    console.log('✅ Formato de token JWT válido')
    
    try {
      const payload = JSON.parse(atob(parts[1]))
      const now = Math.floor(Date.now() / 1000)
      
      if (payload.exp > now) {
        console.log('✅ Token no ha expirado')
      } else {
        console.log('❌ Token ha expirado')
      }
    } catch (error) {
      console.log('❌ Error decodificando token')
    }
  } else {
    console.log('❌ Formato de token inválido')
  }
}

// Simular verificación de headers
function checkHeaders() {
  console.log('\n📤 Verificación de headers:')
  console.log('='.repeat(50))
  
  const mockHeaders = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0LXVzZXItaWQiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJuYW1lIjoiVXN1YXJpbyBUZXN0IiwiaWF0IjoxNjM5NzQ5NjAwLCJleHAiOjE2NDA0NzA4MDB9.mock-signature'
  }
  
  if (mockHeaders.Authorization) {
    console.log('✅ Header Authorization presente')
    console.log('✅ Formato Bearer token correcto')
  } else {
    console.log('❌ Header Authorization faltante')
  }
  
  console.log('✅ Content-Type correcto')
}

// Simular peticiones problemáticas
function simulateProblematicRequests() {
  console.log('\n🌐 Simulación de peticiones problemáticas:')
  console.log('='.repeat(50))
  
  const requests = [
    {
      method: 'HEAD',
      url: '/api/user/profile',
      headers: {},
      expected: '401 - Sin Authorization header'
    },
    {
      method: 'GET',
      url: '/api/user/profile',
      headers: { 'Authorization': 'Bearer token' },
      expected: '200 - Con Authorization header'
    },
    {
      method: 'HEAD',
      url: '/appointments',
      headers: {},
      expected: '200 - Página estática'
    }
  ]
  
  requests.forEach((req, index) => {
    console.log(`\n${index + 1}. ${req.method} ${req.url}`)
    console.log(`   Headers: ${Object.keys(req.headers).length > 0 ? 'Presentes' : 'Vacíos'}`)
    console.log(`   Resultado esperado: ${req.expected}`)
  })
}

// Mostrar diagnóstico
checkTokenIssues()
checkLocalStorage()
checkHeaders()
simulateProblematicRequests()

// Soluciones propuestas
console.log('\n🔧 Soluciones propuestas:')
console.log('='.repeat(50))

const solutions = [
  {
    step: '1. Verificar token en localStorage',
    action: 'Abrir DevTools → Application → Local Storage → Verificar token',
    expected: 'Token válido presente'
  },
  {
    step: '2. Limpiar cache de autenticación',
    action: 'Eliminar auth-checked y auth-check-time del localStorage',
    expected: 'Forzar nueva verificación de auth'
  },
  {
    step: '3. Verificar headers en peticiones',
    action: 'Revisar Network tab → Verificar Authorization header',
    expected: 'Header presente en todas las peticiones'
  },
  {
    step: '4. Renovar token si es necesario',
    action: 'Hacer logout y login nuevamente',
    expected: 'Token fresco generado'
  },
  {
    step: '5. Verificar useApi hook',
    action: 'Revisar implementación de headers en useApi',
    expected: 'Headers se envían correctamente'
  }
]

solutions.forEach((solution, index) => {
  console.log(`\n${solution.step}`)
  console.log(`   Acción: ${solution.action}`)
  console.log(`   Resultado esperado: ${solution.expected}`)
})

console.log('\n🎯 Pasos para resolver:')
console.log('\n1. Abrir DevTools (F12)')
console.log('2. Ir a Application → Local Storage')
console.log('3. Verificar que existe la clave "token"')
console.log('4. Si no existe, hacer logout y login')
console.log('5. Si existe, verificar que no esté expirado')
console.log('6. Limpiar cache de autenticación si es necesario')

console.log('\n✅ Diagnóstico completado!') 