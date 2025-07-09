"use client"
import React, { useState } from 'react';
import { Search, Filter, Eye, Trash2, Mail, Calendar, User, MessageSquare, Check, X, ChevronDown } from 'lucide-react';

const consultasMockInitial = [
  {
    id: 1,
    nombre: 'Juan Pérez',
    email: 'juan@mail.com',
    fecha: '2024-07-04',
    estado: 'Pendiente',
    mensaje: 'Consulta sobre homeopatía para tratamiento de migraña crónica. Me gustaría saber más sobre las opciones disponibles.',
    telefono: '+52 771 123 4567',
    tipo: 'Consulta General'
  },
  {
    id: 2,
    nombre: 'Ana López',
    email: 'ana@mail.com',
    fecha: '2024-07-03',
    estado: 'Atendida',
    mensaje: 'Duda sobre tratamiento homeopático para ansiedad. ¿Cuáles son los remedios más efectivos?',
    telefono: '+52 771 987 6543',
    tipo: 'Seguimiento'
  },
  {
    id: 3,
    nombre: 'Carlos Mendoza',
    email: 'carlos@mail.com',
    fecha: '2024-07-02',
    estado: 'Pendiente',
    mensaje: 'Solicitud de cita para evaluación completa de salud integral.',
    telefono: '+52 771 456 7890',
    tipo: 'Cita'
  },
  {
    id: 4,
    nombre: 'María García',
    email: 'maria@mail.com',
    fecha: '2024-07-01',
    estado: 'Cancelada',
    mensaje: 'Consulta sobre tratamiento para problemas digestivos.',
    telefono: '+52 771 234 5678',
    tipo: 'Consulta General'
  }
];

const ConsultasAdminPanel = () => {
  const [consultas, setConsultas] = useState(consultasMockInitial);
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');
  const [consultaSeleccionada, setConsultaSeleccionada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(null);

  const estados = ['Todos', 'Pendiente', 'Atendida', 'Cancelada'];

  const consultasFiltradas = consultas.filter(consulta => {
    const cumpleFiltro = filtroEstado === 'Todos' || consulta.estado === filtroEstado;
    const cumpleBusqueda = consulta.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                          consulta.email.toLowerCase().includes(busqueda.toLowerCase()) ||
                          consulta.mensaje.toLowerCase().includes(busqueda.toLowerCase());
    return cumpleFiltro && cumpleBusqueda;
  });

  const cambiarEstado = (id, nuevoEstado) => {
    setConsultas(consultas.map(consulta => 
      consulta.id === id ? { ...consulta, estado: nuevoEstado } : consulta
    ));
  };

  const eliminarConsulta = (id) => {
    setConsultas(consultas.filter(consulta => consulta.id !== id));
    setMostrarConfirmacion(null);
  };

  const abrirModal = (consulta) => {
    setConsultaSeleccionada(consulta);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setConsultaSeleccionada(null);
  };

  const getEstadoColor = (estado) => {
    switch(estado) {
      case 'Pendiente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Atendida': return 'bg-green-100 text-green-800 border-green-200';
      case 'Cancelada': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Panel de Administración</h1>
              <p className="text-gray-600">Gestión de reservas y consultas médicas</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, email o mensaje..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-full sm:w-64"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
                >
                  {estados.map(estado => (
                    <option key={estado} value={estado}>{estado}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total', valor: consultas.length, color: 'bg-blue-500', icon: MessageSquare },
            { label: 'Pendientes', valor: consultas.filter(c => c.estado === 'Pendiente').length, color: 'bg-yellow-500', icon: Calendar },
            { label: 'Atendidas', valor: consultas.filter(c => c.estado === 'Atendida').length, color: 'bg-green-500', icon: Check },
            { label: 'Canceladas', valor: consultas.filter(c => c.estado === 'Cancelada').length, color: 'bg-red-500', icon: X }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.valor}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Paciente
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Fecha
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mensaje</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {consultasFiltradas.map(consulta => (
                  <tr key={consulta.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900">{consulta.nombre}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {consulta.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatearFecha(consulta.fecha)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {consulta.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getEstadoColor(consulta.estado)}`}>
                        {consulta.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <div className="text-sm text-gray-900 truncate" title={consulta.mensaje}>
                        {consulta.mensaje}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => abrirModal(consulta)}
                          className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded hover:bg-blue-50"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {consulta.estado === 'Pendiente' && (
                          <button
                            onClick={() => cambiarEstado(consulta.id, 'Atendida')}
                            className="text-green-600 hover:text-green-800 transition-colors p-1 rounded hover:bg-green-50"
                            title="Marcar como atendida"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => setMostrarConfirmacion(consulta.id)}
                          className="text-red-600 hover:text-red-800 transition-colors p-1 rounded hover:bg-red-50"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {consultasFiltradas.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No se encontraron consultas que coincidan con los filtros.</p>
            </div>
          )}
        </div>

        {/* Modal de detalles */}
        {mostrarModal && consultaSeleccionada && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Detalles de la Consulta</h3>
                  <button
                    onClick={cerrarModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                      <p className="text-gray-900">{consultaSeleccionada.nombre}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <p className="text-gray-900">{consultaSeleccionada.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                      <p className="text-gray-900">{consultaSeleccionada.telefono}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                      <p className="text-gray-900">{formatearFecha(consultaSeleccionada.fecha)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                      <p className="text-gray-900">{consultaSeleccionada.tipo}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getEstadoColor(consultaSeleccionada.estado)}`}>
                        {consultaSeleccionada.estado}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
                    <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">{consultaSeleccionada.mensaje}</p>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                  {consultaSeleccionada.estado === 'Pendiente' && (
                    <button
                      onClick={() => {
                        cambiarEstado(consultaSeleccionada.id, 'Atendida');
                        cerrarModal();
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Marcar como Atendida
                    </button>
                  )}
                  <button
                    onClick={cerrarModal}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de confirmación */}
        {mostrarConfirmacion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Confirmar Eliminación</h3>
                <p className="text-gray-500 mb-6">
                  ¿Estás seguro de que quieres eliminar esta consulta? Esta acción no se puede deshacer.
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => eliminarConsulta(mostrarConfirmacion)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Eliminar
                  </button>
                  <button
                    onClick={() => setMostrarConfirmacion(null)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultasAdminPanel;