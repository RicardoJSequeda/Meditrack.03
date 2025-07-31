const fs = require('fs')

const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://fwmasvembkwqjkbkkrry.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3bWFzdmVtYmt3cWprYmtrcnJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NTE1OTYsImV4cCI6MjA2NTMyNzU5Nn0.osWthmXPMyt95_ZXfWUq1E3UsdfcaebFvwrtVH-6MiY"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3bWFzdmVtYmt3cWprYmtrcnJ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTc1MTU5NiwiZXhwIjoyMDY1MzI3NTk2fQ.I35mUAcsRkP45jGo8kRZThY6glPZ8qCEWH5dxYHf1OY"

# Database URL for Prisma (PostgreSQL)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.fwmasvembkwqjkbkkrry.supabase.co:5432/postgres"

# JWT Configuration (for backward compatibility during migration)
JWT_SECRET="your-jwt-secret"
JWT_EXPIRES_IN="7d"

# NextAuth Configuration (for backward compatibility during migration)
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# API Configuration
API_BASE_URL="http://localhost:3000/api"
`

fs.writeFileSync('.env.local', envContent)
console.log('✅ Archivo .env.local creado exitosamente!')
console.log('⚠️  IMPORTANTE: Reemplaza [YOUR-PASSWORD] con tu contraseña real de Supabase') 