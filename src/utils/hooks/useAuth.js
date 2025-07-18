"use client";
import { useState, useEffect, createContext, useContext } from 'react';

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

  // Verificar si el usuario está autenticado al cargar
  useEffect(() => {
    verificarAutenticacion();
  }, []);

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

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

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
        setUser(data.usuario);
        return { success: true };
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

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      setUser(null);
      setError(null);
    } catch (error) {
      console.error('Error en logout:', error);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    isAuthenticated: !!user,
    isAdmin: user?.rol === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 