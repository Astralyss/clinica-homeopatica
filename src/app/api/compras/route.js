import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

function generarNumeroOrden() {
  const year = new Date().getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);
  return `ORD-${year}-${random}`;
}

function mapCompraToResponse(compra) {
  const productos = (compra.items || []).map((item) => {
    const imagenPrincipal = item.producto?.imagenes?.find((img) => img.esPrincipal)?.url
      || item.producto?.imagenes?.[0]?.url
      || '/productos/placeholder.png';
    return {
      id: item.productoId,
      nombre: item.producto?.nombre,
      precio: Number(item.precioUnitario),
      cantidad: item.cantidad,
      imagen: imagenPrincipal,
    };
  });

  const envio = (compra.envios && compra.envios.length > 0) ? compra.envios[0] : null;
  const pago = (compra.pagos && compra.pagos.length > 0) ? compra.pagos[0] : null;

  return {
    id: compra.id,
    numeroOrden: compra.numeroOrden,
    fechaCompra: compra.fechaCompra,
    estado: compra.estado,
    total: Number(compra.total),
    productos,
    direccion: compra.direccion ? {
      nombre: compra.usuario ? `${compra.usuario.nombre} ${compra.usuario.apellidoPaterno}` : compra.direccion.nombre,
      calle: compra.direccion.calle,
      colonia: compra.direccion.colonia,
      ciudad: compra.direccion.ciudad,
      estado: compra.direccion.estado,
      codigoPostal: compra.direccion.codigoPostal,
    } : null,
    metodoPago: pago?.metodoPago || 'tarjeta',
    numeroSeguimiento: envio?.numeroGuia || null,
    fechaEntrega: envio?.fechaEntrega || null,
  };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const usuarioId = searchParams.get('usuarioId');
    const estado = searchParams.get('estado');
    const fechaDesde = searchParams.get('fechaDesde');
    const fechaHasta = searchParams.get('fechaHasta');

    if (!usuarioId) {
      return NextResponse.json({ error: 'usuarioId es requerido' }, { status: 400 });
    }

    const where = {
      usuarioId: parseInt(usuarioId),
      ...(estado && estado !== 'todos' ? { estado } : {}),
      ...(fechaDesde && fechaHasta
        ? { fechaCompra: { gte: new Date(fechaDesde), lte: new Date(fechaHasta) } }
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

    const respuesta = compras.map(mapCompraToResponse);
    return NextResponse.json({ success: true, compras: respuesta, total: respuesta.length });
  } catch (error) {
    console.error('Error al obtener compras:', error);
    return NextResponse.json(
      { error: 'Error al obtener las compras' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { usuarioId, direccion, items, pago } = body;

    if (!usuarioId || !Array.isArray(items) || items.length === 0 || !direccion) {
      return NextResponse.json(
        { error: 'Datos incompletos para crear la compra' },
        { status: 400 }
      );
    }

    const productoIds = items.map((i) => i.productoId);
    const productos = await prisma.producto.findMany({
      where: { id: { in: productoIds } },
      include: { imagenes: true },
    });

    const productosMap = new Map(productos.map((p) => [p.id, p]));

    let subtotal = 0;
    const detalle = items.map((i) => {
      const prod = productosMap.get(i.productoId);
      if (!prod) throw new Error(`Producto ${i.productoId} no encontrado`);
      const precio = Number(prod.precio);
      const cantidad = i.cantidad || 1;
      const lineSubtotal = precio * cantidad;
      subtotal += lineSubtotal;
      return { producto: prod, precioUnitario: precio, cantidad, subtotal: lineSubtotal };
    });

    const costoEnvio = subtotal > 500 ? 0 : 150;
    const impuestos = 0;
    const descuento = 0;
    const total = subtotal + costoEnvio + impuestos - descuento;

    const numeroOrden = generarNumeroOrden();

    const resultado = await prisma.$transaction(async (tx) => {
      // Validar inventario disponible
      for (const d of detalle) {
        const stock = await tx.producto.findUnique({
          where: { id: d.producto.id },
          select: { cantidad: true, nombre: true },
        });
        if (!stock || stock.cantidad < d.cantidad) {
          throw new Error(`Stock insuficiente para "${stock?.nombre || 'producto'}"`);
        }
      }
      const direccionCreada = await tx.direccion.create({
        data: {
          usuarioId: parseInt(usuarioId),
          nombre: direccion.nombre || 'Envío',
          calle: direccion.calle,
          numeroExterior: direccion.numeroExterior || null,
          numeroInterior: direccion.numeroInterior || null,
          colonia: direccion.colonia,
          ciudad: direccion.ciudad,
          estado: direccion.estado,
          codigoPostal: direccion.codigoPostal,
          referencias: direccion.referencias || null,
          esPrincipal: false,
        },
      });

      const carrito = await tx.carrito.create({ data: { usuarioId: parseInt(usuarioId) } });
      for (const d of detalle) {
        await tx.itemCarrito.create({
          data: {
            carritoId: carrito.id,
            productoId: d.producto.id,
            cantidad: d.cantidad,
            precioUnitario: d.precioUnitario,
          },
        });
      }

      const compra = await tx.compra.create({
        data: {
          numeroOrden,
          usuarioId: parseInt(usuarioId),
          carritoId: carrito.id,
          direccionId: direccionCreada.id,
          subtotal,
          descuento,
          impuestos,
          costoEnvio,
          total,
          estado: pago?.estado === 'completado' || pago?.success ? 'confirmada' : 'pendiente',
          notas: null,
        },
      });

      for (const d of detalle) {
        await tx.itemCompra.create({
          data: {
            compraId: compra.id,
            productoId: d.producto.id,
            cantidad: d.cantidad,
            precioUnitario: d.precioUnitario,
            subtotal: d.subtotal,
          },
        });
        // Descontar inventario
        await tx.producto.update({
          where: { id: d.producto.id },
          data: { cantidad: { decrement: d.cantidad } },
        });
      }

      if (pago) {
        await tx.pago.create({
          data: {
            compraId: compra.id,
            usuarioId: parseInt(usuarioId),
            metodoPago: pago.metodoPago || 'tarjeta',
            monto: total,
            moneda: pago.moneda || 'MXN',
            estado: pago.estado || 'completado',
            stripePaymentIntentId: pago.paymentIntentId || null,
            fechaPago: new Date(),
          },
        });
      }

      await tx.envio.create({
        data: {
          compraId: compra.id,
          direccionId: direccionCreada.id,
          metodoEnvio: 'estandar',
          costo: costoEnvio,
          estado: 'pendiente',
        },
      });

      const compraCompleta = await tx.compra.findUnique({
        where: { id: compra.id },
        include: {
          usuario: true,
          items: { include: { producto: { include: { imagenes: true } } } },
          direccion: true,
          pagos: true,
          envios: true,
        },
      });

      return { compra: compraCompleta };
    });

    const respuesta = mapCompraToResponse(resultado.compra);
    return NextResponse.json({ success: true, compra: respuesta }, { status: 201 });
  } catch (error) {
    console.error('Error al crear compra:', error);
    return NextResponse.json({ error: 'Error al crear la compra' }, { status: 500 });
  }
}