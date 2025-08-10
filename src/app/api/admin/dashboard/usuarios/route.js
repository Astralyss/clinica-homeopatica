import { NextResponse } from 'next/server';
import { PrismaClient } from '../../../../../generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const ahora = new Date();
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);

    // Obtener estadísticas de usuarios
    const [
      totalUsuarios,
      usuariosNuevosMes,
      usuariosActivos
    ] = await Promise.all([
      prisma.usuario.count(),
      prisma.usuario.count({ 
        where: { 
          fechaCreacion: { gte: inicioMes },
          rolId: 2 // Solo clientes, no admins
        } 
      }),
      prisma.usuario.count({ 
        where: { 
          activo: true,
          rolId: 2 // Solo clientes, no admins
        } 
      })
    ]);

    return NextResponse.json({
      total: totalUsuarios,
      nuevosMes: usuariosNuevosMes,
      activos: usuariosActivos
    });
  } catch (error) {
    console.error('Error fetching usuarios stats:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 