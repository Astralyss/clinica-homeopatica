// Servicio para manejar las consultas médicas
import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

export const consultasService = {
  // Crear una nueva consulta
  async crearConsulta(datosConsulta) {
    try {
      const consulta = await prisma.consulta.create({
        data: {
          nombre: datosConsulta.nombre,
          apellido: datosConsulta.apellido,
          email: datosConsulta.correo,
          telefono: datosConsulta.telefono,
          fechaConsulta: new Date(datosConsulta.fechaSeleccionada),
          horaConsulta: datosConsulta.horaSeleccionada,
          estado: 'pendiente',
          usuarioId: datosConsulta.usuarioId || null,
          notas: datosConsulta.notas || null
        }
      });
      
      return { success: true, data: consulta };
    } catch (error) {
      console.error('Error al crear consulta:', error);
      return { success: false, error: error.message };
    }
  },

  // Obtener todas las consultas (para el panel administrativo)
  async obtenerConsultas(filtros = {}) {
    try {
      const where = {};
      
      // Filtros opcionales
      if (filtros.estado) {
        where.estado = filtros.estado;
      }
      
      if (filtros.fechaDesde) {
        where.fechaConsulta = {
          gte: new Date(filtros.fechaDesde)
        };
      }
      
      if (filtros.fechaHasta) {
        where.fechaConsulta = {
          ...where.fechaConsulta,
          lte: new Date(filtros.fechaHasta)
        };
      }

      const consultas = await prisma.consulta.findMany({
        where,
        orderBy: {
          fechaCreacion: 'desc'
        },
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              apellidoPaterno: true,
              email: true
            }
          }
        }
      });
      
      return { success: true, data: consultas };
    } catch (error) {
      console.error('Error al obtener consultas:', error);
      return { success: false, error: error.message };
    }
  },

  // Obtener una consulta específica por ID
  async obtenerConsultaPorId(id) {
    try {
      const consulta = await prisma.consulta.findUnique({
        where: { id: parseInt(id) },
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              apellidoPaterno: true,
              email: true
            }
          }
        }
      });
      
      return { success: true, data: consulta };
    } catch (error) {
      console.error('Error al obtener consulta:', error);
      return { success: false, error: error.message };
    }
  },

  // Actualizar el estado de una consulta
  async actualizarEstadoConsulta(id, nuevoEstado, notas = null) {
    try {
      const consulta = await prisma.consulta.update({
        where: { id: parseInt(id) },
        data: {
          estado: nuevoEstado,
          notas: notas
        }
      });
      
      return { success: true, data: consulta };
    } catch (error) {
      console.error('Error al actualizar consulta:', error);
      return { success: false, error: error.message };
    }
  },

  // Obtener estadísticas de consultas
  async obtenerEstadisticasConsultas() {
    try {
      const totalConsultas = await prisma.consulta.count();
      const consultasPendientes = await prisma.consulta.count({
        where: { estado: 'pendiente' }
      });
      const consultasConfirmadas = await prisma.consulta.count({
        where: { estado: 'confirmada' }
      });
      const consultasCompletadas = await prisma.consulta.count({
        where: { estado: 'completada' }
      });
      const consultasCanceladas = await prisma.consulta.count({
        where: { estado: 'cancelada' }
      });

      // Consultas por mes (últimos 6 meses)
      const seisMesesAtras = new Date();
      seisMesesAtras.setMonth(seisMesesAtras.getMonth() - 6);
      
      const consultasPorMes = await prisma.consulta.groupBy({
        by: ['fechaCreacion'],
        where: {
          fechaCreacion: {
            gte: seisMesesAtras
          }
        },
        _count: {
          id: true
        }
      });

      return {
        success: true,
        data: {
          total: totalConsultas,
          pendientes: consultasPendientes,
          confirmadas: consultasConfirmadas,
          completadas: consultasCompletadas,
          canceladas: consultasCanceladas,
          porMes: consultasPorMes
        }
      };
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      return { success: false, error: error.message };
    }
  },

  // Verificar disponibilidad de horario
  async verificarDisponibilidad(fecha, hora) {
    try {
      const consultasExistentes = await prisma.consulta.count({
        where: {
          fechaConsulta: new Date(fecha),
          horaConsulta: hora,
          estado: {
            in: ['pendiente', 'confirmada']
          }
        }
      });
      
      // Consideramos que hay disponibilidad si hay menos de 2 consultas en ese horario
      return { success: true, disponible: consultasExistentes < 2 };
    } catch (error) {
      console.error('Error al verificar disponibilidad:', error);
      return { success: false, error: error.message };
    }
  }
}; 