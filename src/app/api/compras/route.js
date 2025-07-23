import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const usuarioId = searchParams.get('usuarioId');
    const estado = searchParams.get('estado');
    const fechaDesde = searchParams.get('fechaDesde');
    const fechaHasta = searchParams.get('fechaHasta');

    // En producción, esto vendría de la base de datos
    // const compras = await prisma.compra.findMany({
    //   where: {
    //     usuarioId: parseInt(usuarioId),
    //     ...(estado && { estado }),
    //     ...(fechaDesde && fechaHasta && {
    //       fechaCompra: {
    //         gte: new Date(fechaDesde),
    //         lte: new Date(fechaHasta)
    //       }
    //     })
    //   },
    //   include: {
    //     items: {
    //       include: {
    //         producto: true
    //       }
    //     },
    //     direccion: true
    //   },
    //   orderBy: {
    //     fechaCompra: 'desc'
    //   }
    // });

    // Datos de ejemplo
    const comprasEjemplo = [
      {
        id: 1,
        numeroOrden: 'ORD-2024-001234',
        fechaCompra: '2024-01-15T10:30:00Z',
        estado: 'entregada',
        total: 1250.00,
        productos: [
          {
            id: 1,
            nombre: 'Vitamina D3 2000 UI',
            precio: 450.00,
            cantidad: 2,
            imagen: '/productos/vitaminaD.avif'
          },
          {
            id: 2,
            nombre: 'Colágeno Hidrolizado',
            precio: 350.00,
            cantidad: 1,
            imagen: '/productos/colageno.avif'
          }
        ],
        direccion: {
          nombre: 'Juan Pérez',
          calle: 'Av. Insurgentes Sur 123',
          colonia: 'Del Valle',
          ciudad: 'Ciudad de México',
          estado: 'CDMX',
          codigoPostal: '03100'
        },
        metodoPago: 'tarjeta',
        numeroSeguimiento: 'TRK123456789',
        fechaEntrega: '2024-01-18T14:00:00Z'
      },
      {
        id: 2,
        numeroOrden: 'ORD-2024-001235',
        fechaCompra: '2024-01-20T15:45:00Z',
        estado: 'enviada',
        total: 850.00,
        productos: [
          {
            id: 3,
            nombre: 'Equinácea Premium',
            precio: 850.00,
            cantidad: 1,
            imagen: '/productos/equinacea.avif'
          }
        ],
        direccion: {
          nombre: 'María García',
          calle: 'Calle Reforma 456',
          colonia: 'Centro',
          ciudad: 'Ciudad de México',
          estado: 'CDMX',
          codigoPostal: '06000'
        },
        metodoPago: 'paypal',
        numeroSeguimiento: 'TRK987654321',
        fechaEntrega: null
      },
      {
        id: 3,
        numeroOrden: 'ORD-2024-001236',
        fechaCompra: '2024-01-25T09:15:00Z',
        estado: 'pendiente',
        total: 2100.00,
        productos: [
          {
            id: 4,
            nombre: 'Maca Andina Premium',
            precio: 700.00,
            cantidad: 3,
            imagen: '/productos/maca.avif'
          }
        ],
        direccion: {
          nombre: 'Carlos López',
          calle: 'Calle Juárez 789',
          colonia: 'Roma',
          ciudad: 'Ciudad de México',
          estado: 'CDMX',
          codigoPostal: '06700'
        },
        metodoPago: 'tarjeta',
        numeroSeguimiento: null,
        fechaEntrega: null
      }
    ];

    // Aplicar filtros
    let comprasFiltradas = comprasEjemplo;

    if (estado && estado !== 'todos') {
      comprasFiltradas = comprasFiltradas.filter(compra => compra.estado === estado);
    }

    if (fechaDesde && fechaHasta) {
      const desde = new Date(fechaDesde);
      const hasta = new Date(fechaHasta);
      comprasFiltradas = comprasFiltradas.filter(compra => {
        const fechaCompra = new Date(compra.fechaCompra);
        return fechaCompra >= desde && fechaCompra <= hasta;
      });
    }

    return NextResponse.json({
      success: true,
      compras: comprasFiltradas,
      total: comprasFiltradas.length
    });

  } catch (error) {
    console.error('Error al obtener compras:', error);
    return NextResponse.json(
      { error: 'Error al obtener las compras' },
      { status: 500 }
    );
  }
} 