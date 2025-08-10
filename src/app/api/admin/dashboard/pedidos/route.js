import { NextResponse } from 'next/server';
import { PrismaClient } from '../../../../../generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Obtener estadísticas de pedidos
    const [
      totalPedidos,
      pedidosPendientes,
      pedidosEnviados,
      pedidosEntregados,
      pedidosCancelados
    ] = await Promise.all([
      prisma.compra.count(),
      prisma.compra.count({ where: { estado: 'pendiente' } }),
      prisma.compra.count({ where: { estado: 'enviada' } }),
      prisma.compra.count({ where: { estado: 'entregada' } }),
      prisma.compra.count({ where: { estado: 'cancelada' } })
    ]);

    return NextResponse.json({
      total: totalPedidos,
      pendientes: pedidosPendientes,
      enviados: pedidosEnviados,
      entregados: pedidosEntregados,
      cancelados: pedidosCancelados
    });
  } catch (error) {
    console.error('Error fetching pedidos stats:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 