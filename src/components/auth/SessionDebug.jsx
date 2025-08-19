"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/utils/hooks/useAuth';

export default function SessionDebug() {
  const { user, isAuthenticated, loading } = useAuth();
  const [cookies, setCookies] = useState({});
  const [localStorageData, setLocalStorageData] = useState({});

  useEffect(() => {
    // Obtener cookies del navegador
    const getCookies = () => {
      const cookieString = document.cookie;
      const cookies = {};
      
      if (cookieString) {
        cookieString.split(';').forEach(cookie => {
          const [name, value] = cookie.trim().split('=');
          cookies[name] = value;
        });
      }
      
      setCookies(cookies);
    };

    // Obtener datos del localStorage
    const getLocalStorageData = () => {
      const data = {};
      try {
        data['user'] = localStorage.getItem('user');
        data['auth-token'] = localStorage.getItem('auth-token');
        data['carrito'] = localStorage.getItem('carrito');
      } catch (error) {
        console.error('Error accediendo localStorage:', error);
      }
      setLocalStorageData(data);
    };

    getCookies();
    getLocalStorageData();

    // Actualizar cada 2 segundos
    const interval = setInterval(() => {
      getCookies();
      getLocalStorageData();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const clearAllData = async () => {
    try {
      // Limpiar cookies
      await fetch('/api/auth/clear-cookies', {
        method: 'POST',
        credentials: 'include',
      });
      
      // Limpiar localStorage
      localStorage.clear();
      sessionStorage.clear();
      
      // Recargar página
      window.location.reload();
    } catch (error) {
      console.error('Error limpiando datos:', error);
    }
  };

  if (process.env.NODE_ENV !== 'development') {
    return null; // Solo mostrar en desarrollo
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-md z-50">
      <h3 className="font-bold text-sm mb-2">🔍 Debug de Sesión</h3>
      
      <div className="space-y-2 text-xs">
        <div>
          <strong>Estado:</strong> {loading ? '🔄 Cargando...' : isAuthenticated ? '✅ Autenticado' : '❌ No autenticado'}
        </div>
        
        {user && (
          <div>
            <strong>Usuario:</strong> {user.nombre} ({user.email})
          </div>
        )}
        
        <div>
          <strong>Cookies:</strong>
          <pre className="text-xs bg-gray-100 p-1 rounded mt-1">
            {JSON.stringify(cookies, null, 2)}
          </pre>
        </div>
        
        <div>
          <strong>localStorage:</strong>
          <pre className="text-xs bg-gray-100 p-1 rounded mt-1">
            {JSON.stringify(localStorageData, null, 2)}
          </pre>
        </div>
        
        <button
          onClick={clearAllData}
          className="w-full bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"
        >
          🗑️ Limpiar Todo
        </button>
      </div>
    </div>
  );
}
