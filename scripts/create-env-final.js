const fs = require('fs')

const envContent = `NEXT_PUBLIC_SUPABASE_URL="https://fwmasvembkwqjkbkkrry.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3bWFzdmVtYmt3cWprYmtrcnJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NTE1OTYsImV4cCI6MjA2NTMyNzU5Nn0.osWthmXPMyt95_ZXfWUq1E3UsdfcaebFvwrtVH-6MiY"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3bWFzdmVtYmt3cWprYmtrcnJ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTc1MTU5NiwiZXhwIjoyMDY1MzI3NTk2fQ.I35mUAcsRkP45jGo8kRZThY6glPZ8qCEWH5dxYHf1OY"
DATABASE_URL="postgresql://postgres:Erika03n1!@db.fwmasvembkwqjkbkkrry.supabase.co:5432/postgres"
JWT_SECRET="meditrack-jwt-secret-2024"
JWT_EXPIRES_IN="7d"
NEXTAUTH_SECRET="meditrack-nextauth-secret-2024"
NEXTAUTH_URL="http://localhost:3000"
API_BASE_URL="http://localhost:3000/api"`

fs.writeFileSync('.env.local', envContent)
console.log('✅ Archivo .env.local creado exitosamente con la contraseña correcta!')
console.log('🚀 Ahora podemos continuar con la configuración de la base de datos...') 