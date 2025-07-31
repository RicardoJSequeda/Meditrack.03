const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.findFirst()
  if (!user) {
    console.log('No user found')
    return
  }
  const categories = ['personal', 'medico', 'cita', 'medicacion', 'sintoma', 'general']
  for (let i = 1; i <= 20; i++) {
    const category = categories[(i - 1) % categories.length]
    await prisma.medicalNote.create({
      data: {
        title: `Nota de ejemplo #${i}`,
        content: `Este es el contenido de la nota número ${i}.`,
        category,
        userId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    })
  }
  console.log('20 notas creadas con categorías variadas')
}

main().finally(() => prisma.$disconnect()) 