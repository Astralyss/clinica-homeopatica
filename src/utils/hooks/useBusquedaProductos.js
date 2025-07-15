import { useState, useEffect } from 'react';

export function useBusquedaProductos({ search, categoria }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (categoria && categoria !== 'all') params.append('categoria', categoria);
    fetch(`/api/productos/busqueda?${params.toString()}`)
      .then(res => {
        if (!res.ok) throw new Error('Error al buscar productos');
        return res.json();
      })
      .then(data => setProductos(data))
      .catch(err => setError(err.message || 'Error desconocido'))
      .finally(() => setLoading(false));
  }, [search, categoria]);

  return { productos, loading, error };
} 