import { useState, useCallback } from 'react';

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random();
    const notification = {
      id,
      message,
      type,
      timestamp: Date.now()
    };

    setNotifications(prev => [...prev, notification]);

    // Auto-remove notification after duration
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const addStockError = useCallback((producto, stockDisponible, cantidadDeseada) => {
    const message = `No se pueden agregar ${cantidadDeseada} unidades de "${producto.nombre}". Solo hay ${stockDisponible} disponibles.`;
    return addNotification(message, 'error', 8000);
  }, [addNotification]);

  const addStockWarning = useCallback((producto, stockRestante) => {
    const message = `Stock limitado: Solo quedan ${stockRestante} unidades de "${producto.nombre}".`;
    return addNotification(message, 'warning', 6000);
  }, [addNotification]);

  const addSuccess = useCallback((message) => {
    return addNotification(message, 'success', 4000);
  }, [addNotification]);

  const addInfo = useCallback((message) => {
    return addNotification(message, 'info', 5000);
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    addStockError,
    addStockWarning,
    addSuccess,
    addInfo
  };
}
