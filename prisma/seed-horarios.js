const { PrismaClient } = require('../src/generated/prisma');

const prisma = new PrismaClient();

async function seedHorarios() {
  try {
    console.log('🌱 Poblando tabla de horarios...');

    // Horarios de 11 AM a 7 PM
    const horarios = [
      { hora: "11:00", horaFormato: "11:00 AM" },
      { hora: "12:00", horaFormato: "12:00 PM" },
      { hora: "13:00", horaFormato: "1:00 PM" },
      { hora: "14:00", horaFormato: "2:00 PM" },
      { hora: "15:00", horaFormato: "3:00 PM" },
      { hora: "16:00", horaFormato: "4:00 PM" },
      { hora: "17:00", horaFormato: "5:00 PM" },
      { hora: "18:00", horaFormato: "6:00 PM" },
      { hora: "19:00", horaFormato: "7:00 PM" }
    ];

    for (const horario of horarios) {
      await prisma.horario.upsert({
        where: { hora: horario.hora },
        update: horario,
        create: horario
      });
    }

    console.log('✅ Horarios poblados exitosamente');
    
    // Mostrar horarios creados
    const horariosCreados = await prisma.horario.findMany({
      orderBy: { hora: 'asc' }
    });
    
    console.log('📋 Horarios disponibles:');
    horariosCreados.forEach(h => {
      console.log(`  - ${h.horaFormato} (${h.hora})`);
    });

  } catch (error) {
    console.error('❌ Error al poblar horarios:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedHorarios(); 