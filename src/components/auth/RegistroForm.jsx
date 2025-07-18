import React, { useState } from 'react';

export default function RegistroForm() {
  const [form, setForm] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    email: '',
    password: '',
    telefono: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/auth/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('¡Registro exitoso!');
        setForm({ nombre: '', apellidoPaterno: '', apellidoMaterno: '', email: '', password: '', telefono: '' });
      } else {
        setError(data.error || 'Error al registrar');
      }
    } catch (err) {
      setError('Error de red');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="registro-form">
      <h2>Registro de Usuario</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>{success}</div>}
      <div>
        <label>Nombre*</label>
        <input name="nombre" value={form.nombre} onChange={handleChange} required />
      </div>
      <div>
        <label>Apellido paterno*</label>
        <input name="apellidoPaterno" value={form.apellidoPaterno} onChange={handleChange} required />
      </div>
      <div>
        <label>Apellido materno</label>
        <input name="apellidoMaterno" value={form.apellidoMaterno} onChange={handleChange} />
      </div>
      <div>
        <label>Email*</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} required />
      </div>
      <div>
        <label>Contraseña*</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} required minLength={6} />
      </div>
      <div>
        <label>Teléfono</label>
        <input name="telefono" value={form.telefono} onChange={handleChange} />
      </div>
      <button type="submit" disabled={loading}>{loading ? 'Registrando...' : 'Registrarse'}</button>
    </form>
  );
} 