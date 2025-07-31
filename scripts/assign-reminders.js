const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'ricardojgoez@gmail.com' }
  })
  if (!user) {
    console.log('Usuario no encontrado')
    return
  }
  const result = await prisma.reminder.updateMany({
    data: { userId: user.id }
  })
  console.log(`Todos los recordatorios asignados a ${user.email}. Registros actualizados: ${result.count}`)
}

main().finally(() => prisma.$disconnect()) 