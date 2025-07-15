import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';
  const categoria = searchParams.get('categoria') || '';

  // Construir el filtro
  const where = {};
  if (search) {
    where.OR = [
      { nombre: { contains: search, mode: 'insensitive' } },
      { id_producto: { contains: search, mode: 'insensitive' } },
      { descripcion: { contains: search, mode: 'insensitive' } },
      { beneficios: { hasSome: [search] } },
    ];
  }
  if (categoria && categoria !== 'all') {
    where.categoria = categoria;
  }

  try {
    const productos = await prisma.producto.findMany({
      where,
      include: { imagenes: true },
      orderBy: { fechaCreacion: 'desc' }
    });
    return NextResponse.json(productos, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 