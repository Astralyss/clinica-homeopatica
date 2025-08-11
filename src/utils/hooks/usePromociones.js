import { useState, useEffect } from 'react';

export const usePromociones = () => {
  const [productosPromocion, setProductosPromocion] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const obtenerPromociones = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/productos/promociones');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al obtener promociones');
      }
      
      setProductosPromocion(data);
    } catch (err) {
      setError(err.message);
      console.error('Error al obtener promociones:', err);
    } finally {
      setLoading(false);
    }
  };

  const calcularPrecioFinal = (producto) => {
    if (!producto.tienePromocion || !producto.precioPromocion) {
      return producto.precio;
    }
    
    // Verificar si la promoción está vigente
    const ahora = new Date();
    const inicio = producto.fechaInicioPromocion ? new Date(producto.fechaInicioPromocion) : null;
    const fin = producto.fechaFinPromocion ? new Date(producto.fechaFinPromocion) : null;
    
    // Si no hay fechas, la promoción siempre está activa
    if (!inicio && !fin) {
      return producto.precioPromocion;
    }
    
    // Si hay fechas, verificar que esté vigente
    if (inicio && fin) {
      if (ahora >= inicio && ahora <= fin) {
        return producto.precioPromocion;
      }
    } else if (inicio && !fin) {
      if (ahora >= inicio) {
        return producto.precioPromocion;
      }
    }
    
    return producto.precio;
  };

  const calcularDescuento = (producto) => {
    if (!producto.tienePromocion || !producto.precioPromocion) {
      return 0;
    }
    
    const precioOriginal = parseFloat(producto.precio);
    const precioPromocional = parseFloat(producto.precioPromocion);
    const descuento = ((precioOriginal - precioPromocional) / precioOriginal) * 100;
    
    return Math.round(descuento);
  };

  const esPromocionVigente = (producto) => {
    if (!producto.tienePromocion) return false;
    
    const ahora = new Date();
    const inicio = producto.fechaInicioPromocion ? new Date(producto.fechaInicioPromocion) : null;
    const fin = producto.fechaFinPromocion ? new Date(producto.fechaFinPromocion) : null;
    
    // Sin fechas = siempre vigente
    if (!inicio && !fin) return true;
    
    // Con fechas = verificar vigencia
    if (inicio && fin) {
      return ahora >= inicio && ahora <= fin;
    } else if (inicio && !fin) {
      return ahora >= inicio;
    }
    
    return false;
  };

  useEffect(() => {
    obtenerPromociones();
  }, []);

  return {
    productosPromocion,
    loading,
    error,
    obtenerPromociones,
    calcularPrecioFinal,
    calcularDescuento,
    esPromocionVigente,
    refresh: obtenerPromociones
  };
};
