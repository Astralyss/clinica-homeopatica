import { useState, useEffect } from 'react';

export const useHorariosDisponibles = () => {
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const obtenerHorariosDisponibles = async (fecha) => {
    if (!fecha) {
      setHorariosDisponibles([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/consultas/disponibilidad?fecha=${fecha}`);
      const data = await response.json();

      if (response.ok) {
        setHorariosDisponibles(data.disponibles || []);
      } else {
        setError(data.error || 'Error al obtener horarios disponibles');
        setHorariosDisponibles([]);
      }
    } catch (error) {
      console.error('Error al obtener horarios disponibles:', error);
      setError('Error de conexión');
      setHorariosDisponibles([]);
    } finally {
      setLoading(false);
    }
  };

  const verificarDisponibilidad = async (fecha, hora) => {
    try {
      const response = await fetch(`/api/consultas/disponibilidad?fecha=${fecha}&hora=${hora}`);
      const data = await response.json();

      if (response.ok) {
        return { disponible: true };
      } else {
        return { disponible: false, motivo: data.error };
      }
    } catch (error) {
      console.error('Error al verificar disponibilidad:', error);
      return { disponible: false, motivo: 'Error de conexión' };
    }
  };

  return {
    horariosDisponibles,
    loading,
    error,
    obtenerHorariosDisponibles,
    verificarDisponibilidad
  };
}; 