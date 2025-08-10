import { NextResponse } from 'next/server';
import { PrismaClient } from '../../../../generated/prisma/index.js';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const ahora = new Date();
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    const inicioMesAnterior = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1);
    const finMesAnterior = new Date(ahora.getFullYear(), ahora.getMonth(), 0);

    // Obtener todas las estadísticas en paralelo
    const [
      // Estadísticas de pedidos
      totalPedidos,
      pedidosPendientes,
      pedidosEnviados,
      pedidosEntregados,
      pedidosCancelados,
      
      // Estadísticas de productos
      totalProductos,
      productosActivos,
      productosStockBajo,
      productosSinStock,
      
      // Estadísticas de ventas
      totalVentas,
      ventasMesActual,
      ventasMesAnterior,
      totalPedidosCompletados,
      
      // Estadísticas de consultas
      totalConsultas,
      consultasPendientes,
      consultasConfirmadas,
      consultasCompletadas,
      
      // Estadísticas de usuarios
      totalUsuarios,
      usuariosNuevosMes,
      usuariosActivos,
      
      // Estadísticas financieras
      ingresosTotales,
      ingresosMes,
      ingresosMesAnterior
    ] = await Promise.all([
      // Pedidos
      prisma.compra.count(),
      prisma.compra.count({ where: { estado: 'pendiente' } }),
      prisma.compra.count({ where: { estado: 'enviada' } }),
      prisma.compra.count({ where: { estado: 'entregada' } }),
      prisma.compra.count({ where: { estado: 'cancelada' } }),
      
      // Productos
      prisma.producto.count(),
      prisma.producto.count({ where: { activo: true } }),
      prisma.producto.count({ where: { cantidad: { lt: 10, gt: 0 } } }),
      prisma.producto.count({ where: { cantidad: 0 } }),
      
      // Ventas
      prisma.compra.aggregate({
        where: { estado: { not: 'cancelada' } },
        _sum: { total: true }
      }),
      prisma.compra.aggregate({
        where: { 
          estado: { not: 'cancelada' },
          fechaCompra: { gte: inicioMes }
        },
        _sum: { total: true }
      }),
      prisma.compra.aggregate({
        where: { 
          estado: { not: 'cancelada' },
          fechaCompra: { 
            gte: inicioMesAnterior,
            lte: finMesAnterior
          }
        },
        _sum: { total: true }
      }),
      prisma.compra.count({ where: { estado: { not: 'cancelada' } } }),
      
      // Consultas
      prisma.consulta.count(),
      prisma.consulta.count({ where: { estado: 'pendiente' } }),
      prisma.consulta.count({ where: { estado: 'confirmada' } }),
      prisma.consulta.count({ where: { estado: 'completada' } }),
      
      // Usuarios
      prisma.usuario.count(),
      prisma.usuario.count({ 
        where: { 
          fechaCreacion: { gte: inicioMes },
          rolId: 2
        } 
      }),
      prisma.usuario.count({ 
        where: { 
          activo: true,
          rolId: 2
        } 
      }),
      
      // Financiero
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

    // Procesar los datos
    const total = totalVentas._sum.total || 0;
    const mesActual = ventasMesActual._sum.total || 0;
    const mesAnterior = ventasMesAnterior._sum.total || 0;
    const promedioPedido = totalPedidosCompletados > 0 ? total / totalPedidosCompletados : 0;

    const ingresosTotal = ingresosTotales._sum.total || 0;
    const ingresosMesActual = ingresosMes._sum.total || 0;
    const ingresosMesAnteriorValue = ingresosMesAnterior._sum.total || 0;

    return NextResponse.json({
      pedidos: {
        total: totalPedidos,
        pendientes: pedidosPendientes,
        enviados: pedidosEnviados,
        entregados: pedidosEntregados,
        cancelados: pedidosCancelados
      },
      productos: {
        total: totalProductos,
        activos: productosActivos,
        stockBajo: productosStockBajo,
        sinStock: productosSinStock
      },
      ventas: {
        total: parseFloat(total.toFixed(2)),
        mesActual: parseFloat(mesActual.toFixed(2)),
        promedioPedido: parseFloat(promedioPedido.toFixed(2)),
        mesAnterior: parseFloat(mesAnterior.toFixed(2))
      },
      consultas: {
        total: totalConsultas,
        pendientes: consultasPendientes,
        confirmadas: consultasConfirmadas,
        completadas: consultasCompletadas
      },
      usuarios: {
        total: totalUsuarios,
        nuevosMes: usuariosNuevosMes,
        activos: usuariosActivos
      },
      financiero: {
        ingresosTotales: parseFloat(ingresosTotal.toFixed(2)),
        ingresosMes: parseFloat(ingresosMesActual.toFixed(2)),
        ingresosMesAnterior: parseFloat(ingresosMesAnteriorValue.toFixed(2))
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 