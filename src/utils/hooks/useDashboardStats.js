import { useState, useEffect } from 'react';

const useDashboardStats = () => {
  const [stats, setStats] = useState({
    pedidos: {
      total: 0,
      pendientes: 0,
      enviados: 0,
      entregados: 0,
      cancelados: 0
    },
    productos: {
      total: 0,
      activos: 0,
      stockBajo: 0,
      sinStock: 0
    },
    ventas: {
      total: 0,
      mesActual: 0,
      promedioPedido: 0,
      mesAnterior: 0
    },
    consultas: {
      total: 0,
      pendientes: 0,
      confirmadas: 0,
      completadas: 0
    },
    usuarios: {
      total: 0,
      nuevosMes: 0,
      activos: 0
    },
    financiero: {
      ingresosTotales: 0,
      ingresosMes: 0,
      ingresosMesAnterior: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Obtener todas las estadísticas en una sola llamada
        const response = await fetch('/api/admin/dashboard');
        if (!response.ok) {
          throw new Error('Error al obtener las estadísticas');
        }
        
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};

export default useDashboardStats; 