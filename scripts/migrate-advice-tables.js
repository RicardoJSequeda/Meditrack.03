const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando migración de tablas de consejos...');

try {
  // 1. Generar la migración de Prisma
  console.log('📝 Generando migración de Prisma...');
  execSync('npx prisma migrate dev --name add-advice-tables', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });

  // 2. Generar el cliente de Prisma
  console.log('🔧 Generando cliente de Prisma...');
  execSync('npx prisma generate', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });

  // 3. Verificar que el esquema se generó correctamente
  console.log('✅ Verificando esquema...');
  const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
  const schemaContent = fs.readFileSync(schemaPath, 'utf8');
  
  if (schemaContent.includes('model Advice')) {
    console.log('✅ Esquema de consejos encontrado en schema.prisma');
  } else {
    console.log('❌ Error: No se encontró el modelo Advice en schema.prisma');
    process.exit(1);
  }

  console.log('🎉 Migración completada exitosamente!');
  console.log('');
  console.log('📋 Próximos pasos:');
  console.log('1. Ejecuta el script SQL en Supabase: scripts/create-advice-tables.sql');
  console.log('2. Verifica que las tablas se crearon correctamente');
  console.log('3. Actualiza los hooks para usar la base de datos real');
  console.log('4. Prueba las funcionalidades de consejos');

} catch (error) {
  console.error('❌ Error durante la migración:', error.message);
  process.exit(1);
} 