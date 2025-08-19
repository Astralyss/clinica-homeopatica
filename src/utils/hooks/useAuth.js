"use client";
import { useState, useEffect, createContext, useContext } from 'react';
import { clearBrowserStorage, clearAuthData } from '@/utils/browserStorage';

// Contexto de autenticación
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logoutRequested, setLogoutRequested] = useState(false);

  // Verificar si el usuario está autenticado al cargar
  useEffect(() => {
    if (!logoutRequested) {
      verificarAutenticacion();
    }
  }, [logoutRequested]);

  const verificarAutenticacion = async () => {
    try {
      const response = await fetch('/api/auth/verificar', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.usuario);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Permite a componentes externos refrescar los datos del usuario
  const refreshUser = async () => {
    await verificarAutenticacion();
  };

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      setLogoutRequested(false); // Resetear la bandera de logout

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        await verificarAutenticacion();
        return { success: true, usuario: data.usuario };
      } else {
        setError(data.error);
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error en login:', error);
      setError('Error de conexión');
      return { success: false, error: 'Error de conexión' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);

      const response = await fetch('/api/auth/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.usuario);
        return { success: true };
      } else {
        setError(data.error);
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error en registro:', error);
      setError('Error de conexión');
      return { success: false, error: 'Error de conexión' };
    } finally {
      setLoading(false);
    }
  };

  const forceLogout = () => {
    // Forzar logout sin llamar a la API (útil para casos de error o emergencia)
    console.log('🔄 Forzando logout...');
    clearAuthState();
    
    // Redirigir a la página principal
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  const clearAuthState = () => {
    setUser(null);
    setError(null);
    setLoading(false);
    setLogoutRequested(true);
    
    // Usar las utilidades especializadas para limpiar el almacenamiento
    try {
      clearAuthData(); // Limpiar solo datos de autenticación primero
      clearBrowserStorage(); // Luego limpiar todo el almacenamiento
    } catch (error) {
      console.error('Error limpiando almacenamiento:', error);
    }
  };

  const logout = async () => {
    try {
      // Marcar que se solicitó logout para evitar verificación automática
      setLogoutRequested(true);
      
      // Primero limpiar el estado local
      setUser(null);
      setError(null);
      
      // Luego hacer la petición de logout
      const logoutResponse = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (logoutResponse.ok) {
        // Si el logout fue exitoso, limpiar todo el estado
        clearAuthState();
      } else {
        // Si hubo error en la API, limpiar estado local de todas formas
        clearAuthState();
        console.error('Error en API de logout:', logoutResponse.status);
      }
      
    } catch (error) {
      console.error('Error en logout:', error);
      // Asegurar que el estado se mantenga limpio incluso si hay error
      clearAuthState();
    }
  };

  const clearError = () => {
    setError(null);
  };

  const resetLogoutFlag = () => {
    setLogoutRequested(false);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    forceLogout,
    clearError,
    refreshUser,
    resetLogoutFlag,
    clearAuthState,
    isAuthenticated: !!user,
    isAdmin: user?.rol === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 