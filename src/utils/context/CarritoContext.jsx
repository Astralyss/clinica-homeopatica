"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

const CarritoContext = createContext();

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Agregar producto al carrito
  const agregarProducto = (producto, cantidad = 1) => {
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
        return [...prev, { ...producto, cantidad }];
      }
    });
  };

  // Actualizar cantidad de un producto
  const actualizarCantidad = (productoId, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    
    setCarrito(prev => prev.map(item => 
      item.id === productoId ? { ...item, cantidad: nuevaCantidad } : item
    ));
  };

  // Eliminar producto del carrito
  const eliminarProducto = (productoId) => {
    setCarrito(prev => prev.filter(item => item.id !== productoId));
  };

  // Limpiar carrito
  const limpiarCarrito = () => {
    setCarrito([]);
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

  const value = {
    carrito,
    loading,
    agregarProducto,
    actualizarCantidad,
    eliminarProducto,
    limpiarCarrito,
    obtenerCantidadTotal,
    obtenerTotal,
    estaEnCarrito,
    obtenerCantidadProducto,
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