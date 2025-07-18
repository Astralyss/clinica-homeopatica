"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/utils/hooks/useAuth';

export default function LoginUsuarioPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('¡Inicio de sesión exitoso!');
        setTimeout(() => {
          if (data.usuario?.rol === 'admin') {
            router.push('/admin');
          } else {
            router.push('/farmacia');
          }
        }, 1200);
      } else {
        setError(data.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('Error de red');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: 24 }}>
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Iniciar sesión</h2>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {success && <div style={{ color: 'green' }}>{success}</div>}
        <div>
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Contraseña</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
        </div>
        <button type="submit" disabled={loading}>{loading ? 'Ingresando...' : 'Ingresar'}</button>
      </form>
    </div>
  );
} 