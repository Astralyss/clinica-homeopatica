import { NextResponse } from 'next/server';
import { PrismaClient } from '../../../../../generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Obtener estadísticas de productos
    const [
      totalProductos,
      productosActivos,
      productosStockBajo,
      productosSinStock
    ] = await Promise.all([
      prisma.producto.count(),
      prisma.producto.count({ where: { activo: true } }),
      prisma.producto.count({ where: { cantidad: { lt: 10, gt: 0 } } }),
      prisma.producto.count({ where: { cantidad: 0 } })
    ]);

    return NextResponse.json({
      total: totalProductos,
      activos: productosActivos,
      stockBajo: productosStockBajo,
      sinStock: productosSinStock
    });
  } catch (error) {
    console.error('Error fetching productos stats:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 