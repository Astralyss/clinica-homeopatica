import { useState, useEffect } from 'react';

export const useConsultas = () => {
  const [consultas, setConsultas] = useState([]);
  const [estadisticas, setEstadisticas] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar todas las consultas
  const cargarConsultas = async (filtros = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (filtros.estado) params.append('estado', filtros.estado);
      if (filtros.fechaDesde) params.append('fechaDesde', filtros.fechaDesde);
      if (filtros.fechaHasta) params.append('fechaHasta', filtros.fechaHasta);

      const response = await fetch(`/api/consultas?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setConsultas(data);
      } else {
        setError(data.error || 'Error al cargar consultas');
      }
    } catch (error) {
      setError('Error de conexión al cargar consultas');
      console.error('Error al cargar consultas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar estadísticas
  const cargarEstadisticas = async () => {
    try {
      const response = await fetch('/api/consultas/estadisticas');
      const data = await response.json();
      
      if (response.ok) {
        setEstadisticas(data);
      } else {
        console.error('Error al cargar estadísticas:', data.error);
      }
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  // Crear nueva consulta
  const crearConsulta = async (datosConsulta) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/consultas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosConsulta),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Recargar consultas después de crear una nueva
        await cargarConsultas();
        await cargarEstadisticas();
        return { success: true, data: data.data };
      } else {
        setError(data.error || 'Error al crear consulta');
        return { success: false, error: data.error };
      }
    } catch (error) {
      const errorMessage = 'Error de conexión al crear consulta';
      setError(errorMessage);
      console.error('Error al crear consulta:', error);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Actualizar consulta
  const actualizarConsulta = async (id, nuevosDatos) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/consultas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevosDatos),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Recargar consultas después de actualizar
        await cargarConsultas();
        await cargarEstadisticas();
        return { success: true, data: data.data };
      } else {
        setError(data.error || 'Error al actualizar consulta');
        return { success: false, error: data.error };
      }
    } catch (error) {
      const errorMessage = 'Error de conexión al actualizar consulta';
      setError(errorMessage);
      console.error('Error al actualizar consulta:', error);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Cancelar consulta
  const cancelarConsulta = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/consultas/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (response.ok) {
        // Recargar consultas después de cancelar
        await cargarConsultas();
        await cargarEstadisticas();
        return { success: true, data: data.data };
      } else {
        setError(data.error || 'Error al cancelar consulta');
        return { success: false, error: data.error };
      }
    } catch (error) {
      const errorMessage = 'Error de conexión al cancelar consulta';
      setError(errorMessage);
      console.error('Error al cancelar consulta:', error);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Obtener consulta por ID
  const obtenerConsultaPorId = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/consultas/${id}`);
      const data = await response.json();
      
      if (response.ok) {
        return { success: true, data };
      } else {
        setError(data.error || 'Error al obtener consulta');
        return { success: false, error: data.error };
      }
    } catch (error) {
      const errorMessage = 'Error de conexión al obtener consulta';
      setError(errorMessage);
      console.error('Error al obtener consulta:', error);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Verificar disponibilidad
  const verificarDisponibilidad = async (fecha, hora) => {
    try {
      const response = await fetch(`/api/consultas/disponibilidad?fecha=${fecha}&hora=${hora}`);
      const data = await response.json();
      
      if (response.ok) {
        return { success: true, disponible: data.disponible };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error al verificar disponibilidad:', error);
      return { success: false, error: 'Error de conexión' };
    }
  };

  // Filtrar consultas localmente
  const filtrarConsultas = (filtros = {}) => {
    return consultas.filter(consulta => {
      // Filtro por búsqueda
      if (filtros.busqueda) {
        const busqueda = filtros.busqueda.toLowerCase();
        const cumpleBusqueda = 
          consulta.nombre.toLowerCase().includes(busqueda) ||
          consulta.apellido.toLowerCase().includes(busqueda) ||
          consulta.email.toLowerCase().includes(busqueda) ||
          consulta.telefono.includes(busqueda);
        
        if (!cumpleBusqueda) return false;
      }

      // Filtro por estado
      if (filtros.estado && consulta.estado !== filtros.estado) {
        return false;
      }

      // Filtro por fecha
      if (filtros.fechaDesde) {
        const fechaConsulta = new Date(consulta.fechaConsulta);
        const fechaDesde = new Date(filtros.fechaDesde);
        if (fechaConsulta < fechaDesde) return false;
      }

      if (filtros.fechaHasta) {
        const fechaConsulta = new Date(consulta.fechaConsulta);
        const fechaHasta = new Date(filtros.fechaHasta);
        if (fechaConsulta > fechaHasta) return false;
      }

      return true;
    });
  };

  return {
    consultas,
    estadisticas,
    loading,
    error,
    cargarConsultas,
    cargarEstadisticas,
    crearConsulta,
    actualizarConsulta,
    cancelarConsulta,
    obtenerConsultaPorId,
    verificarDisponibilidad,
    filtrarConsultas,
  };
}; 