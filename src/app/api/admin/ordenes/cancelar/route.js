import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { compraId, motivoCancelacion } = body;

    if (!compraId) {
      return NextResponse.json({ error: 'compraId es requerido' }, { status: 400 });
    }

    if (!motivoCancelacion || motivoCancelacion.trim() === '') {
      return NextResponse.json({ error: 'motivoCancelacion es requerido' }, { status: 400 });
    }

    // Verificar que la compra existe y no esté ya cancelada
    const compra = await prisma.compra.findUnique({
      where: { id: compraId },
      include: { 
        usuario: true, 
        items: { include: { producto: true } },
        pagos: true 
      }
    });

    if (!compra) {
      return NextResponse.json({ error: 'Compra no encontrada' }, { status: 404 });
    }

    if (compra.estado === 'cancelada') {
      return NextResponse.json({ error: 'La compra ya está cancelada' }, { status: 400 });
    }

    // Verificar que la compra no esté entregada
    if (compra.estado === 'entregada') {
      return NextResponse.json({ error: 'No se puede cancelar una compra ya entregada' }, { status: 400 });
    }

    // Iniciar transacción para cancelar la compra
    const resultado = await prisma.$transaction(async (tx) => {
      // 1. Actualizar el estado de la compra
      const compraCancelada = await tx.compra.update({
        where: { id: compraId },
        data: {
          estado: 'cancelada',
          motivoCancelacion: motivoCancelacion.trim(),
          fechaCancelacion: new Date(),
          canceladoPor: 'admin'
        }
      });

      // 2. Si hay pagos procesados, marcarlos como reembolsados
      if (compra.pagos && compra.pagos.length > 0) {
        for (const pago of compra.pagos) {
          if (pago.estado === 'completado') {
            await tx.pago.update({
              where: { id: pago.id },
              data: { estado: 'reembolsado' }
            });
          }
        }
      }

      // 3. Restaurar el inventario de los productos
      for (const item of compra.items) {
        await tx.producto.update({
          where: { id: item.productoId },
          data: {
            cantidad: {
              increment: item.cantidad
            }
          }
        });
      }

      return compraCancelada;
    });

    // Obtener la compra actualizada con toda la información
    const compraActualizada = await prisma.compra.findUnique({
      where: { id: compraId },
      include: {
        usuario: true,
        items: { include: { producto: { include: { imagenes: true } } } },
        direccion: true,
        pagos: true,
        envios: true,
      },
    });

    // Función para mapear la compra (copiada de la API principal)
    const mapCompraAdmin = (compra) => {
      const productos = (compra.items || []).map((item) => ({
        id: item.productoId,
        nombre: item.producto?.nombre,
        cantidad: item.cantidad,
        precio: Number(item.precioUnitario),
        imagen:
          item.producto?.imagenes?.find((img) => img.esPrincipal)?.url ||
          item.producto?.imagenes?.[0]?.url ||
          '/productos/placeholder.png',
      }));

      const envio = compra.envios?.[0] || null;
      const pago = compra.pagos?.[0] || null;

      return {
        id: compra.id,
        numeroOrden: compra.numeroOrden,
        fechaCompra: compra.fechaCompra,
        estado: compra.estado,
        subtotal: Number(compra.subtotal),
        costoEnvio: Number(compra.costoEnvio || 0),
        total: Number(compra.total),
        motivoCancelacion: compra.motivoCancelacion,
        fechaCancelacion: compra.fechaCancelacion,
        canceladoPor: compra.canceladoPor,
        cliente: {
          id: compra.usuario.id,
          nombre: compra.usuario.nombre,
          apellidoPaterno: compra.usuario.apellidoPaterno,
          email: compra.usuario.email,
        },
        productosCantidad: productos.reduce((s, p) => s + p.cantidad, 0),
        productos,
        direccion: compra.direccion ? {
          calle: compra.direccion.calle,
          numeroExterior: compra.direccion.numeroExterior,
          colonia: compra.direccion.colonia,
          ciudad: compra.direccion.ciudad,
          estado: compra.direccion.estado,
          codigoPostal: compra.direccion.codigoPostal,
          nombre: compra.direccion.nombre,
          referencias: compra.direccion.referencias,
        } : null,
        envio: envio ? {
          id: envio.id,
          numeroGuia: envio.numeroGuia,
          empresaEnvio: envio.empresaEnvio,
          costo: Number(envio.costo || 0),
          estado: envio.estado,
          fechaEnvio: envio.fechaEnvio,
          fechaEntrega: envio.fechaEntrega,
        } : null,
        pago: pago ? {
          id: pago.id,
          metodoPago: pago.metodoPago,
          monto: Number(pago.monto),
          estado: pago.estado,
        } : null,
      };
    };

    return NextResponse.json({ 
      success: true, 
      message: 'Pedido cancelado exitosamente',
      orden: mapCompraAdmin(compraActualizada) 
    });

  } catch (error) {
    console.error('Error cancelando orden:', error);
    return NextResponse.json({ 
      error: 'Error al cancelar la orden',
      details: error.message 
    }, { status: 500 });
  }
} 