import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const categorias = await prisma.producto.findMany({
      select: { categoria: true },
      distinct: ['categoria']
    });
    // Extraer solo los nombres de categoría
    const categoriasUnicas = categorias.map(c => c.categoria).filter(Boolean);
    return NextResponse.json(categoriasUnicas, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 