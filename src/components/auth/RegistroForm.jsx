"use client";
import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Phone, Heart, Leaf, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function RegistroForm() {
  const [form, setForm] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validatePasswords = () => {
    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validar contraseñas antes de enviar
    if (!validatePasswords()) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('¡Registro exitoso!');
        setForm({ nombre: '', apellidoPaterno: '', apellidoMaterno: '', email: '', password: '', confirmPassword: '', telefono: '' });
        setTimeout(() => {
          router.push('/loginUsuario');
        }, 2000);
      } else {
        setError(data.error || 'Error al registrar');
      }
    } catch (err) {
      setError('Error de red');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.push('/loginUsuario');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-green-50 p-4 lg:p-8">
      {/* Efectos de fondo naturales */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80  rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      {/* Container principal responsivo */}
      <div className="relative w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start min-h-screen lg:min-h-0">
          
          {/* Sección izquierda - Información (solo desktop) */}
          <div className="hidden lg:flex flex-col justify-center space-y-8 px-8 xl:px-16">
            <div className="space-y-6">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-700 rounded-3xl flex items-center justify-center shadow-2xl">
                <Heart className="w-10 h-10 text-white" />
              </div>
              
              <div className="space-y-4">
                <h1 className="text-4xl xl:text-5xl font-bold text-gray-800 leading-tight">
                  Bienvenido a nuestro
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-700">
                    Consultorio Homeopático
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Únete a nuestra comunidad de bienestar natural y comienza tu viaje hacia una vida más saludable.
                </p>
              </div>
            </div>

            {/* Características */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Atención Personalizada</h3>
                  <p className="text-gray-600">Tratamientos diseñados especialmente para ti</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Medicina Natural</h3>
                  <p className="text-gray-600">Sanación con remedios naturales y seguros</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Experiencia Comprobada</h3>
                  <p className="text-gray-600">Más de 15 años cuidando tu salud</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sección derecha - Formulario */}
          <div className="flex items-center justify-center w-full">
            <div className="w-full max-w-md lg:max-w-lg">
              {/* Tarjeta del formulario */}
              <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-6 sm:p-8 lg:p-10 transform hover:scale-[1.01] transition-all duration-300">
                
                {/* Botón de regresar */}
                <button
                  onClick={handleBackToLogin}
                  className="absolute top-6 left-6 p-2 text-gray-500 hover:text-gray-700 hover:bg-white/50 rounded-full transition-all duration-300"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                {/* Header móvil */}
                <div className="text-center mb-8 lg:hidden">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                    Únete a nosotros
                  </h1>
                  <p className="text-gray-600 text-sm">
                    Crea tu cuenta en nuestra clínica
                  </p>
                </div>

                {/* Header desktop */}
                <div className="hidden lg:block text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Crear cuenta
                  </h2>
                  <p className="text-gray-600">
                    Completa tus datos para comenzar
                  </p>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="space-y-5 lg:space-y-6">
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

                  {/* Nombre */}
                  <div className="space-y-2">
                    <label className="text-gray-700 font-medium text-sm">
                      Nombre <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        required
                        placeholder="Tu nombre"
                        className="w-full pl-10 pr-4 py-3 lg:py-4 bg-white/60 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent backdrop-blur-sm transition-all duration-300 hover:bg-white/80"
                      />
                    </div>
                  </div>

                  {/* Apellidos */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-gray-700 font-medium text-sm">
                        Apellido paterno <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="apellidoPaterno"
                        value={form.apellidoPaterno}
                        onChange={handleChange}
                        required
                        placeholder="Paterno"
                        className="w-full px-4 py-3 lg:py-4 bg-white/60 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent backdrop-blur-sm transition-all duration-300 hover:bg-white/80"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-gray-700 font-medium text-sm">
                        Apellido materno
                      </label>
                      <input
                        name="apellidoMaterno"
                        value={form.apellidoMaterno}
                        onChange={handleChange}
                        placeholder="Materno"
                        className="w-full px-4 py-3 lg:py-4 bg-white/60 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent backdrop-blur-sm transition-all duration-300 hover:bg-white/80"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-gray-700 font-medium text-sm">
                      Email <span className="text-red-500">*</span>
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
                        className="w-full pl-10 pr-4 py-3 lg:py-4 bg-white/60 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent backdrop-blur-sm transition-all duration-300 hover:bg-white/80"
                      />
                    </div>
                  </div>

                  {/* Contraseña */}
                  <div className="space-y-2">
                    <label className="text-gray-700 font-medium text-sm">
                      Contraseña <span className="text-red-500">*</span>
                    </label>
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
                        minLength={6}
                        placeholder="Mínimo 6 caracteres"
                        className="w-full pl-10 pr-12 py-3 lg:py-4 bg-white/60 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent backdrop-blur-sm transition-all duration-300 hover:bg-white/80"
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

                  {/* Confirmar Contraseña */}
                  <div className="space-y-2">
                    <label className="text-gray-700 font-medium text-sm">
                      Confirmar Contraseña <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                        minLength={6}
                        placeholder="Repite tu contraseña"
                        className="w-full pl-10 pr-12 py-3 lg:py-4 bg-white/60 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent backdrop-blur-sm transition-all duration-300 hover:bg-white/80"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-300"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Teléfono */}
                  <div className="space-y-2">
                    <label className="text-gray-700 font-medium text-sm">
                      Teléfono
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        name="telefono"
                        value={form.telefono}
                        onChange={handleChange}
                        placeholder="10 dígitos"
                        className="w-full pl-10 pr-4 py-3 lg:py-4 bg-white/60 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent backdrop-blur-sm transition-all duration-300 hover:bg-white/80"
                      />
                    </div>
                  </div>

                  {/* Botón de registro */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-600 hover:to-teal-500 text-white font-semibold py-3 lg:py-4 px-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Registrando...
                      </div>
                    ) : (
                      'Crear cuenta'
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="relative my-6 lg:my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white/70 text-gray-500">¿Ya tienes cuenta?</span>
                  </div>
                </div>

                {/* Botón de login */}
                <button 
                  type="button"
                  onClick={handleBackToLogin}
                  className="w-full bg-white/50 hover:bg-white/70 border border-gray-200 text-gray-700 font-medium py-3 lg:py-4 px-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg backdrop-blur-sm"
                >
                  <Leaf className="w-5 h-5 text-emerald-500" />
                  Iniciar sesión
                </button>

                {/* Footer */}
                <div className="mt-6 lg:mt-8 text-center">
                  <p className="text-gray-500 text-xs">
                    Al registrarte aceptas nuestros{' '}
                    <button 
                      type="button"
                      className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors duration-300"
                      onClick={() => {
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
        </div>
      </div>
    </div>
  );
}