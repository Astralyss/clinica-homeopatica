import { NextResponse } from 'next/server';
import { PrismaClient } from '../../../../../generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Obtener estadísticas de consultas
    const [
      totalConsultas,
      consultasPendientes,
      consultasConfirmadas,
      consultasCompletadas
    ] = await Promise.all([
      prisma.consulta.count(),
      prisma.consulta.count({ where: { estado: 'pendiente' } }),
      prisma.consulta.count({ where: { estado: 'confirmada' } }),
      prisma.consulta.count({ where: { estado: 'completada' } })
    ]);

    return NextResponse.json({
      total: totalConsultas,
      pendientes: consultasPendientes,
      confirmadas: consultasConfirmadas,
      completadas: consultasCompletadas
    });
  } catch (error) {
    console.error('Error fetching consultas stats:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 