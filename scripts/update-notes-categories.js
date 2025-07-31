const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const categories = ['personal', 'medico', 'cita', 'medicacion', 'sintoma', 'general']
  const users = await prisma.user.findMany()
  for (const user of users) {
    const notes = await prisma.medicalNote.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'asc' },
      take: 20
    })
    for (let i = 0; i < notes.length; i++) {
      const category = categories[i % categories.length]
      await prisma.medicalNote.update({
        where: { id: notes[i].id },
        data: { category }
      })
    }
    console.log(`Notas actualizadas para el usuario ${user.email}`)
  }
  console.log('Notas actualizadas con categorías variadas')
}

main().finally(() => prisma.$disconnect()) 