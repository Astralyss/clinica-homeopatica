import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

function mapCompraAdmin(compra) {
  const productos = (compra.items || []).map((item) => ({
    id: item.productoId,
    nombre: item.producto?.nombre,
    cantidad: item.cantidad,
    precio: Number(item.precioUnitario),
    imagen:
      item.producto?.imagenes?.find((img) => img.esPrincipal)?.url ||
      item.producto?.imagenes?.[0]?.url ||
      '/productos/placeholder.png',
  }));

  const envio = compra.envios?.[0] || null;
  const pago = compra.pagos?.[0] || null;

  return {
    id: compra.id,
    numeroOrden: compra.numeroOrden,
    fechaCompra: compra.fechaCompra,
    estado: compra.estado,
    subtotal: Number(compra.subtotal),
    costoEnvio: Number(compra.costoEnvio || 0),
    total: Number(compra.total),
    cliente: {
      id: compra.usuario.id,
      nombre: compra.usuario.nombre,
      apellidoPaterno: compra.usuario.apellidoPaterno,
      email: compra.usuario.email,
    },
    productosCantidad: productos.reduce((s, p) => s + p.cantidad, 0),
    productos,
    direccion: compra.direccion ? {
      calle: compra.direccion.calle,
      numeroExterior: compra.direccion.numeroExterior,
      colonia: compra.direccion.colonia,
      ciudad: compra.direccion.ciudad,
      estado: compra.direccion.estado,
      codigoPostal: compra.direccion.codigoPostal,
      nombre: compra.direccion.nombre,
      referencias: compra.direccion.referencias,
    } : null,
    envio: envio ? {
      id: envio.id,
      numeroGuia: envio.numeroGuia,
      empresaEnvio: envio.empresaEnvio,
      costo: Number(envio.costo || 0),
      estado: envio.estado,
      fechaEnvio: envio.fechaEnvio,
      fechaEntrega: envio.fechaEntrega,
    } : null,
    pago: pago ? {
      id: pago.id,
      metodoPago: pago.metodoPago,
      monto: Number(pago.monto),
      estado: pago.estado,
    } : null,
  };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const estado = searchParams.get('estado');
    const q = searchParams.get('q');

    const where = {
      ...(estado && estado !== 'todos' ? { estado } : {}),
      ...(q
        ? {
            OR: [
              { numeroOrden: { contains: q, mode: 'insensitive' } },
              { usuario: { nombre: { contains: q, mode: 'insensitive' } } },
              { usuario: { apellidoPaterno: { contains: q, mode: 'insensitive' } } },
              { usuario: { email: { contains: q, mode: 'insensitive' } } },
            ],
          }
        : {}),
    };

    const compras = await prisma.compra.findMany({
      where,
      include: {
        usuario: true,
        items: { include: { producto: { include: { imagenes: true } } } },
        direccion: true,
        pagos: true,
        envios: true,
      },
      orderBy: { fechaCompra: 'desc' },
    });

    const data = compras.map(mapCompraAdmin);
    return NextResponse.json({ success: true, ordenes: data, total: data.length });
  } catch (error) {
    console.error('Error listando ordenes admin:', error);
    return NextResponse.json({ error: 'Error al listar órdenes' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { compraId, numeroGuia, empresaEnvio, estadoEnvio, estadoCompra } = body;

    if (!compraId) {
      return NextResponse.json({ error: 'compraId es requerido' }, { status: 400 });
    }

    const compra = await prisma.compra.findUnique({
      where: { id: compraId },
      include: { envios: true, direccion: true, usuario: true, pagos: true, items: { include: { producto: true } } },
    });

    if (!compra) {
      return NextResponse.json({ error: 'Compra no encontrada' }, { status: 404 });
    }

    // Asegurar que exista registro de envío
    let envio = compra.envios?.[0] || null;
    if (!envio) {
      envio = await prisma.envio.create({
        data: {
          compraId: compra.id,
          direccionId: compra.direccionId,
          metodoEnvio: 'estandar',
          costo: 0,
          estado: 'pendiente',
        },
      });
    }

    const dataEnvio = {
      ...(numeroGuia !== undefined ? { numeroGuia } : {}),
      ...(empresaEnvio !== undefined ? { empresaEnvio } : {}),
      ...(estadoEnvio !== undefined ? { estado: estadoEnvio } : {}),
      ...(estadoEnvio === 'enviado' ? { fechaEnvio: new Date() } : {}),
      ...(estadoEnvio === 'entregado' ? { fechaEntrega: new Date() } : {}),
    };

    if (Object.keys(dataEnvio).length > 0) {
      await prisma.envio.update({ where: { id: envio.id }, data: dataEnvio });
    }

    if (estadoCompra) {
      await prisma.compra.update({ where: { id: compra.id }, data: { estado: estadoCompra } });
    }

    const compraActualizada = await prisma.compra.findUnique({
      where: { id: compra.id },
      include: {
        usuario: true,
        items: { include: { producto: true } },
        direccion: true,
        pagos: true,
        envios: true,
      },
    });

    return NextResponse.json({ success: true, orden: mapCompraAdmin(compraActualizada) });
  } catch (error) {
    console.error('Error actualizando orden admin:', error);
    return NextResponse.json({ error: 'Error al actualizar la orden' }, { status: 500 });
  }
}

