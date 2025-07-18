"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/utils/hooks/useAuth';
import { Eye, EyeOff, Mail, Lock, Heart, Leaf } from 'lucide-react';

export default function LoginUsuarioPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const { login, user } = useAuth();

  useEffect(() => {
    if (success && user) {
      if (user.rol === 'admin') {
        router.push('/admin');
      } else {
        router.push('/farmacia');
      }
    }
  }, [success, user, router]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const result = await login(form.email, form.password);
      if (result.success) {
        setSuccess('¡Inicio de sesión exitoso!');
      } else {
        setError(result.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('Error de red');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = () => {
    // Aquí puedes agregar la lógica para redirigir al registro
    router.push('/registroUsuario');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-blue-50 to-green-50 p-4">
      {/* Efectos de fondo naturales */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      {/* Container principal */}
      <div className="relative w-full max-w-md">
        {/* Tarjeta principal */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-8 transform hover:scale-[1.02] transition-all duration-300">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Bienvenido de vuelta
            </h1>
            <p className="text-gray-600 text-sm">
              Inicia sesión en tu cuenta
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mensajes de error/éxito */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm backdrop-blur-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm backdrop-blur-sm">
                {success}
              </div>
            )}

            {/* Campo Email */}
            <div className="space-y-2">
              <label className="text-gray-700 font-medium text-sm">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="tu@ejemplo.com"
                  className="w-full pl-10 pr-4 py-3 bg-white/60 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent backdrop-blur-sm transition-all duration-300 hover:bg-white/80"
                />
              </div>
            </div>

            {/* Campo Contraseña */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-gray-700 font-medium text-sm">
                  Contraseña
                </label>
                <button
                  type="button"
                  className="text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors duration-300"
                  onClick={() => {
                    // Aquí puedes agregar la lógica para recuperar contraseña
                    router.push('/recuperar-password');
                  }}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-white/60 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent backdrop-blur-sm transition-all duration-300 hover:bg-white/80"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Botón de envío */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Ingresando...
                </div>
              ) : (
                'Ingresar'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/70 text-gray-500">¿No tienes cuenta?</span>
            </div>
          </div>

          {/* Botón de registro */}
          <button 
            type="button"
            onClick={handleRegisterClick}
            className="w-full bg-white/50 hover:bg-white/70 border border-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg backdrop-blur-sm"
          >
            <Heart className="w-5 h-5 text-emerald-500" />
            Crear cuenta nueva
          </button>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-xs">
              Al iniciar sesión aceptas nuestros{' '}
              <button 
                type="button"
                className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors duration-300"
                onClick={() => {
                  // Aquí puedes agregar la lógica para términos y condiciones
                  router.push('/terminos');
                }}
              >
                términos y condiciones
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}