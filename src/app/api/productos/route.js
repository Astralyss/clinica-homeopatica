import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const productos = await prisma.producto.findMany({
      include: { imagenes: true },
    });
    return new Response(JSON.stringify(productos), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al obtener productos', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { imagenes, ...productoData } = body;
    const nuevo = await prisma.producto.create({
      data: {
        ...productoData,
        imagenes: imagenes && imagenes.length > 0
          ? {
              create: imagenes.map(img => ({ url: img.url, esPrincipal: !!img.esPrincipal }))
            }
          : undefined,
      },
      include: { imagenes: true },
    });
    return new Response(JSON.stringify(nuevo), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al crear producto', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get('id'));
    if (!id) return new Response(JSON.stringify({ error: 'ID requerido' }), { status: 400 });
    const body = await req.json();
    const { imagenes, ...productoData } = body;
    // Actualizar producto
    const actualizado = await prisma.producto.update({
      where: { id },
      data: productoData,
    });
    // Eliminar imágenes anteriores
    await prisma.imagenProducto.deleteMany({ where: { productoId: id } });
    // Crear nuevas imágenes (si hay)
    if (imagenes && imagenes.length > 0) {
      await prisma.imagenProducto.createMany({
        data: imagenes.map(img => ({ url: img.url, esPrincipal: !!img.esPrincipal, productoId: id })),
      });
    }
    // Devolver producto actualizado con imágenes
    const productoConImagenes = await prisma.producto.findUnique({
      where: { id },
      include: { imagenes: true },
    });
    return new Response(JSON.stringify(productoConImagenes), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al actualizar producto', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get('id'));
    if (!id) return new Response(JSON.stringify({ error: 'ID requerido' }), { status: 400 });
    // Eliminar imágenes asociadas primero (por seguridad)
    await prisma.imagenProducto.deleteMany({ where: { productoId: id } });
    await prisma.producto.delete({ where: { id } });
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al eliminar producto', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 