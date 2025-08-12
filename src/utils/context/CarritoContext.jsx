"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

const CarritoContext = createContext();

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stockErrors, setStockErrors] = useState({});
  const [stockEnTiempoReal, setStockEnTiempoReal] = useState({});

  // Cargar carrito desde localStorage al montar
  useEffect(() => {
    try {
      const carritoGuardado = localStorage.getItem('carrito');
      
      if (carritoGuardado) {
        const carritoParseado = JSON.parse(carritoGuardado);
        const carritoFinal = Array.isArray(carritoParseado) ? carritoParseado : [];
        setCarrito(carritoFinal);
      } else {
        setCarrito([]);
      }
    } catch (error) {
      console.error('Error al cargar carrito desde localStorage:', error);
      setCarrito([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('carrito', JSON.stringify(carrito));
    }
  }, [carrito, loading]);

  // Verificar stock en tiempo real desde la base de datos
  const verificarStockEnTiempoReal = async (productoId) => {
    try {
      const response = await fetch(`/api/productos/${productoId}`);
      if (response.ok) {
        const producto = await response.json();
        const stockActual = producto.cantidad || 0;
        
        setStockEnTiempoReal(prev => ({
          ...prev,
          [productoId]: stockActual
        }));
        
        return stockActual;
      }
    } catch (error) {
      console.error('Error al verificar stock en tiempo real:', error);
    }
    return 0;
  };

  // Verificar stock disponible para un producto
  const verificarStockDisponible = async (producto, cantidadDeseada = 1) => {
    // Verificar stock en tiempo real
    const stockDisponible = await verificarStockEnTiempoReal(producto.id);
    
    const cantidadEnCarrito = obtenerCantidadProducto(producto.id);
    const stockRestante = stockDisponible - cantidadEnCarrito;
    
    return {
      disponible: stockRestante >= cantidadDeseada,
      stockDisponible,
      stockRestante,
      cantidadEnCarrito,
      maximoPermitido: stockDisponible // Cambio: ahora es el stock total, no el restante
    };
  };

  // Verificar si un producto tiene stock suficiente (para habilitar/deshabilitar botones)
  const tieneStockSuficiente = async (productoId) => {
    console.log('Verificando stock suficiente para producto:', productoId);
    const cantidadEnCarrito = obtenerCantidadProducto(productoId);
    console.log('Cantidad en carrito:', cantidadEnCarrito);
    
    // Si no está en el carrito, verificar stock disponible
    if (cantidadEnCarrito === 0) {
      console.log('Producto no está en carrito, verificando stock disponible...');
      const stockActual = await verificarStockEnTiempoReal(productoId);
      console.log('Stock disponible:', stockActual);
      return stockActual > 0;
    }
    
    // Si ya está en el carrito, verificar si puede agregar 1 más
    console.log('Producto ya está en carrito, verificando si puede agregar 1 más...');
    const stockActual = await verificarStockEnTiempoReal(productoId);
    console.log('Stock disponible:', stockActual, 'Cantidad en carrito:', cantidadEnCarrito);
    const puedeAgregar = cantidadEnCarrito < stockActual;
    console.log('Puede agregar más:', puedeAgregar);
    return puedeAgregar; // Solo deshabilitar cuando se alcance el límite exacto
  };

  // Agregar producto al carrito con validación de stock en tiempo real
  const agregarProducto = async (producto, cantidad = 1) => {
    const stockInfo = await verificarStockDisponible(producto, cantidad);
    
    if (!stockInfo.disponible) {
      // Solo mostrar error si realmente se excede el stock disponible
      if (stockInfo.cantidadEnCarrito + cantidad > stockInfo.stockDisponible) {
        setStockErrors(prev => ({
          ...prev,
          [producto.id]: {
            mensaje: `Solo hay ${stockInfo.stockDisponible} unidades disponibles`,
            stockDisponible: stockInfo.stockDisponible,
            maximoPermitido: stockInfo.stockDisponible
          }
        }));
      }
      return false;
    }

    // Limpiar error de stock si existe
    setStockErrors(prev => {
      const { [producto.id]: removed, ...rest } = prev;
      return rest;
    });

    setCarrito(prev => {
      const productoExistente = prev.find(p => p.id === producto.id);
      
      if (productoExistente) {
        // Si ya existe, actualizar cantidad
        return prev.map(p => 
          p.id === producto.id 
            ? { ...p, cantidad: p.cantidad + cantidad }
            : p
        );
      } else {
        // Si no existe, agregar nuevo
        return [...prev, { 
          ...producto, 
          cantidad
        }];
      }
    });
    
    return true;
  };

  // Actualizar cantidad de un producto con validación de stock en tiempo real
  const actualizarCantidad = async (productoId, nuevaCantidad) => {
    if (nuevaCantidad < 1) return false;
    
    const producto = carrito.find(p => p.id === productoId);
    if (!producto) return false;
    
    const stockInfo = await verificarStockDisponible(producto, nuevaCantidad);
    
    if (!stockInfo.disponible) {
      // Solo mostrar error si realmente se excede el stock disponible
      if (nuevaCantidad > stockInfo.stockDisponible) {
        setStockErrors(prev => ({
          ...prev,
          [productoId]: {
            mensaje: `Solo hay ${stockInfo.stockDisponible} unidades disponibles`,
            stockDisponible: stockInfo.stockDisponible,
            maximoPermitido: stockInfo.stockDisponible
          }
        }));
      }
      return false;
    }

    // Limpiar error de stock si existe
    setStockErrors(prev => {
      const { [productoId]: removed, ...rest } = prev;
      return rest;
    });
    
    setCarrito(prev => prev.map(item => 
      item.id === productoId ? { ...item, cantidad: nuevaCantidad } : item
    ));
    
    return true;
  };

  // Incrementar cantidad de un producto (para botón +)
  const incrementarCantidad = async (producto) => {
    const nuevaCantidad = (producto.cantidad || 0) + 1;
    return await actualizarCantidad(producto.id, nuevaCantidad);
  };

  // Decrementar cantidad de un producto (para botón -)
  const decrementarCantidad = async (producto) => {
    console.log('Decrementando cantidad para producto:', producto.id, 'Cantidad actual:', producto.cantidad);
    
    const nuevaCantidad = Math.max(0, (producto.cantidad || 0) - 1);
    console.log('Nueva cantidad calculada:', nuevaCantidad);
    
    // Si la nueva cantidad es 0, eliminar el producto
    if (nuevaCantidad === 0) {
      console.log('Eliminando producto del carrito');
      eliminarProducto(producto.id);
      return true;
    }
    
    // Si la nueva cantidad es mayor a 0, actualizar sin validación de stock
    // porque estamos reduciendo, no agregando
    console.log('Actualizando cantidad a:', nuevaCantidad);
    setCarrito(prev => prev.map(item => 
      item.id === producto.id ? { ...item, cantidad: nuevaCantidad } : item
    ));
    
    // Limpiar error de stock si existe
    setStockErrors(prev => {
      const { [producto.id]: removed, ...rest } = prev;
      return rest;
    });
    
    console.log('Decremento completado exitosamente');
    return true;
  };

  // Eliminar producto del carrito
  const eliminarProducto = (productoId) => {
    setCarrito(prev => prev.filter(item => item.id !== productoId));
    
    // Limpiar error de stock si existe
    setStockErrors(prev => {
      const { [productoId]: removed, ...rest } = prev;
      return rest;
    });

    // Limpiar stock en tiempo real
    setStockEnTiempoReal(prev => {
      const { [productoId]: removed, ...rest } = prev;
      return rest;
    });
  };

  // Limpiar carrito
  const limpiarCarrito = () => {
    setCarrito([]);
    setStockErrors({});
    setStockEnTiempoReal({});
  };

  // Obtener cantidad total de productos
  const obtenerCantidadTotal = () => {
    return carrito.reduce((sum, item) => sum + item.cantidad, 0);
  };

  // Obtener total del carrito
  const obtenerTotal = () => {
    return carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  };

  // Verificar si un producto está en el carrito
  const estaEnCarrito = (productoId) => {
    return carrito.some(item => item.id === productoId);
  };

  // Obtener cantidad de un producto específico
  const obtenerCantidadProducto = (productoId) => {
    const item = carrito.find(item => item.id === productoId);
    return item ? item.cantidad : 0;
  };

  // Obtener información de stock para un producto
  const obtenerInfoStock = (productoId) => {
    return stockErrors[productoId] || null;
  };

  // Verificar si hay errores de stock en el carrito
  const hayErroresStock = () => {
    return Object.keys(stockErrors).length > 0;
  };

  // Obtener productos con stock insuficiente
  const obtenerProductosSinStock = () => {
    return carrito.filter(item => stockErrors[item.id]);
  };

  // Obtener stock actual de un producto
  const obtenerStockActual = (productoId) => {
    return stockEnTiempoReal[productoId] || 0;
  };

  const value = {
    carrito,
    loading,
    stockErrors,
    agregarProducto,
    actualizarCantidad,
    incrementarCantidad,
    decrementarCantidad,
    eliminarProducto,
    limpiarCarrito,
    obtenerCantidadTotal,
    obtenerTotal,
    estaEnCarrito,
    obtenerCantidadProducto,
    obtenerInfoStock,
    hayErroresStock,
    obtenerProductosSinStock,
    verificarStockDisponible,
    tieneStockSuficiente,
    obtenerStockActual,
    setCarrito
  };

  return (
    <CarritoContext.Provider value={value}>
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error('useCarrito debe ser usado dentro de un CarritoProvider');
  }
  return context;
} 