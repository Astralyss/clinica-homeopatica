import { NextResponse } from 'next/server';

import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    console.log('🚀 API /api/perfil GET llamada');
    const { searchParams } = new URL(request.url);
    const usuarioId = searchParams.get('usuarioId');
    console.log('👤 Usuario ID solicitado:', usuarioId);



    // Obtener usuario con sus direcciones
    const usuario = await prisma.usuario.findUnique({
      where: { id: parseInt(usuarioId) },
      include: {
        direcciones: true,
        rol: true
      }
    });

    if (!usuario) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Obtener métodos de pago (por ahora simulados)
    const metodosPago = [
      {
        id: 1,
        tipo: 'tarjeta',
        numero: '**** **** **** 1234',
        nombre: `${usuario.nombre} ${usuario.apellidoPaterno}`,
        fechaVencimiento: '12/25',
        esDefault: true
      }
    ];

    // Construir respuesta
    const perfil = {
      id: usuario.id,
      personal: {
        nombre: usuario.nombre,
        apellidos: `${usuario.apellidoPaterno} ${usuario.apellidoMaterno || ''}`.trim(),
        email: usuario.email,
        telefono: usuario.telefono || '',
        fechaNacimiento: usuario.fechaNacimiento ? usuario.fechaNacimiento.toISOString().split('T')[0] : ''
      },
      direccion: usuario.direcciones.length > 0 ? {
        calle: usuario.direcciones[0].calle,
        numero: usuario.direcciones[0].numeroExterior || '',
        colonia: usuario.direcciones[0].colonia,
        ciudad: usuario.direcciones[0].ciudad,
        estado: usuario.direcciones[0].estado,
        codigoPostal: usuario.direcciones[0].codigoPostal,
        referencias: usuario.direcciones[0].referencias || ''
      } : {
        calle: '',
        numero: '',
        colonia: '',
        ciudad: '',
        estado: '',
        codigoPostal: '',
        referencias: ''
      },
      metodosPago: metodosPago
    };

    console.log('📤 Enviando respuesta con perfil:', perfil);
    return NextResponse.json({
      success: true,
      perfil: perfil
    });

  } catch (error) {
    console.error('❌ Error al obtener perfil:', error);
    return NextResponse.json(
      { error: 'Error al obtener el perfil' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { tipo, datos } = body;

    console.log(`🔄 Actualizando ${tipo}:`, datos);



    // Actualizar en la base de datos
    switch (tipo) {
      case 'personal':
        // Separar apellidos
        const apellidos = datos.apellidos.split(' ');
        const apellidoPaterno = apellidos[0] || '';
        const apellidoMaterno = apellidos.slice(1).join(' ') || null;

        await prisma.usuario.update({
          where: { id: parseInt(datos.usuarioId) },
          data: {
            nombre: datos.nombre,
            apellidoPaterno: apellidoPaterno,
            apellidoMaterno: apellidoMaterno,
            email: datos.email,
            telefono: datos.telefono,
            fechaNacimiento: datos.fechaNacimiento ? new Date(datos.fechaNacimiento) : null
          }
        });
        console.log('✅ Información personal actualizada en BD');
        break;
        
      case 'direccion':
        // Buscar si ya existe una dirección para este usuario
        const direccionExistente = await prisma.direccion.findFirst({
          where: { usuarioId: parseInt(datos.usuarioId) }
        });

        if (direccionExistente) {
          // Actualizar dirección existente
          await prisma.direccion.update({
            where: { id: direccionExistente.id },
            data: {
              calle: datos.calle,
              numeroExterior: datos.numero,
              colonia: datos.colonia,
              ciudad: datos.ciudad,
              estado: datos.estado,
              codigoPostal: datos.codigoPostal,
              referencias: datos.referencias
            }
          });
        } else {
          // Crear nueva dirección
          await prisma.direccion.create({
            data: {
              usuarioId: parseInt(datos.usuarioId),
              tipo: 'casa',
              nombre: 'Dirección principal',
              calle: datos.calle,
              numeroExterior: datos.numero,
              colonia: datos.colonia,
              ciudad: datos.ciudad,
              estado: datos.estado,
              codigoPostal: datos.codigoPostal,
              referencias: datos.referencias
            }
          });
        }
        console.log('✅ Dirección actualizada en BD');
        break;
        
      default:
        throw new Error(`Tipo de actualización no válido: ${tipo}`);
    }

    // Obtener datos actualizados
    const usuarioActualizado = await prisma.usuario.findUnique({
      where: { id: parseInt(datos.usuarioId) },
      include: {
        direcciones: true,
        rol: true
      }
    });

    // Construir respuesta actualizada
    const perfilActualizado = {
      id: usuarioActualizado.id,
      personal: {
        nombre: usuarioActualizado.nombre,
        apellidos: `${usuarioActualizado.apellidoPaterno} ${usuarioActualizado.apellidoMaterno || ''}`.trim(),
        email: usuarioActualizado.email,
        telefono: usuarioActualizado.telefono || '',
        fechaNacimiento: usuarioActualizado.fechaNacimiento ? usuarioActualizado.fechaNacimiento.toISOString().split('T')[0] : ''
      },
      direccion: usuarioActualizado.direcciones.length > 0 ? {
        calle: usuarioActualizado.direcciones[0].calle,
        numero: usuarioActualizado.direcciones[0].numeroExterior || '',
        colonia: usuarioActualizado.direcciones[0].colonia,
        ciudad: usuarioActualizado.direcciones[0].ciudad,
        estado: usuarioActualizado.direcciones[0].estado,
        codigoPostal: usuarioActualizado.direcciones[0].codigoPostal,
        referencias: usuarioActualizado.direcciones[0].referencias || ''
      } : {
        calle: '',
        numero: '',
        colonia: '',
        ciudad: '',
        estado: '',
        codigoPostal: '',
        referencias: ''
      },
      metodosPago: [
        {
          id: 1,
          tipo: 'tarjeta',
          numero: '**** **** **** 1234',
          nombre: `${usuarioActualizado.nombre} ${usuarioActualizado.apellidoPaterno}`,
          fechaVencimiento: '12/25',
          esDefault: true
        }
      ]
    };

    return NextResponse.json({
      success: true,
      message: `${tipo} actualizado correctamente`,
      perfil: perfilActualizado
    });

  } catch (error) {
    console.error('❌ Error al actualizar perfil:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el perfil' },
      { status: 500 }
    );
  }
} 