import { useState, useCallback, useEffect } from 'react';

export function useStockEnTiempoReal() {
  const [stockCache, setStockCache] = useState({});
  const [loadingStates, setLoadingStates] = useState({});

  // Verificar stock de un producto específico
  const verificarStock = useCallback(async (productoId) => {
    // Si ya tenemos el stock en cache y no es muy viejo, usarlo
    const cachedStock = stockCache[productoId];
    if (cachedStock && Date.now() - cachedStock.timestamp < 30000) { // 30 segundos
      return cachedStock.stock;
    }

    setLoadingStates(prev => ({ ...prev, [productoId]: true }));

    try {
      const response = await fetch(`/api/productos/${productoId}`);
      if (response.ok) {
        const producto = await response.json();
        const stockActual = producto.cantidad || 0;
        
        // Actualizar cache
        setStockCache(prev => ({
          ...prev,
          [productoId]: {
            stock: stockActual,
            timestamp: Date.now()
          }
        }));

        return stockActual;
      }
    } catch (error) {
      console.error('Error al verificar stock en tiempo real:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [productoId]: false }));
    }

    return 0;
  }, [stockCache]);

  // Verificar stock de múltiples productos
  const verificarStockMultiple = useCallback(async (productoIds) => {
    const stocks = {};
    
    await Promise.all(
      productoIds.map(async (id) => {
        stocks[id] = await verificarStock(id);
      })
    );

    return stocks;
  }, [verificarStock]);

  // Limpiar cache de un producto específico
  const limpiarCache = useCallback((productoId) => {
    setStockCache(prev => {
      const { [productoId]: removed, ...rest } = prev;
      return rest;
    });
  }, []);

  // Limpiar todo el cache
  const limpiarCacheCompleto = useCallback(() => {
    setStockCache({});
  }, []);

  // Verificar si un producto puede agregar más unidades
  const puedeAgregarMas = useCallback(async (productoId, cantidadActual) => {
    const stockDisponible = await verificarStock(productoId);
    return cantidadActual < stockDisponible;
  }, [verificarStock]);

  // Obtener stock actual de un producto (desde cache si está disponible)
  const obtenerStockActual = useCallback((productoId) => {
    const cachedStock = stockCache[productoId];
    return cachedStock ? cachedStock.stock : null;
  }, [stockCache]);

  // Verificar si está cargando el stock de un producto
  const estaCargando = useCallback((productoId) => {
    return loadingStates[productoId] || false;
  }, [loadingStates]);

  return {
    verificarStock,
    verificarStockMultiple,
    puedeAgregarMas,
    obtenerStockActual,
    estaCargando,
    limpiarCache,
    limpiarCacheCompleto,
    stockCache
  };
}
