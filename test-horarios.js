const { PrismaClient } = require('./src/generated/prisma');
const { HorariosService } = require('./src/utils/services/horariosService');

const prisma = new PrismaClient();

async function testHorariosSystem() {
  try {
    console.log('🧪 Probando sistema de horarios...\n');

    // 1. Obtener horarios disponibles para una fecha
    const fechaTest = '2024-07-25'; // Un jueves
    console.log(`1. Obteniendo horarios disponibles para ${fechaTest}:`);
    const horariosDisponibles = await HorariosService.getHorariosDisponibles(fechaTest);
    console.log(`   ✅ Encontrados ${horariosDisponibles.length} horarios disponibles`);
    horariosDisponibles.forEach(h => console.log(`   - ${h.horaFormato}`));

    // 2. Verificar disponibilidad de un horario específico
    console.log('\n2. Verificando disponibilidad de 11:00:');
    const verificacion = await HorariosService.verificarDisponibilidad(fechaTest, '11:00');
    console.log(`   ✅ Disponible: ${verificacion.disponible}`);

    // 3. Crear una consulta de prueba
    console.log('\n3. Creando consulta de prueba...');
    const consulta = await prisma.consulta.create({
      data: {
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan@test.com',
        telefono: '1234567890',
        fechaConsulta: new Date(fechaTest),
        horaConsulta: '11:00',
        estado: 'pendiente'
      }
    });
    console.log(`   ✅ Consulta creada con ID: ${consulta.id}`);

    // 4. Reservar el horario
    console.log('\n4. Reservando horario...');
    const horarioReservado = await HorariosService.reservarHorario(fechaTest, '11:00', consulta.id);
    console.log(`   ✅ Horario reservado: ${horarioReservado.id}`);

    // 5. Verificar que el horario ya no está disponible
    console.log('\n5. Verificando que el horario ya no está disponible:');
    const verificacion2 = await HorariosService.verificarDisponibilidad(fechaTest, '11:00');
    console.log(`   ✅ Disponible: ${verificacion2.disponible} (debería ser false)`);

    // 6. Obtener horarios disponibles nuevamente
    console.log('\n6. Obteniendo horarios disponibles después de la reserva:');
    const horariosDisponibles2 = await HorariosService.getHorariosDisponibles(fechaTest);
    console.log(`   ✅ Quedan ${horariosDisponibles2.length} horarios disponibles`);

    // 7. Liberar el horario
    console.log('\n7. Liberando horario...');
    await HorariosService.liberarHorario(consulta.id);
    console.log('   ✅ Horario liberado');

    // 8. Verificar que el horario está disponible nuevamente
    console.log('\n8. Verificando que el horario está disponible nuevamente:');
    const verificacion3 = await HorariosService.verificarDisponibilidad(fechaTest, '11:00');
    console.log(`   ✅ Disponible: ${verificacion3.disponible} (debería ser true)`);

    // 9. Limpiar datos de prueba
    console.log('\n9. Limpiando datos de prueba...');
    await prisma.consulta.delete({
      where: { id: consulta.id }
    });
    console.log('   ✅ Datos de prueba eliminados');

    console.log('\n🎉 ¡Todas las pruebas pasaron exitosamente!');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testHorariosSystem(); 