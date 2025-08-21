import { NextResponse } from 'next/server';

// Importación dinámica de Prisma para evitar problemas durante el build
let prisma;

async function getPrismaClient() {
  if (!prisma) {
    const { PrismaClient } = await import('@prisma/client');
    prisma = new PrismaClient();
  }
  return prisma;
}

export async function POST(request) {
  try {
    console.log('API Dirección: Iniciando POST request');
    
    const prisma = await getPrismaClient();
    
    const body = await request.json();
    console.log('API Dirección: Body recibido:', body);
    
    const { usuarioId, direccion } = body;

    if (!usuarioId) {
      console.log('API Dirección: Error - usuarioId faltante');
      return NextResponse.json(
        { error: 'ID de usuario es requerido' },
        { status: 400 }
      );
    }

    if (!direccion) {
      console.log('API Dirección: Error - datos de dirección faltantes');
      return NextResponse.json(
        { error: 'Datos de dirección son requeridos' },
        { status: 400 }
      );
    }

    console.log('API Dirección: Buscando usuario con ID:', usuarioId);
    
    // Verificar que el usuario existe
    const usuario = await prisma.usuario.findUnique({
      where: { id: parseInt(usuarioId) }
    });

    console.log('API Dirección: Usuario encontrado:', usuario ? 'Sí' : 'No');

    if (!usuario) {
      console.log('API Dirección: Error - Usuario no encontrado');
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    console.log('API Dirección: Iniciando operación de dirección');
    
    // Crear o actualizar la dirección
    let direccionActualizada;
    
    // Buscar si ya existe una dirección principal para este usuario
    console.log('API Dirección: Buscando dirección existente para usuario:', usuarioId);
    const direccionExistente = await prisma.direccion.findFirst({
      where: {
        usuarioId: parseInt(usuarioId),
        esPrincipal: true
      }
    });

    console.log('API Dirección: Dirección existente encontrada:', direccionExistente ? 'Sí' : 'No');

    if (direccionExistente) {
      console.log('API Dirección: Actualizando dirección existente con ID:', direccionExistente.id);
      // Actualizar la dirección existente
      direccionActualizada = await prisma.direccion.update({
        where: { id: direccionExistente.id },
        data: {
          calle: direccion.calle,
          numeroExterior: direccion.numeroExterior,
          numeroInterior: direccion.numeroInterior || null,
          colonia: direccion.colonia,
          ciudad: direccion.ciudad,
          estado: direccion.estado,
          codigoPostal: direccion.codigoPostal,
          referencias: direccion.referencias || null
        }
      });
      console.log('API Dirección: Dirección actualizada exitosamente');
    } else {
      console.log('API Dirección: Creando nueva dirección');
      // Crear una nueva dirección
      direccionActualizada = await prisma.direccion.create({
        data: {
          usuarioId: parseInt(usuarioId),
          tipo: 'casa',
          nombre: `${direccion.nombre} ${direccion.apellido}`,
          calle: direccion.calle,
          numeroExterior: direccion.numeroExterior,
          numeroInterior: direccion.numeroInterior || null,
          colonia: direccion.colonia,
          ciudad: direccion.ciudad,
          estado: direccion.estado,
          codigoPostal: direccion.codigoPostal,
          pais: 'México',
          referencias: direccion.referencias || null,
          esPrincipal: true
        }
      });
      console.log('API Dirección: Nueva dirección creada exitosamente');
    }

    // También actualizar datos personales del usuario si se proporcionan
    if (direccion.nombre || direccion.apellido || direccion.telefono || direccion.email) {
      await prisma.usuario.update({
        where: { id: parseInt(usuarioId) },
        data: {
          ...(direccion.nombre && { nombre: direccion.nombre }),
          ...(direccion.apellido && { apellidoPaterno: direccion.apellido }),
          ...(direccion.telefono && { telefono: direccion.telefono }),
          ...(direccion.email && { email: direccion.email })
        }
      });
    }

    console.log('API Dirección: Operación completada exitosamente');
    console.log('API Dirección: Dirección resultante:', direccionActualizada);
    
    return NextResponse.json({
      success: true,
      message: 'Dirección guardada exitosamente',
      direccion: direccionActualizada
    });

  } catch (error) {
    console.error('API Dirección: Error al guardar dirección:', error);
    console.error('API Dirección: Stack trace:', error.stack);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    console.log('API Dirección: Desconectando de Prisma');
    // The original code had await prisma.$disconnect(); here, but prisma is not defined in this scope.
    // Assuming the intent was to disconnect if prisma was successfully initialized.
    // Since prisma is now a global variable, we can't disconnect it here directly.
    // The original code had this line, so I'm keeping it as is, but it might cause an error.
    // If the intent was to disconnect the global prisma, it should be done in a different scope.
    // For now, I'm removing the line as it's not directly related to the new_code.
  }
}

export async function GET(request) {
  try {
    const prisma = await getPrismaClient();
    
    const { searchParams } = new URL(request.url);
    const usuarioId = searchParams.get('usuarioId');

    if (!usuarioId) {
      return NextResponse.json(
        { error: 'ID de usuario es requerido' },
        { status: 400 }
      );
    }

    // Obtener la dirección del usuario
    const direccion = await prisma.direccion.findFirst({
      where: {
        usuarioId: parseInt(usuarioId),
        esPrincipal: true,
        activo: true
      }
    });

    if (!direccion) {
      return NextResponse.json({
        success: true,
        direccion: null
      });
    }

    return NextResponse.json({
      success: true,
      direccion: direccion
    });

  } catch (error) {
    console.error('Error al obtener dirección:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    // The original code had await prisma.$disconnect(); here, but prisma is not defined in this scope.
    // Assuming the intent was to disconnect if prisma was successfully initialized.
    // Since prisma is now a global variable, we can't disconnect it here directly.
    // The original code had this line, so I'm keeping it as is, but it might cause an error.
    // If the intent was to disconnect the global prisma, it should be done in a different scope.
    // For now, I'm removing the line as it's not directly related to the new_code.
  }
}
