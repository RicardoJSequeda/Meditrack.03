const fs = require('fs')

const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://hyrxpkdfosnmdpphlkqq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5cnhwa2Rmb3NubWRwcGhsa3FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2MzI4MDgsImV4cCI6MjA2OTIwODgwOH0.we9ptJ-dgx1kAKIooUM-1RSJO6Kw2FbUia2gDFhXUnI
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5cnhwa2Rmb3NubWRwcGhsa3FxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzYzMjgwOCwiZXhwIjoyMDY5MjA4ODA4fQ.rpINnX1bldwHH59ba_v46AWFfhnH_PSQTRwc5NsBYs4

# Database URLs
DATABASE_URL=postgresql://postgres:Erika03n1!@db.hyrxpkdfosnmdpphlkqq.supabase.co:5432/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres:Erika03n1!@db.hyrxpkdfosnmdpphlkqq.supabase.co:5432/postgres

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-change-this-in-production
`

try {
  fs.writeFileSync('.env.local', envContent)
  console.log('✅ Archivo .env.local creado exitosamente')
  console.log('📝 Variables de entorno configuradas:')
  console.log('   - NEXT_PUBLIC_SUPABASE_URL')
  console.log('   - NEXT_PUBLIC_SUPABASE_ANON_KEY')
  console.log('   - SUPABASE_SERVICE_ROLE_KEY')
  console.log('   - DATABASE_URL')
  console.log('   - DIRECT_URL')
  console.log('   - JWT_SECRET')
  console.log('   - NEXTAUTH_URL')
  console.log('   - NEXTAUTH_SECRET')
} catch (error) {
  console.error('❌ Error creando archivo .env.local:', error.message)
} 