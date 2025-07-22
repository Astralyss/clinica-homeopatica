import { PrismaClient } from '../../generated/prisma/index.js';

const prisma = new PrismaClient();

export class HorariosService {
  /**
   * Obtiene los horarios disponibles para una fecha específica
   */
  static async getHorariosDisponibles(fecha) {
    try {
      // Verificar que no sea sábado o domingo
      const diaSemana = new Date(fecha).getDay();
      if (diaSemana === 0 || diaSemana === 6) {
        return [];
      }

      // Obtener todos los horarios activos
      const horarios = await prisma.horario.findMany({
        where: { activo: true },
        orderBy: { hora: 'asc' }
      });

      // Obtener horarios ya reservados para esa fecha
      const horariosReservados = await prisma.horarioDisponible.findMany({
        where: {
          fecha: new Date(fecha),
          disponible: false
        },
        include: {
          horario: true
        }
      });

      // Crear un set de horarios reservados para búsqueda rápida
      const horariosReservadosSet = new Set(
        horariosReservados.map(h => h.horario.hora)
      );

      // Filtrar horarios disponibles
      const horariosDisponibles = horarios.filter(
        horario => !horariosReservadosSet.has(horario.hora)
      );

      return horariosDisponibles;
    } catch (error) {
      console.error('Error al obtener horarios disponibles:', error);
      throw error;
    }
  }

  /**
   * Verifica si un horario específico está disponible
   */
  static async verificarDisponibilidad(fecha, hora) {
    try {
      // Verificar que no sea sábado o domingo
      const diaSemana = new Date(fecha).getDay();
      if (diaSemana === 0 || diaSemana === 6) {
        return { disponible: false, motivo: 'No se atiende sábados y domingos' };
      }

      // Verificar que el horario existe y está activo
      const horario = await prisma.horario.findFirst({
        where: {
          hora: hora,
          activo: true
        }
      });

      if (!horario) {
        return { disponible: false, motivo: 'Horario no válido' };
      }

      // Verificar si ya está reservado
      const horarioDisponible = await prisma.horarioDisponible.findUnique({
        where: {
          fecha_horarioId: {
            fecha: new Date(fecha),
            horarioId: horario.id
          }
        }
      });

      if (horarioDisponible && !horarioDisponible.disponible) {
        return { disponible: false, motivo: 'Horario ya reservado' };
      }

      return { disponible: true };
    } catch (error) {
      console.error('Error al verificar disponibilidad:', error);
      throw error;
    }
  }

  /**
   * Reserva un horario específico
   */
  static async reservarHorario(fecha, hora, consultaId) {
    try {
      // Verificar disponibilidad
      const verificacion = await this.verificarDisponibilidad(fecha, hora);
      if (!verificacion.disponible) {
        throw new Error(verificacion.motivo);
      }

      // Obtener el horario
      const horario = await prisma.horario.findFirst({
        where: { hora: hora, activo: true }
      });

      if (!horario) {
        throw new Error('Horario no válido');
      }

      // Crear o actualizar el registro de disponibilidad
      const horarioDisponible = await prisma.horarioDisponible.upsert({
        where: {
          fecha_horarioId: {
            fecha: new Date(fecha),
            horarioId: horario.id
          }
        },
        update: {
          disponible: false,
          fechaActualizacion: new Date()
        },
        create: {
          fecha: new Date(fecha),
          horarioId: horario.id,
          disponible: false
        }
      });

      // Actualizar la consulta con el horario reservado
      await prisma.consulta.update({
        where: { id: consultaId },
        data: {
          horarioDisponibleId: horarioDisponible.id
        }
      });

      return horarioDisponible;
    } catch (error) {
      console.error('Error al reservar horario:', error);
      throw error;
    }
  }

  /**
   * Libera un horario reservado (cuando se cancela una consulta)
   */
  static async liberarHorario(consultaId) {
    try {
      // Obtener la consulta con su horario
      const consulta = await prisma.consulta.findUnique({
        where: { id: consultaId },
        include: {
          horarioDisponible: {
            include: {
              horario: true
            }
          }
        }
      });

      if (!consulta || !consulta.horarioDisponible) {
        return;
      }

      // Actualizar la disponibilidad
      await prisma.horarioDisponible.update({
        where: { id: consulta.horarioDisponible.id },
        data: {
          disponible: true,
          fechaActualizacion: new Date()
        }
      });

      // Limpiar la referencia en la consulta
      await prisma.consulta.update({
        where: { id: consultaId },
        data: {
          horarioDisponibleId: null
        }
      });
    } catch (error) {
      console.error('Error al liberar horario:', error);
      throw error;
    }
  }

  /**
   * Obtiene estadísticas de disponibilidad para un rango de fechas
   */
  static async getEstadisticasDisponibilidad(fechaDesde, fechaHasta) {
    try {
      const estadisticas = await prisma.horarioDisponible.groupBy({
        by: ['fecha', 'disponible'],
        where: {
          fecha: {
            gte: new Date(fechaDesde),
            lte: new Date(fechaHasta)
          }
        },
        _count: {
          id: true
        }
      });

      return estadisticas;
    } catch (error) {
      console.error('Error al obtener estadísticas de disponibilidad:', error);
      throw error;
    }
  }
} 