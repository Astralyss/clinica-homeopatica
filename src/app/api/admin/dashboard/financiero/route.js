import { NextResponse } from 'next/server';
import { PrismaClient } from '../../../../../generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const ahora = new Date();
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    const inicioMesAnterior = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1);
    const finMesAnterior = new Date(ahora.getFullYear(), ahora.getMonth(), 0);

    // Obtener estadísticas financieras
    const [
      ingresosTotales,
      ingresosMes,
      ingresosMesAnterior
    ] = await Promise.all([
      prisma.compra.aggregate({
        where: { 
          estado: { not: 'cancelada' },
          pagos: { some: { estado: 'completado' } }
        },
        _sum: { total: true }
      }),
      prisma.compra.aggregate({
        where: { 
          estado: { not: 'cancelada' },
          fechaCompra: { gte: inicioMes },
          pagos: { some: { estado: 'completado' } }
        },
        _sum: { total: true }
      }),
      prisma.compra.aggregate({
        where: { 
          estado: { not: 'cancelada' },
          fechaCompra: { 
            gte: inicioMesAnterior,
            lte: finMesAnterior
          },
          pagos: { some: { estado: 'completado' } }
        },
        _sum: { total: true }
      })
    ]);

    const total = ingresosTotales._sum.total || 0;
    const mesActual = ingresosMes._sum.total || 0;
    const mesAnterior = ingresosMesAnterior._sum.total || 0;

    return NextResponse.json({
      ingresosTotales: parseFloat(total.toFixed(2)),
      ingresosMes: parseFloat(mesActual.toFixed(2)),
      ingresosMesAnterior: parseFloat(mesAnterior.toFixed(2))
    });
  } catch (error) {
    console.error('Error fetching financiero stats:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 