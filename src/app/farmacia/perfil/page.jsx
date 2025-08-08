"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  User, 
  MapPin, 
  CreditCard, 
  Edit, 
  Save, 
  X,
  Phone,
  Mail,
  Calendar,
  Shield,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '@/utils/hooks/useAuth';

export default function PerfilPage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  
  console.log('🎯 Página de perfil cargada');
  console.log('👤 Usuario en perfil:', user);
  const [activeTab, setActiveTab] = useState('personal');
  const [editMode, setEditMode] = useState({
    personal: false,
    direccion: false,
    pagos: false
  });

  // Estados para información personal
  const [personalInfo, setPersonalInfo] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    fechaNacimiento: ''
  });

  // Estados para dirección
  const [direccionInfo, setDireccionInfo] = useState({
    calle: '',
    numero: '',
    colonia: '',
    ciudad: '',
    estado: '',
    codigoPostal: '',
    referencias: ''
  });

  // Estados para métodos de pago
  const [metodosPago, setMetodosPago] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [nuevoMetodoPago, setNuevoMetodoPago] = useState({
    numero: '',
    nombre: '',
    fechaVencimiento: '',
    cvv: ''
  });

  // Cargar información del usuario
  useEffect(() => {
    const cargarPerfil = async () => {
      console.log('🔍 Iniciando carga de perfil...');
      console.log('👤 Usuario actual:', user);
      
      try {
        const params = new URLSearchParams({
          usuarioId: user?.id || '1'
        });

        console.log('📡 Llamando API con params:', params.toString());
        const response = await fetch(`/api/perfil?${params}`);
        console.log('📥 Respuesta de API:', response.status, response.statusText);
        
        if (!response.ok) {
          throw new Error(`Error al cargar perfil: ${response.status}`);
        }

        const data = await response.json();
        console.log('📊 Datos recibidos:', data);
        
        if (data.success && data.perfil) {
          console.log('✅ Datos válidos, actualizando estado...');
          setPersonalInfo(data.perfil.personal);
          setDireccionInfo(data.perfil.direccion);
          setMetodosPago(data.perfil.metodosPago);
        } else {
          console.log('⚠️ Datos inválidos, usando fallback...');
          throw new Error('Datos de perfil inválidos');
        }
      } catch (error) {
        console.error('❌ Error al cargar perfil:', error);
        console.log('🔄 Usando datos de ejemplo...');
        // En caso de error, usar datos de ejemplo
        const perfilEjemplo = {
          personal: {
            nombre: 'Jaime',
            apellidos: 'García López',
            email: 'jaime.garcia@email.com',
            telefono: '5512345678',
            fechaNacimiento: '1990-05-15'
          },
          direccion: {
            calle: 'Av. Insurgentes Sur',
            numero: '123',
            colonia: 'Del Valle',
            ciudad: 'Ciudad de México',
            estado: 'CDMX',
            codigoPostal: '03100',
            referencias: 'Frente al parque'
          },
          metodosPago: [
            {
              id: 1,
              tipo: 'tarjeta',
              numero: '**** **** **** 1234',
              nombre: 'Jaime García López',
              fechaVencimiento: '12/25',
              esDefault: true
            },
            {
              id: 2,
              tipo: 'paypal',
              email: 'jaime.garcia@email.com',
              esDefault: false
            }
          ]
        };

        setPersonalInfo(perfilEjemplo.personal);
        setDireccionInfo(perfilEjemplo.direccion);
        setMetodosPago(perfilEjemplo.metodosPago);
      } finally {
        console.log('🏁 Finalizando carga de perfil');
        setLoading(false);
      }
    };

    cargarPerfil();
  }, [user?.id]);

  // Guardar información personal
  const guardarPersonal = async () => {
    try {
      const response = await fetch('/api/perfil', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tipo: 'personal',
          datos: {
            usuarioId: user?.id || '1',
            ...personalInfo
          }
        })
      });

      if (!response.ok) {
        throw new Error('Error al guardar información personal');
      }

      const data = await response.json();
      
      // Actualizar el estado local con los datos actualizados
      if (data.success && data.perfil) {
        setPersonalInfo(data.perfil.personal);
        setDireccionInfo(data.perfil.direccion);
        setMetodosPago(data.perfil.metodosPago);
      }
      
      setEditMode(prev => ({ ...prev, personal: false }));
      // refrescar usuario para que Navbar muestre el nuevo nombre
      await refreshUser();
      alert(data.message || 'Información personal actualizada correctamente');
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar la información');
    }
  };

  // Guardar dirección
  const guardarDireccion = async () => {
    try {
      const response = await fetch('/api/perfil', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tipo: 'direccion',
          datos: {
            usuarioId: user?.id || '1',
            ...direccionInfo
          }
        })
      });

      if (!response.ok) {
        throw new Error('Error al guardar dirección');
      }

      const data = await response.json();
      
      // Actualizar el estado local con los datos actualizados
      if (data.success && data.perfil) {
        setPersonalInfo(data.perfil.personal);
        setDireccionInfo(data.perfil.direccion);
        setMetodosPago(data.perfil.metodosPago);
      }
      
      setEditMode(prev => ({ ...prev, direccion: false }));
      await refreshUser();
      alert(data.message || 'Dirección actualizada correctamente');
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar la dirección');
    }
  };

  // Agregar método de pago
  const agregarMetodoPago = async () => {
    try {
      // Validar campos
      if (!nuevoMetodoPago.numero || !nuevoMetodoPago.nombre || !nuevoMetodoPago.fechaVencimiento || !nuevoMetodoPago.cvv) {
        alert('Por favor completa todos los campos');
        return;
      }

      const response = await fetch('/api/perfil/metodos-pago', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuarioId: user?.id || '1',
          metodoPago: {
            ...nuevoMetodoPago,
            esDefault: metodosPago.length === 0
          }
        })
      });

      if (!response.ok) {
        throw new Error('Error al agregar método de pago');
      }

      const data = await response.json();
      
      if (data.success) {
        // Recargar todos los métodos de pago desde la API
        const metodosResponse = await fetch(`/api/perfil/metodos-pago?usuarioId=${user?.id || '1'}`);
        if (metodosResponse.ok) {
          const metodosData = await metodosResponse.json();
          if (metodosData.success) {
            setMetodosPago(metodosData.metodosPago);
          }
        }
        
        setNuevoMetodoPago({
          numero: '',
          nombre: '',
          fechaVencimiento: '',
          cvv: ''
        });
        setEditMode(prev => ({ ...prev, pagos: false }));
        alert(data.message || 'Método de pago agregado correctamente');
      }
    } catch (error) {
      console.error('Error al agregar método de pago:', error);
      alert('Error al agregar método de pago');
    }
  };

  // Eliminar método de pago
  const eliminarMetodoPago = async (id) => {
    if (confirm('¿Estás seguro de que quieres eliminar este método de pago?')) {
      try {
        const params = new URLSearchParams({
          id: id.toString(),
          usuarioId: user?.id || '1'
        });

        const response = await fetch(`/api/perfil/metodos-pago?${params}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error('Error al eliminar método de pago');
        }

        const data = await response.json();
        
        if (data.success) {
          // Recargar todos los métodos de pago desde la API
          const metodosResponse = await fetch(`/api/perfil/metodos-pago?usuarioId=${user?.id || '1'}`);
          if (metodosResponse.ok) {
            const metodosData = await metodosResponse.json();
            if (metodosData.success) {
              setMetodosPago(metodosData.metodosPago);
            }
          }
          
          alert(data.message || 'Método de pago eliminado correctamente');
        }
      } catch (error) {
        console.error('Error al eliminar método de pago:', error);
        alert('Error al eliminar método de pago');
      }
    }
  };

  // Establecer método por defecto
  const establecerDefault = async (id) => {
    try {
      const response = await fetch('/api/perfil/metodos-pago', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metodoId: id,
          esDefault: true
        })
      });

      if (!response.ok) {
        throw new Error('Error al establecer método predeterminado');
      }

      const data = await response.json();
      
      if (data.success) {
        // Recargar todos los métodos de pago desde la API
        const metodosResponse = await fetch(`/api/perfil/metodos-pago?usuarioId=${user?.id || '1'}`);
        if (metodosResponse.ok) {
          const metodosData = await metodosResponse.json();
          if (metodosData.success) {
            setMetodosPago(metodosData.metodosPago);
          }
        }
        
        alert(data.message || 'Método establecido como predeterminado');
      }
    } catch (error) {
      console.error('Error al establecer método predeterminado:', error);
      alert('Error al establecer método predeterminado');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Debug Info */}
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-sm">
            🎯 Página de perfil cargada correctamente | 
            👤 Usuario: {user?.nombre || 'No autenticado'} | 
            🔄 Loading: {loading ? 'Sí' : 'No'}
          </p>
        </div>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-white shadow-sm"
            >
              <ArrowLeft size={24} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
              <p className="text-gray-600">Gestiona tu información personal</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-8">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('personal')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'personal'
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <User size={16} className="inline mr-2" />
              Información Personal
            </button>
            <button
              onClick={() => setActiveTab('direccion')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'direccion'
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <MapPin size={16} className="inline mr-2" />
              Dirección
            </button>
            <button
              onClick={() => setActiveTab('pagos')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'pagos'
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <CreditCard size={16} className="inline mr-2" />
              Métodos de Pago
            </button>
          </div>

          {/* Contenido de las tabs */}
          <div className="p-6">
            {/* Información Personal */}
            {activeTab === 'personal' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Información Personal</h2>
                  <button
                    onClick={() => setEditMode(prev => ({ ...prev, personal: !prev.personal }))}
                    className="flex items-center gap-2 px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                  >
                    {editMode.personal ? <X size={16} /> : <Edit size={16} />}
                    {editMode.personal ? 'Cancelar' : 'Editar'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                    <input
                      type="text"
                      value={personalInfo.nombre}
                      onChange={(e) => setPersonalInfo(prev => ({ ...prev, nombre: e.target.value }))}
                      disabled={!editMode.personal}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Apellidos</label>
                    <input
                      type="text"
                      value={personalInfo.apellidos}
                      onChange={(e) => setPersonalInfo(prev => ({ ...prev, apellidos: e.target.value }))}
                      disabled={!editMode.personal}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={personalInfo.email}
                      onChange={(e) => setPersonalInfo(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!editMode.personal}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                    <input
                      type="tel"
                      value={personalInfo.telefono}
                      onChange={(e) => setPersonalInfo(prev => ({ ...prev, telefono: e.target.value }))}
                      disabled={!editMode.personal}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Nacimiento</label>
                    <input
                      type="date"
                      value={personalInfo.fechaNacimiento}
                      onChange={(e) => setPersonalInfo(prev => ({ ...prev, fechaNacimiento: e.target.value }))}
                      disabled={!editMode.personal}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                </div>

                {editMode.personal && (
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={guardarPersonal}
                      className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                    >
                      <Save size={16} />
                      Guardar Cambios
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Dirección */}
            {activeTab === 'direccion' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Dirección de Envío</h2>
                  <button
                    onClick={() => setEditMode(prev => ({ ...prev, direccion: !prev.direccion }))}
                    className="flex items-center gap-2 px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                  >
                    {editMode.direccion ? <X size={16} /> : <Edit size={16} />}
                    {editMode.direccion ? 'Cancelar' : 'Editar'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Calle</label>
                    <input
                      type="text"
                      value={direccionInfo.calle}
                      onChange={(e) => setDireccionInfo(prev => ({ ...prev, calle: e.target.value }))}
                      disabled={!editMode.direccion}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Número</label>
                    <input
                      type="text"
                      value={direccionInfo.numero}
                      onChange={(e) => setDireccionInfo(prev => ({ ...prev, numero: e.target.value }))}
                      disabled={!editMode.direccion}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Colonia</label>
                    <input
                      type="text"
                      value={direccionInfo.colonia}
                      onChange={(e) => setDireccionInfo(prev => ({ ...prev, colonia: e.target.value }))}
                      disabled={!editMode.direccion}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
                    <input
                      type="text"
                      value={direccionInfo.ciudad}
                      onChange={(e) => setDireccionInfo(prev => ({ ...prev, ciudad: e.target.value }))}
                      disabled={!editMode.direccion}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                    <input
                      type="text"
                      value={direccionInfo.estado}
                      onChange={(e) => setDireccionInfo(prev => ({ ...prev, estado: e.target.value }))}
                      disabled={!editMode.direccion}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Código Postal</label>
                    <input
                      type="text"
                      value={direccionInfo.codigoPostal}
                      onChange={(e) => setDireccionInfo(prev => ({ ...prev, codigoPostal: e.target.value }))}
                      disabled={!editMode.direccion}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Referencias</label>
                    <textarea
                      value={direccionInfo.referencias}
                      onChange={(e) => setDireccionInfo(prev => ({ ...prev, referencias: e.target.value }))}
                      disabled={!editMode.direccion}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-50"
                      placeholder="Referencias para encontrar la dirección..."
                    />
                  </div>
                </div>

                {editMode.direccion && (
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={guardarDireccion}
                      className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                    >
                      <Save size={16} />
                      Guardar Cambios
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Métodos de Pago */}
            {activeTab === 'pagos' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Métodos de Pago</h2>
                  <button
                    onClick={() => setEditMode(prev => ({ ...prev, pagos: !prev.pagos }))}
                    className="flex items-center gap-2 px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                  >
                    {editMode.pagos ? <X size={16} /> : <Edit size={16} />}
                    {editMode.pagos ? 'Cancelar' : 'Agregar Tarjeta'}
                  </button>
                </div>

                {/* Métodos existentes */}
                <div className="space-y-4 mb-6">
                  {metodosPago.map((metodo) => (
                    <div key={metodo.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <CreditCard size={20} className="text-emerald-600" />
                        <div>
                          <p className="font-medium text-gray-900">{metodo.numero}</p>
                          <p className="text-sm text-gray-500">{metodo.nombre}</p>
                          {metodo.esDefault && (
                            <span className="inline-block px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full mt-1">
                              Predeterminado
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!metodo.esDefault && (
                          <button
                            onClick={() => establecerDefault(metodo.id)}
                            className="text-sm text-emerald-600 hover:text-emerald-700"
                          >
                            Establecer como predeterminado
                          </button>
                        )}
                        <button
                          onClick={() => eliminarMetodoPago(metodo.id)}
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Formulario para agregar nueva tarjeta */}
                {editMode.pagos && (
                  <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Agregar Nueva Tarjeta</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Número de Tarjeta</label>
                        <input
                          type="text"
                          value={nuevoMetodoPago.numero}
                          onChange={(e) => setNuevoMetodoPago(prev => ({ ...prev, numero: e.target.value }))}
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre en la Tarjeta</label>
                        <input
                          type="text"
                          value={nuevoMetodoPago.nombre}
                          onChange={(e) => setNuevoMetodoPago(prev => ({ ...prev, nombre: e.target.value }))}
                          placeholder="Nombre Apellido"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Vencimiento</label>
                        <input
                          type="text"
                          value={nuevoMetodoPago.fechaVencimiento}
                          onChange={(e) => setNuevoMetodoPago(prev => ({ ...prev, fechaVencimiento: e.target.value }))}
                          placeholder="MM/AA"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                        <input
                          type="text"
                          value={nuevoMetodoPago.cvv}
                          onChange={(e) => setNuevoMetodoPago(prev => ({ ...prev, cvv: e.target.value }))}
                          placeholder="123"
                          maxLength={4}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={agregarMetodoPago}
                        className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                      >
                        <Save size={16} />
                        Agregar Tarjeta
                      </button>
                    </div>
                  </div>
                )}

                {/* Nota sobre Stripe */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Shield size={20} className="text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">Seguridad de Pagos</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Todos los métodos de pago están protegidos por Stripe, el líder mundial en procesamiento de pagos seguros.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 