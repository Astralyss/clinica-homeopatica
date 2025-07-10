import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export class ProductosService {
  // Obtener todos los productos
  static async obtenerTodos() {
    try {
      const productos = await prisma.producto.findMany({
        include: { imagenes: true },
        orderBy: { fechaCreacion: 'desc' }
      });
      return { success: true, data: productos };
    } catch (error) {
      console.error('Error al obtener productos:', error);
      return { success: false, error: error.message };
    }
  }

  // Obtener producto por ID
  static async obtenerPorId(id) {
    try {
      const producto = await prisma.producto.findUnique({
        where: { id: parseInt(id) },
        include: { imagenes: true }
      });
      return { success: true, data: producto };
    } catch (error) {
      console.error('Error al obtener producto:', error);
      return { success: false, error: error.message };
    }
  }

  // Crear nuevo producto
  static async crear(productoData) {
    try {
      const { imagenes, ...datosProducto } = productoData;
      
      const nuevoProducto = await prisma.producto.create({
        data: {
          ...datosProducto,
          precio: parseFloat(datosProducto.precio),
          imagenes: imagenes && imagenes.length > 0
            ? {
                create: imagenes.map(img => ({ 
                  url: img.url, 
                  esPrincipal: !!img.esPrincipal 
                }))
              }
            : undefined,
        },
        include: { imagenes: true }
      });
      
      return { success: true, data: nuevoProducto };
    } catch (error) {
      console.error('Error al crear producto:', error);
      return { success: false, error: error.message };
    }
  }

  // Actualizar producto
  static async actualizar(id, productoData) {
    try {
      const { imagenes, ...datosProducto } = productoData;
      // Actualizar producto
      await prisma.producto.update({
        where: { id: parseInt(id) },
        data: {
          ...datosProducto,
          precio: parseFloat(datosProducto.precio),
          beneficios: productoData.beneficios, // sobrescribe el array
        }
      });

      // Obtener imágenes actuales en la base de datos
      const imagenesActuales = await prisma.imagenProducto.findMany({
        where: { productoId: parseInt(id) }
      });
      const idsActuales = imagenesActuales.map(img => img.id);
      const idsRecibidos = imagenes.filter(img => img.id).map(img => img.id);

      // Eliminar solo las imágenes que el usuario quitó
      const idsAEliminar = idsActuales.filter(idImg => !idsRecibidos.includes(idImg));
      if (idsAEliminar.length > 0) {
        await prisma.imagenProducto.deleteMany({
          where: { id: { in: idsAEliminar } }
        });
      }

      // Agregar solo las nuevas imágenes (sin id)
      const nuevas = imagenes.filter(img => !img.id);
      if (nuevas.length > 0) {
        await prisma.imagenProducto.createMany({
          data: nuevas.map(img => ({
            url: img.url,
            esPrincipal: !!img.esPrincipal,
            productoId: parseInt(id)
          }))
        });
      }

      // (Opcional) Actualizar esPrincipal si lo deseas
      // ...

      // Obtener producto actualizado
      const productoActualizado = await prisma.producto.findUnique({
        where: { id: parseInt(id) },
        include: { imagenes: true }
      });

      return { success: true, data: productoActualizado };
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      return { success: false, error: error.message };
    }
  }

  // Eliminar producto
  static async eliminar(id) {
    try {
      // Eliminar imágenes asociadas primero
      await prisma.imagenProducto.deleteMany({ 
        where: { productoId: parseInt(id) } 
      });
      
      // Eliminar producto
      await prisma.producto.delete({ 
        where: { id: parseInt(id) } 
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      return { success: false, error: error.message };
    }
  }

  // Buscar productos
  static async buscar(termino, categoria = null) {
    try {
      const where = {
        activo: true,
        OR: [
          { nombre: { contains: termino, mode: 'insensitive' } },
          { descripcion: { contains: termino, mode: 'insensitive' } },
          { categoria: { contains: termino, mode: 'insensitive' } }
        ]
      };

      if (categoria && categoria !== 'all') {
        where.categoria = categoria;
      }

      const productos = await prisma.producto.findMany({
        where,
        include: { imagenes: true },
        orderBy: { fechaCreacion: 'desc' }
      });

      return { success: true, data: productos };
    } catch (error) {
      console.error('Error al buscar productos:', error);
      return { success: false, error: error.message };
    }
  }

  // Obtener estadísticas
  static async obtenerEstadisticas() {
    try {
      const [
        totalProductos,
        productosActivos,
        productosInactivos,
        productosSinStock
      ] = await Promise.all([
        prisma.producto.count(),
        prisma.producto.count({ where: { activo: true } }),
        prisma.producto.count({ where: { activo: false } }),
        prisma.producto.count({ where: { activo: true } }) // Por ahora, asumimos que todos tienen stock
      ]);

      return {
        success: true,
        data: {
          total: totalProductos,
          activos: productosActivos,
          inactivos: productosInactivos,
          sinStock: productosSinStock
        }
      };
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      return { success: false, error: error.message };
    }
  }
} 