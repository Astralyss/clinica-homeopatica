import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'ID del pedido es requerido' }, { status: 400 });
    }

    // Verificar que el pedido existe y está entregado
    const pedido = await prisma.compra.findUnique({
      where: { id: parseInt(id) },
      include: { envios: true }
    });

    if (!pedido) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
    }

    if (pedido.estado !== 'entregada') {
      return NextResponse.json({ error: 'Solo se pueden borrar pedidos entregados' }, { status: 400 });
    }

    // Borrar en cascada: primero los items, pagos, envíos, y luego la compra
    await prisma.$transaction([
      // Borrar items de la compra
      prisma.itemCompra.deleteMany({
        where: { compraId: parseInt(id) }
      }),
      
      // Borrar pagos
      prisma.pago.deleteMany({
        where: { compraId: parseInt(id) }
      }),
      
      // Borrar envíos
      prisma.envio.deleteMany({
        where: { compraId: parseInt(id) }
      }),
      
      // Finalmente borrar la compra
      prisma.compra.delete({
        where: { id: parseInt(id) }
      })
    ]);

    return NextResponse.json({ success: true, message: 'Pedido borrado exitosamente' });
  } catch (error) {
    console.error('Error borrando pedido:', error);
    return NextResponse.json({ error: 'Error al borrar el pedido' }, { status: 500 });
  }
} 