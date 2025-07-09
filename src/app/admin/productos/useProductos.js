import { useState, useCallback } from 'react';

export default function useProductos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener productos
  const fetchProductos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/productos');
      const data = await res.json();
      setProductos(data);
    } catch (err) {
      setError('Error al obtener productos');
    } finally {
      setLoading(false);
    }
  }, []);

  // Agregar producto
  const agregarProducto = useCallback(async (producto) => {
    setLoading(true);
    setError(null);
    try {
      // Si no hay imágenes, no enviar el campo imagenes
      const body = { ...producto };
      if (body.imagenes && body.imagenes.length === 0) delete body.imagenes;
      const res = await fetch('/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Error al agregar producto');
      await fetchProductos();
      return true;
    } catch (err) {
      setError('Error al agregar producto');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchProductos]);

  // Editar producto
  const editarProducto = useCallback(async (id, producto) => {
    setLoading(true);
    setError(null);
    try {
      const body = { ...producto };
      if (body.imagenes && body.imagenes.length === 0) delete body.imagenes;
      const res = await fetch(`/api/productos?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Error al editar producto');
      await fetchProductos();
      return true;
    } catch (err) {
      setError('Error al editar producto');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchProductos]);

  // Eliminar producto
  const eliminarProducto = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/productos?id=${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Error al eliminar producto');
      await fetchProductos();
      return true;
    } catch (err) {
      setError('Error al eliminar producto');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchProductos]);

  return {
    productos,
    loading,
    error,
    fetchProductos,
    agregarProducto,
    editarProducto,
    eliminarProducto,
    setProductos,
  };
} 