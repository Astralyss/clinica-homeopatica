const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Crear roles
  console.log('📝 Creando roles...');
  const adminRol = await prisma.rol.upsert({
    where: { nombre: 'admin' },
    update: {},
    create: {
      nombre: 'admin',
      descripcion: 'Administrador del sistema'
    }
  });

  const clienteRol = await prisma.rol.upsert({
    where: { nombre: 'cliente' },
    update: {},
    create: {
      nombre: 'cliente',
      descripcion: 'Cliente regular'
    }
  });

  const vendedorRol = await prisma.rol.upsert({
    where: { nombre: 'vendedor' },
    update: {},
    create: {
      nombre: 'vendedor',
      descripcion: 'Vendedor del sistema'
    }
  });

  console.log('✅ Roles creados:', { adminRol, clienteRol, vendedorRol });

  // Crear administrador por defecto
  console.log('👤 Creando administrador por defecto...');
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const adminUsuario = await prisma.usuario.upsert({
    where: { email: 'admin@clinica.com' },
    update: {},
    create: {
      id_usuario: 'ADM-001',
      email: 'admin@clinica.com',
      password: hashedPassword,
      nombre: 'Administrador',
      apellidoPaterno: 'Sistema',
      apellidoMaterno: '',
      telefono: '555-0000',
      activo: true,
      emailVerificado: true,
      rolId: adminRol.id
    }
  });

  console.log('✅ Administrador creado:', adminUsuario);

  // Crear cliente de prueba
  console.log('👤 Creando cliente de prueba...');
  const clientePassword = await bcrypt.hash('cliente123', 12);
  
  const clienteUsuario = await prisma.usuario.upsert({
    where: { email: 'cliente@test.com' },
    update: {},
    create: {
      id_usuario: 'CLI-001',
      email: 'cliente@test.com',
      password: clientePassword,
      nombre: 'Juan',
      apellidoPaterno: 'Pérez',
      apellidoMaterno: 'García',
      telefono: '555-1234',
      activo: true,
      emailVerificado: true,
      rolId: clienteRol.id
    }
  });

  console.log('✅ Cliente de prueba creado:', clienteUsuario);

  // Crear dirección de prueba para el cliente
  console.log('📍 Creando dirección de prueba...');
  const direccion = await prisma.direccion.create({
    data: {
      usuarioId: clienteUsuario.id,
      tipo: 'casa',
      nombre: 'Casa Principal',
      calle: 'Av. Reforma',
      numeroExterior: '123',
      colonia: 'Centro',
      ciudad: 'Ciudad de México',
      estado: 'CDMX',
      codigoPostal: '06000',
      esPrincipal: true
    }
  });

  console.log('✅ Dirección creada:', direccion);

  console.log('🎉 Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 