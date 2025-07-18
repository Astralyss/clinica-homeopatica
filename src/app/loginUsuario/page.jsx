"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/utils/hooks/useAuth';

export default function LoginUsuarioPage() {
  const [form, setForm] = useState({ email: '', password: '' });
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50/60 to-white/80 py-12 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 flex flex-col gap-5 border border-emerald-100">
        <h2 className="text-2xl font-bold text-emerald-700 text-center mb-2">Iniciar sesión</h2>
        {error && <div className="bg-red-100 text-red-700 px-3 py-2 rounded text-center text-sm font-medium">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 px-3 py-2 rounded text-center text-sm font-medium">{success}</div>}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-400 focus:outline-none bg-white/80" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Contraseña</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-400 focus:outline-none bg-white/80" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg shadow transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
} 