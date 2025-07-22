"use client";
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Mail, Phone, CheckCircle, XCircle, AlertCircle, Filter, Search, Eye, Edit, Trash2 } from 'lucide-react';

const ConsultasAdminPanel = () => {
  const [consultas, setConsultas] = useState([]);
  const [estadisticas, setEstadisticas] = useState({});
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    estado: '',
    fechaDesde: '',
    fechaHasta: '',
    busqueda: ''
  });
  const [consultaSeleccionada, setConsultaSeleccionada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editando, setEditando] = useState(false);
  const [consultasSeleccionadas, setConsultasSeleccionadas] = useState([]);
  const [seleccionMultiple, setSeleccionMultiple] = useState(false);

  // Estados para el modal de edición
  const [formData, setFormData] = useState({
    estado: '',
    notas: ''
  });

  useEffect(() => {
    cargarConsultas();
    cargarEstadisticas();
  }, [filtros]);

  const cargarConsultas = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filtros.estado) params.append('estado', filtros.estado);
      if (filtros.fechaDesde) params.append('fechaDesde', filtros.fechaDesde);
      if (filtros.fechaHasta) params.append('fechaHasta', filtros.fechaHasta);

      const response = await fetch(`/api/consultas?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setConsultas(data);
      } else {
        console.error('Error al cargar consultas:', data.error);
      }
    } catch (error) {
      console.error('Error al cargar consultas:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarEstadisticas = async () => {
    try {
      const response = await fetch('/api/consultas/estadisticas');
      const data = await response.json();
      
      if (response.ok) {
        setEstadisticas(data);
      } else {
        console.error('Error al cargar estadísticas:', data.error);
      }
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  const actualizarConsulta = async (id, nuevosDatos) => {
    try {
      const response = await fetch(`/api/consultas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevosDatos),
      });

      const data = await response.json();
      
      if (response.ok) {
        cargarConsultas();
        setMostrarModal(false);
        setEditando(false);
        setFormData({ estado: '', notas: '' });
      } else {
        console.error('Error al actualizar consulta:', data.error);
      }
    } catch (error) {
      console.error('Error al actualizar consulta:', error);
    }
  };

  const cancelarConsulta = async (id) => {
    if (!confirm('¿Estás seguro de que quieres cancelar esta consulta?')) {
      return;
    }

    try {
      const response = await fetch(`/api/consultas/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (response.ok) {
        cargarConsultas();
        cargarEstadisticas();
      } else {
        console.error('Error al cancelar consulta:', data.error);
      }
    } catch (error) {
      console.error('Error al cancelar consulta:', error);
    }
  };

  const eliminarConsulta = async (id) => {
    if (!confirm('¿Estás seguro de que quieres ELIMINAR PERMANENTEMENTE esta consulta? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const response = await fetch(`/api/consultas/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eliminar: true }), // Indicador para eliminar permanentemente
      });

      const data = await response.json();
      
      if (response.ok) {
        cargarConsultas();
        cargarEstadisticas();
        alert('Consulta eliminada permanentemente.');
      } else {
        console.error('Error al eliminar consulta:', data.error);
        alert('Error al eliminar la consulta: ' + data.error);
      }
    } catch (error) {
      console.error('Error al eliminar consulta:', error);
      alert('Error al eliminar la consulta.');
    }
  };

  const abrirModal = (consulta) => {
    setConsultaSeleccionada(consulta);
    setFormData({
      estado: consulta.estado,
      notas: consulta.notas || ''
    });
    setMostrarModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (consultaSeleccionada) {
      actualizarConsulta(consultaSeleccionada.id, formData);
    }
  };

  const toggleSeleccionMultiple = () => {
    setSeleccionMultiple(!seleccionMultiple);
    setConsultasSeleccionadas([]);
  };

  const toggleConsultaSeleccionada = (consultaId) => {
    setConsultasSeleccionadas(prev => 
      prev.includes(consultaId) 
        ? prev.filter(id => id !== consultaId)
        : [...prev, consultaId]
    );
  };

  const marcarMultiplesCompletadas = async () => {
    if (consultasSeleccionadas.length === 0) {
      alert('Por favor selecciona al menos una consulta.');
      return;
    }

    if (confirm(`¿Estás seguro de que quieres marcar ${consultasSeleccionadas.length} consulta(s) como completada(s)?`)) {
      try {
        for (const consultaId of consultasSeleccionadas) {
          await actualizarConsulta(consultaId, { estado: 'completada' });
        }
        setConsultasSeleccionadas([]);
        setSeleccionMultiple(false);
        cargarConsultas();
        cargarEstadisticas();
        alert(`${consultasSeleccionadas.length} consulta(s) marcada(s) como completada(s).`);
      } catch (error) {
        console.error('Error al marcar consultas como completadas:', error);
        alert('Error al marcar las consultas como completadas.');
      }
    }
  };

  const eliminarMultiplesConsultas = async () => {
    if (consultasSeleccionadas.length === 0) {
      alert('Por favor selecciona al menos una consulta.');
      return;
    }

    if (confirm(`¿Estás seguro de que quieres ELIMINAR PERMANENTEMENTE ${consultasSeleccionadas.length} consulta(s)? Esta acción no se puede deshacer.`)) {
      try {
        for (const consultaId of consultasSeleccionadas) {
          await eliminarConsulta(consultaId);
        }
        setConsultasSeleccionadas([]);
        setSeleccionMultiple(false);
        cargarConsultas();
        cargarEstadisticas();
        alert(`${consultasSeleccionadas.length} consulta(s) eliminada(s) permanentemente.`);
      } catch (error) {
        console.error('Error al eliminar consultas:', error);
        alert('Error al eliminar las consultas.');
      }
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmada':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completada':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelada':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const consultasFiltradas = consultas.filter(consulta => {
    if (filtros.busqueda) {
      const busqueda = filtros.busqueda.toLowerCase();
      return (
        consulta.nombre.toLowerCase().includes(busqueda) ||
        consulta.apellido.toLowerCase().includes(busqueda) ||
        consulta.email.toLowerCase().includes(busqueda) ||
        consulta.telefono.includes(busqueda)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Gestión de Consultas</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-600">Total</p>
                <p className="text-2xl font-bold text-blue-900">{estadisticas.total || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-yellow-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-yellow-600">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-900">{estadisticas.pendientes || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-600">Completadas</p>
                <p className="text-2xl font-bold text-green-900">{estadisticas.completadas || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-red-600">Canceladas</p>
                <p className="text-2xl font-bold text-red-900">{estadisticas.canceladas || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
          <Filter className="h-5 w-5 text-gray-500" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
            <select
              value={filtros.estado}
              onChange={(e) => setFiltros(prev => ({ ...prev, estado: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="confirmada">Confirmada</option>
              <option value="completada">Completada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha desde</label>
            <input
              type="date"
              value={filtros.fechaDesde}
              onChange={(e) => setFiltros(prev => ({ ...prev, fechaDesde: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha hasta</label>
            <input
              type="date"
              value={filtros.fechaHasta}
              onChange={(e) => setFiltros(prev => ({ ...prev, fechaHasta: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Nombre, email, teléfono..."
                value={filtros.busqueda}
                onChange={(e) => setFiltros(prev => ({ ...prev, busqueda: e.target.value }))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de consultas */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Consultas ({consultasFiltradas.length})
            </h3>
            
            {/* Controles de selección múltiple */}
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleSeleccionMultiple}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  seleccionMultiple 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {seleccionMultiple ? 'Cancelar Selección' : 'Selección Múltiple'}
              </button>
              
              {seleccionMultiple && consultasSeleccionadas.length > 0 && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={marcarMultiplesCompletadas}
                    className="px-3 py-1 text-sm bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors flex items-center space-x-1"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Marcar {consultasSeleccionadas.length} como Completada(s)</span>
                  </button>
                  
                  <button
                    onClick={eliminarMultiplesConsultas}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center space-x-1"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Eliminar {consultasSeleccionadas.length}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando consultas...</p>
          </div>
        ) : consultasFiltradas.length === 0 ? (
          <div className="p-6 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No se encontraron consultas</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {seleccionMultiple && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={consultasSeleccionadas.length === consultasFiltradas.filter(c => c.estado !== 'completada').length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setConsultasSeleccionadas(
                              consultasFiltradas
                                .filter(c => c.estado !== 'completada')
                                .map(c => c.id)
                            );
                          } else {
                            setConsultasSeleccionadas([]);
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paciente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha y Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {consultasFiltradas.map((consulta) => (
                  <tr key={consulta.id} className="hover:bg-gray-50">
                    {seleccionMultiple && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={consultasSeleccionadas.includes(consulta.id)}
                          onChange={() => toggleConsultaSeleccionada(consulta.id)}
                          disabled={consulta.estado === 'completada'}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {consulta.nombre} {consulta.apellido}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {consulta.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center mb-1">
                          <Mail className="h-4 w-4 text-gray-400 mr-2" />
                          {consulta.email}
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 text-gray-400 mr-2" />
                          {consulta.telefono}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center mb-1">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          {formatDate(consulta.fechaConsulta)}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-400 mr-2" />
                          {consulta.horaConsulta}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getEstadoColor(consulta.estado)}`}>
                        {consulta.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => abrirModal(consulta)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="Ver detalles"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditando(true);
                            abrirModal(consulta);
                          }}
                          className="text-green-600 hover:text-green-900 p-1 rounded"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {/* Botón para marcar como completada */}
                        {(consulta.estado === 'pendiente' || consulta.estado === 'confirmada') && (
                          <button
                            onClick={async () => {
                              if (confirm('¿Estás seguro de que quieres marcar esta consulta como completada?')) {
                                await actualizarConsulta(consulta.id, { estado: 'completada' });
                                cargarConsultas();
                                cargarEstadisticas();
                              }
                            }}
                            className="text-emerald-600 hover:text-emerald-900 p-1 rounded hover:bg-emerald-50 transition-colors"
                            title="Marcar como completada"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        {/* Indicador de consulta completada */}
                        {consulta.estado === 'completada' && (
                          <span className="text-emerald-600 p-1 rounded bg-emerald-50" title="Consulta completada">
                            <CheckCircle className="h-4 w-4" />
                          </span>
                        )}
                        <button
                          onClick={() => cancelarConsulta(consulta.id)}
                          className="text-orange-600 hover:text-orange-900 p-1 rounded hover:bg-orange-50 transition-colors"
                          title="Cancelar consulta"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => eliminarConsulta(consulta.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                          title="Eliminar permanentemente"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de detalles/edición */}
      {mostrarModal && consultaSeleccionada && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editando ? 'Editar Consulta' : 'Detalles de Consulta'}
                </h3>
                <button
                  onClick={() => {
                    setMostrarModal(false);
                    setEditando(false);
                    setFormData({ estado: '', notas: '' });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Paciente
                  </label>
                  <p className="text-sm text-gray-900">
                    {consultaSeleccionada.nombre} {consultaSeleccionada.apellido}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <p className="text-sm text-gray-900">{consultaSeleccionada.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <p className="text-sm text-gray-900">{consultaSeleccionada.telefono}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha y Hora
                  </label>
                  <p className="text-sm text-gray-900">
                    {formatDate(consultaSeleccionada.fechaConsulta)} a las {consultaSeleccionada.horaConsulta}
                  </p>
                </div>

                {editando ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estado
                      </label>
                      <select
                        value={formData.estado}
                        onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="confirmada">Confirmada</option>
                        <option value="completada">Completada</option>
                        <option value="cancelada">Cancelada</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notas
                      </label>
                      <textarea
                        value={formData.notas}
                        onChange={(e) => setFormData(prev => ({ ...prev, notas: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Notas adicionales..."
                      />
                    </div>

                    <div className="space-y-3">
                      {/* Botón para marcar como completada si no está completada */}
                      {(formData.estado !== 'completada' && consultaSeleccionada.estado !== 'completada') && (
                        <button
                          type="button"
                          onClick={async () => {
                            if (confirm('¿Estás seguro de que quieres marcar esta consulta como completada?')) {
                              await actualizarConsulta(consultaSeleccionada.id, { estado: 'completada' });
                              setMostrarModal(false);
                              cargarConsultas();
                              cargarEstadisticas();
                            }
                          }}
                          className="w-full bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 flex items-center justify-center space-x-2"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Marcar como Completada</span>
                        </button>
                      )}
                      
                      <div className="flex space-x-3">
                        <button
                          type="submit"
                          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          Guardar
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditando(false);
                            setFormData({ estado: '', notas: '' });
                          }}
                          className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getEstadoColor(consultaSeleccionada.estado)}`}>
                      {consultaSeleccionada.estado}
                    </span>
                    
                    {/* Botones de acción rápida */}
                    <div className="mt-4 space-y-2">
                      {(consultaSeleccionada.estado === 'pendiente' || consultaSeleccionada.estado === 'confirmada') && (
                        <button
                          onClick={async () => {
                            if (confirm('¿Estás seguro de que quieres marcar esta consulta como completada?')) {
                              await actualizarConsulta(consultaSeleccionada.id, { estado: 'completada' });
                              setMostrarModal(false);
                              cargarConsultas();
                              cargarEstadisticas();
                            }
                          }}
                          className="w-full bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 flex items-center justify-center space-x-2"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Marcar como Completada</span>
                        </button>
                      )}
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            if (confirm('¿Estás seguro de que quieres cancelar esta consulta?')) {
                              cancelarConsulta(consultaSeleccionada.id);
                              setMostrarModal(false);
                            }
                          }}
                          className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 flex items-center justify-center space-x-2"
                        >
                          <XCircle className="h-4 w-4" />
                          <span>Cancelar Consulta</span>
                        </button>
                        
                        <button
                          onClick={() => {
                            if (confirm('¿Estás seguro de que quieres ELIMINAR PERMANENTEMENTE esta consulta? Esta acción no se puede deshacer.')) {
                              eliminarConsulta(consultaSeleccionada.id);
                              setMostrarModal(false);
                            }
                          }}
                          className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center justify-center space-x-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Eliminar</span>
                        </button>
                      </div>
                    </div>
                    
                    {consultaSeleccionada.estado === 'completada' && (
                      <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-md">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-5 w-5 text-emerald-600" />
                          <span className="text-emerald-800 font-medium">Consulta Completada</span>
                        </div>
                        <p className="text-emerald-700 text-sm mt-1">
                          Esta consulta ha sido marcada como completada.
                        </p>
                      </div>
                    )}
                    
                    {consultaSeleccionada.notas && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Notas
                        </label>
                        <p className="text-sm text-gray-900">{consultaSeleccionada.notas}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultasAdminPanel;