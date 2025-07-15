import { useState, useEffect } from 'react';

export function useCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/productos/categorias');
        if (!res.ok) throw new Error('No se pudieron cargar las categorías');
        const data = await res.json();
        setCategorias(data);
      } catch (err) {
        setError(err.message || 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };
    fetchCategorias();
  }, []);

  return { categorias, loading, error };
} 