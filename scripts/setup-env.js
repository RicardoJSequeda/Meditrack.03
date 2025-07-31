const fs = require('fs')
const path = require('path')

console.log('🔧 Configuración de Variables de Entorno para Supabase')
console.log('==================================================')
console.log('')

// Leer la URL de conexión proporcionada
const connectionUrl = 'postgresql://postgres:[YOUR-PASSWORD]@db.fwmasvembkwqjkbkkrry.supabase.co:5432/postgres'

// Extraer el project ref de la URL
const projectRef = 'fwmasvembkwqjkbkkrry'

// Generar claves de ejemplo
const generateSecret = (length = 32) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://${projectRef}.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"

# Database URL for Prisma (PostgreSQL)
DATABASE_URL="${connectionUrl}"

# JWT Configuration (for backward compatibility during migration)
JWT_SECRET="${generateSecret()}"
JWT_EXPIRES_IN="7d"

# NextAuth Configuration (for backward compatibility during migration)
NEXTAUTH_SECRET="${generateSecret()}"
NEXTAUTH_URL="http://localhost:3000"

# API Configuration
API_BASE_URL="http://localhost:3000/api"
`

const envPath = path.join(process.cwd(), '.env.local')

try {
  fs.writeFileSync(envPath, envContent)
  console.log('✅ Archivo .env.local creado exitosamente!')
  console.log('')
  console.log('📋 Próximos pasos:')
  console.log('1. Ve a tu dashboard de Supabase: https://supabase.com/dashboard')
  console.log('2. Selecciona tu proyecto')
  console.log('3. Ve a Settings > API')
  console.log('4. Copia las siguientes claves:')
  console.log('   - Project URL → NEXT_PUBLIC_SUPABASE_URL')
  console.log('   - anon public → NEXT_PUBLIC_SUPABASE_ANON_KEY')
  console.log('   - service_role secret → SUPABASE_SERVICE_ROLE_KEY')
  console.log('5. Reemplaza los valores en .env.local')
  console.log('6. Reemplaza [YOUR-PASSWORD] en DATABASE_URL con tu contraseña real')
  console.log('')
  console.log('🔑 Claves que necesitas obtener:')
  console.log(`   Project URL: https://${projectRef}.supabase.co`)
  console.log('   anon public: (obtener del dashboard)')
  console.log('   service_role secret: (obtener del dashboard)')
  console.log('')
  console.log('📝 Una vez configurado, ejecuta:')
  console.log('   npm run db:push')
  console.log('   npm run supabase:seed')
} catch (error) {
  console.error('❌ Error creando .env.local:', error.message)
} 