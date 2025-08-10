import { NextResponse } from 'next/server';
import { PrismaClient } from '../../../../../generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const ahora = new Date();
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    const inicioMesAnterior = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1);
    const finMesAnterior = new Date(ahora.getFullYear(), ahora.getMonth(), 0);

    // Obtener estadísticas de ventas
    const [
      totalVentas,
      ventasMesActual,
      ventasMesAnterior,
      totalPedidos
    ] = await Promise.all([
      prisma.compra.aggregate({
        where: { estado: { not: 'cancelada' } },
        _sum: { total: true }
      }),
      prisma.compra.aggregate({
        where: { 
          estado: { not: 'cancelada' },
          fechaCompra: { gte: inicioMes }
        },
        _sum: { total: true }
      }),
      prisma.compra.aggregate({
        where: { 
          estado: { not: 'cancelada' },
          fechaCompra: { 
            gte: inicioMesAnterior,
            lte: finMesAnterior
          }
        },
        _sum: { total: true }
      }),
      prisma.compra.count({ where: { estado: { not: 'cancelada' } } })
    ]);

    const total = totalVentas._sum.total || 0;
    const mesActual = ventasMesActual._sum.total || 0;
    const mesAnterior = ventasMesAnterior._sum.total || 0;
    const promedioPedido = totalPedidos > 0 ? total / totalPedidos : 0;

    return NextResponse.json({
      total: parseFloat(total.toFixed(2)),
      mesActual: parseFloat(mesActual.toFixed(2)),
      promedioPedido: parseFloat(promedioPedido.toFixed(2)),
      mesAnterior: parseFloat(mesAnterior.toFixed(2))
    });
  } catch (error) {
    console.error('Error fetching ventas stats:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 