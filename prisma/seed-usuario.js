const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de usuario...');

  // Verificar si ya existe el usuario
  const usuarioExistente = await prisma.usuario.findUnique({
    where: { email: 'jaime.garcia@email.com' }
  });

  if (usuarioExistente) {
    console.log('✅ Usuario ya existe:', usuarioExistente.email);
    return;
  }

  // Crear rol de cliente si no existe
  let rolCliente = await prisma.rol.findUnique({
    where: { nombre: 'cliente' }
  });

  if (!rolCliente) {
    rolCliente = await prisma.rol.create({
      data: {
        nombre: 'cliente',
        descripcion: 'Usuario cliente de la farmacia'
      }
    });
    console.log('✅ Rol cliente creado');
  }

  // Hashear contraseña
  const hashedPassword = await bcrypt.hash('password123', 12);

  // Crear usuario
  const usuario = await prisma.usuario.create({
    data: {
      id_usuario: `CLI-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      email: 'jaime.garcia@email.com',
      password: hashedPassword,
      nombre: 'Jaime',
      apellidoPaterno: 'García',
      apellidoMaterno: 'López',
      telefono: '5512345678',
      fechaNacimiento: new Date('1990-05-15'),
      genero: 'M',
      activo: true,
      emailVerificado: true,
      rolId: rolCliente.id
    }
  });

  console.log('✅ Usuario creado:', usuario.email);

  // Crear dirección de ejemplo
  const direccion = await prisma.direccion.create({
    data: {
      usuarioId: usuario.id,
      tipo: 'casa',
      nombre: 'Dirección principal',
      calle: 'Av. Insurgentes Sur',
      numeroExterior: '123',
      colonia: 'Del Valle',
      ciudad: 'Ciudad de México',
      estado: 'CDMX',
      codigoPostal: '03100',
      referencias: 'Frente al parque'
    }
  });

  console.log('✅ Dirección creada para usuario:', usuario.id);

  console.log('🎉 Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 