import { useState, useEffect, useCallback } from 'react';

export const useProductos = () => {
  const [productos, setProductos] = useState([]);
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    activos: 0,
    inactivos: 0,
    sinStock: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar todos los productos
  const cargarProductos = useCallback(async (filtros = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (filtros.search) params.append('search', filtros.search);
      if (filtros.categoria) params.append('categoria', filtros.categoria);
      
      const url = `/api/productos${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Error al cargar productos');
      }
      
      const data = await response.json();
      setProductos(data);
    } catch (err) {
      setError(err.message);
      console.error('Error cargando productos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar estadísticas
  const cargarEstadisticas = useCallback(async () => {
    try {
      const response = await fetch('/api/productos/estadisticas');
      
      if (!response.ok) {
        throw new Error('Error al cargar estadísticas');
      }
      
      const data = await response.json();
      setEstadisticas(data);
    } catch (err) {
      console.error('Error cargando estadísticas:', err);
    }
  }, []);

  // Crear producto
  const crearProducto = useCallback(async (productoData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/productos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productoData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear producto');
      }
      
      const nuevoProducto = await response.json();
      setProductos(prev => [nuevoProducto, ...prev]);
      await cargarEstadisticas();
      
      return { success: true, data: nuevoProducto };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [cargarEstadisticas]);

  // Actualizar producto
  const actualizarProducto = useCallback(async (id, productoData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/productos?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productoData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar producto');
      }
      
      const productoActualizado = await response.json();
      setProductos(prev => 
        prev.map(p => p.id === id ? productoActualizado : p)
      );
      
      return { success: true, data: productoActualizado };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Eliminar producto
  const eliminarProducto = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/productos?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar producto');
      }
      
      setProductos(prev => prev.filter(p => p.id !== id));
      await cargarEstadisticas();
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [cargarEstadisticas]);

  // Buscar productos
  const buscarProductos = useCallback(async (termino, categoria = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (termino) params.append('search', termino);
      if (categoria && categoria !== 'all') params.append('categoria', categoria);
      
      const url = `/api/productos${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Error al buscar productos');
      }
      
      const data = await response.json();
      setProductos(data);
    } catch (err) {
      setError(err.message);
      console.error('Error buscando productos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    cargarProductos();
    cargarEstadisticas();
  }, [cargarProductos, cargarEstadisticas]);

  return {
    productos,
    estadisticas,
    loading,
    error,
    cargarProductos,
    cargarEstadisticas,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    buscarProductos,
  };
}; 