const fs = require('fs')

const content = `DATABASE_URL="postgresql://postgres:Erika03n1!111111111111111111@db.hyrxpkdfosnmdpphlkqq.supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://hyrxpkdfosnmdpphlkqq.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5cnhwa2Rmb3NubWRwcGhsa3FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2MzI4MDgsImV4cCI6MjA2OTIwODgwOH0.we9ptJ-dgx1kAKIooUM-1RSJO6Kw2FbUia2gDFhXUnI"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5cnhwa2Rmb3NubWRwcGhsa3FxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzYzMjgwOCwiZXhwIjoyMDY5MjA4ODA4fQ.rpINnX1bldwHH59ba_v46AWFfhnH_PSQTRwc5NsBYs4"
JWT_SECRET="meditrack-jwt-secret-2024"
JWT_EXPIRES_IN="7d"
NEXTAUTH_SECRET="meditrack-nextauth-secret-2024"
NEXTAUTH_URL="http://localhost:3000"
API_BASE_URL="http://localhost:3000/api"`

try {
  fs.writeFileSync('.env', content)
  console.log('✅ Archivo .env actualizado con la contraseña correcta!')
  console.log('🔑 Contraseña actualizada: Erika03n1!111111111111111111')
  console.log('🚀 Ahora vamos a probar la conexión de Prisma...')
} catch (error) {
  console.error('❌ Error:', error.message)
} 