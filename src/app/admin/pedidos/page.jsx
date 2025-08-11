"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PackageSearch, Search, Truck, CheckCircle2, Clock, Pencil, Save, X, Package, MapPin, Filter, Package2, Menu, Trash2 } from 'lucide-react';

function formatCurrency(value) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value || 0);
}

function EstadoBadge({ estado }) {
  const map = {
    pendiente: { text: 'Pendiente', cls: 'bg-yellow-50 text-yellow-700 border border-yellow-200' },
    confirmado: { text: 'Confirmado', cls: 'bg-blue-50 text-blue-700 border border-blue-200' },
    en_proceso: { text: 'En proceso', cls: 'bg-orange-50 text-orange-700 border border-orange-200' },
    enviado: { text: 'Enviado', cls: 'bg-purple-50 text-purple-700 border border-purple-200' },
    entregado: { text: 'Entregado', cls: 'bg-green-50 text-green-700 border border-green-200' },
    cancelado: { text: 'Cancelado', cls: 'bg-red-50 text-red-700 border border-red-200' },
  };
  const info = map[estado] || map.pendiente;
  return <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${info.cls}`}>{info.text}</span>;
}

export default function PedidosAdminPage() {
  const router = useRouter();
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('todos');
  const [editValues, setEditValues] = useState({ numeroGuia: '', empresaEnvio: '', estadoEnvio: '', motivoCancelacion: '' });
  const [detalle, setDetalle] = useState(null);
  const [borrando, setBorrando] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [ordenParaEditar, setOrdenParaEditar] = useState(null);

  const cargarOrdenes = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      if (estadoFiltro && estadoFiltro !== 'todos') params.set('estado', estadoFiltro);
      const resp = await fetch(`/api/admin/ordenes?${params.toString()}`);
      const data = await resp.json();
      if (data?.ordenes) setOrdenes(data.ordenes);
    } catch (e) {
      console.error('Error cargando órdenes admin:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarOrdenes();
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    cargarOrdenes();
    setShowMobileFilters(false);
  };

  const startEdit = (orden) => {
    // Mapear el estado del backend al frontend para mostrar correctamente en el select
    let estadoEnvioFrontend = 'confirmado';
    if (orden.envio?.estado === 'enviado') {
      estadoEnvioFrontend = 'enviado';
    } else if (orden.envio?.estado === 'entregado') {
      estadoEnvioFrontend = 'entregado';
    } else if (orden.envio?.estado === 'pendiente') {
      estadoEnvioFrontend = 'confirmado';
    } else if (orden.estado === 'cancelado') {
      estadoEnvioFrontend = 'cancelado';
    }

    console.log('Estado del envío en backend:', orden.envio?.estado);
    console.log('Estado del envío mapeado al frontend:', estadoEnvioFrontend);

    setOrdenParaEditar(orden);
    setEditValues({
      numeroGuia: orden.envio?.numeroGuia || '',
      empresaEnvio: orden.envio?.empresaEnvio || '',
      estadoEnvio: estadoEnvioFrontend,
      motivoCancelacion: orden.motivoCancelacion || '',
    });
    setShowEditModal(true);
  };

  const saveEdit = async (orden) => {
    try {
      // Mapear los valores del frontend a los valores del backend
      let estadoEnvioBackend = editValues.estadoEnvio;
      let estadoCompra = undefined;
      
      if (editValues.estadoEnvio === 'enviado') {
        estadoEnvioBackend = 'enviado';
        estadoCompra = 'enviado';
      } else if (editValues.estadoEnvio === 'entregado') {
        estadoEnvioBackend = 'entregado';
        estadoCompra = 'entregado';
      } else if (editValues.estadoEnvio === 'confirmado') {
        estadoEnvioBackend = 'pendiente';
        estadoCompra = 'confirmado';
      } else if (editValues.estadoEnvio === 'cancelado') {
        estadoEnvioBackend = 'pendiente'; // El envío se mantiene en pendiente
        estadoCompra = 'cancelado';
      }

      console.log('Valor seleccionado en frontend:', editValues.estadoEnvio);
      console.log('Estado del envío mapeado al backend:', estadoEnvioBackend);
      console.log('Estado de la compra:', estadoCompra);

      const resp = await fetch('/api/admin/ordenes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          compraId: orden.id,
          numeroGuia: editValues.numeroGuia,
          empresaEnvio: editValues.empresaEnvio,
          estadoEnvio: estadoEnvioBackend,
          estadoCompra: estadoCompra,
          motivoCancelacion: editValues.estadoEnvio === 'cancelado' ? editValues.motivoCancelacion : undefined,
        }),
      });
      if (!resp.ok) throw new Error('Error actualizando orden');
      await cargarOrdenes();
      setShowEditModal(false);
      setOrdenParaEditar(null);
      setEditValues({
        numeroGuia: '',
        empresaEnvio: '',
        estadoEnvio: '',
        motivoCancelacion: ''
      });
    } catch (e) {
      console.error(e);
      alert('No se pudo actualizar la orden');
    }
  };

  const abrirDetalle = (orden) => setDetalle(orden);
  const cerrarDetalle = () => setDetalle(null);

  const borrarPedido = async (orden) => {
    if (!confirm(`¿Estás seguro de que quieres borrar el pedido ${orden.numeroOrden}? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      setBorrando(true);
      const resp = await fetch(`/api/admin/ordenes/${orden.id}`, {
        method: 'DELETE',
      });

      if (!resp.ok) {
        const errorData = await resp.json();
        throw new Error(errorData.error || 'Error al borrar el pedido');
      }

      alert('Pedido borrado exitosamente');
      await cargarOrdenes(); // Recargar la lista
    } catch (e) {
      console.error('Error borrando pedido:', e);
      alert(`Error al borrar el pedido: ${e.message}`);
    } finally {
      setBorrando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-3 sm:p-6">
      {/* Header mejorado con diseño moderno y responsivo */}
      <div className="mb-6 sm:mb-8">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-2 sm:p-3 rounded-lg sm:rounded-xl">
                <Package2 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Órdenes</h1>
                <p className="text-slate-600 mt-1 text-sm sm:text-base">Gestión y seguimiento de pedidos del sistema</p>
              </div>
            </div>
            <div className="text-center sm:text-right">
              <div className="text-2xl sm:text-3xl font-bold text-emerald-600">{ordenes.length}</div>
              <div className="text-sm text-slate-500">Total de órdenes</div>
            </div>
          </div>

          {/* Barra de búsqueda y filtros mejorada y responsiva */}
          <div className="space-y-4">
            {/* Búsqueda principal */}
            {/* <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por orden, cliente..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
              />
            </div> */}
            
            {/* Filtros responsivos */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <select
                  value={estadoFiltro}
                  onChange={(e) => setEstadoFiltro(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-white text-sm sm:text-base"
                >
                  <option value="todos">Todos los estados</option>
                  {/* <option value="pendiente">Pendiente</option> */}
                  <option value="confirmado">Confirmado</option>
                  {/* <option value="en_proceso">En proceso</option> */}
                  <option value="enviado">Enviado</option>
                  <option value="entregado">Entregado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
              
              <button
                onClick={onSearch}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                <Filter className="w-5 h-5" />
                <span className="hidden sm:inline">Filtrar</span>
                <span className="sm:hidden">Buscar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla mejorada con diseño moderno y responsivo */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        {/* Vista móvil - Cards */}
        <div className="block lg:hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                <p className="text-slate-500">Cargando órdenes...</p>
              </div>
            </div>
          ) : ordenes.length === 0 ? (
            <div className="p-8 text-center">
              <div className="flex flex-col items-center gap-3">
                <Package2 className="w-12 h-12 text-slate-300" />
                <p className="text-slate-500">No hay órdenes disponibles</p>
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {ordenes.map((o) => (
                <div key={o.id} className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-4">
                  {/* Header de la orden */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 text-lg">#{o.numeroOrden}</div>
                      <div className="text-sm text-slate-500">
                        {new Date(o.fechaCompra).toLocaleDateString('es-MX')} - {new Date(o.fechaCompra).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <EstadoBadge estado={o.estado} />
                  </div>

                  {/* Información del cliente */}
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <div className="text-slate-900 font-medium">
                      {o.cliente.nombre} {o.cliente.apellidoPaterno}
                    </div>
                    <div className="text-sm text-slate-500">{o.cliente.email}</div>
                  </div>

                  {/* Productos y total */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
                      <div className="text-2xl font-bold text-slate-700">{o.productosCantidad}</div>
                      <div className="text-xs text-slate-500">Productos</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
                      <div className="text-2xl font-bold text-emerald-600">{formatCurrency(o.total)}</div>
                      <div className="text-xs text-slate-500">Total</div>
                    </div>
                  </div>

                                                        {/* Información de envío */}
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <div className="text-sm font-medium text-slate-700 mb-2">Información de envío:</div>
                      <div className="space-y-1 text-sm">
                        {o.envio?.numeroGuia && (
                          <div className="text-slate-700">
                            <span className="font-medium">Guía:</span> {o.envio.numeroGuia}
                          </div>
                        )}
                        {o.envio?.empresaEnvio && (
                          <div className="text-slate-700">
                            <span className="font-medium">Empresa:</span> {o.envio.empresaEnvio}
                          </div>
                        )}
                        {o.envio?.estadoEnvio && (
                          <div className="text-slate-700">
                            <span className="font-medium">Estado:</span> {o.envio.estadoEnvio}
                          </div>
                        )}
                        {!o.envio?.numeroGuia && !o.envio?.empresaEnvio && !o.envio?.estadoEnvio && (
                          <div className="text-slate-500">-</div>
                        )}
                      </div>
                    </div>

                                     {/* Acciones */}
                   <div className="flex flex-wrap gap-2">
                     <button
                       onClick={() => abrirDetalle(o)}
                       className="flex-1 inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 font-medium text-sm shadow-sm"
                     >
                       <Package size={16} />
                       Ver detalles
                     </button>
                     <button
                       onClick={() => startEdit(o)}
                       className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium text-sm shadow-sm"
                     >
                       <Pencil size={16} />
                       Editar estado
                     </button>
                     {o.estado === 'entregado' && (
                       <button
                         onClick={() => borrarPedido(o)}
                         disabled={borrando}
                         className="flex-1 inline-flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-600 px-3 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm shadow-sm"
                         title="Borrar pedido entregado"
                       >
                         {borrando ? (
                           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                         ) : (
                           <Trash2 size={16} />
                         )}
                       </button>
                     )}
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Vista desktop - Tabla */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Orden</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Productos</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Guía</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                      <p className="text-slate-500">Cargando órdenes...</p>
                    </div>
                  </td>
                </tr>
              ) : ordenes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Package2 className="w-12 h-12 text-slate-300" />
                      <p className="text-slate-500">No hay órdenes disponibles</p>
                    </div>
                  </td>
                </tr>
              ) : (
                ordenes.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{o.numeroOrden}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-700">
                        {new Date(o.fechaCompra).toLocaleDateString('es-MX')}
                      </div>
                      <div className="text-xs text-slate-500">
                        {new Date(o.fechaCompra).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-900 font-medium">
                        {o.cliente.nombre} {o.cliente.apellidoPaterno}
                      </div>
                      <div className="text-sm text-slate-500">{o.cliente.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-center">
                        <div className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full text-sm font-medium inline-block">
                          {o.productosCantidad}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-lg text-slate-900">{formatCurrency(o.total)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <EstadoBadge estado={o.estado} />
                    </td>
                                         <td className="px-6 py-4">
                       <div className="space-y-1">
                         {o.envio?.numeroGuia && (
                           <div className="text-slate-700 text-sm">
                             <span className="font-medium">Guía:</span> {o.envio.numeroGuia}
                           </div>
                         )}
                         {o.envio?.empresaEnvio && (
                           <div className="text-slate-700 text-sm">
                             <span className="font-medium">Empresa:</span> {o.envio.empresaEnvio}
                           </div>
                         )}
                         {o.envio?.estadoEnvio && (
                           <div className="text-slate-700 text-sm">
                             <span className="font-medium">Estado:</span> {o.envio.estadoEnvio}
                           </div>
                         )}
                         {!o.envio?.numeroGuia && !o.envio?.empresaEnvio && !o.envio?.estadoEnvio && (
                           <div className="text-slate-500 text-sm">-</div>
                         )}
                       </div>
                     </td>
                                         <td className="px-6 py-4">
                       <div className="flex flex-wrap gap-2">
                         <button
                           onClick={() => abrirDetalle(o)}
                           className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 font-medium shadow-sm"
                         >
                           <Package size={16} />
                           Ver detalles
                         </button>
                         <button
                           onClick={() => startEdit(o)}
                           className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-sm"
                         >
                           <Pencil size={16} />
                           Editar estado
                         </button>
                         {o.estado === 'entregado' && (
                           <button
                             onClick={() => borrarPedido(o)}
                             disabled={borrando}
                             className="inline-flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-600 px-3 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
                             title="Borrar pedido entregado"
                           >
                             {borrando ? (
                               <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                             ) : (
                               <Trash2 size={16} />
                             )}
                           </button>
                         )}
                       </div>
                     </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detalle - Responsivo */}
      {detalle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={cerrarDetalle}></div>
          <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] z-10 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-4 sm:px-6 py-4 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-100 p-2 rounded-lg">
                    <Package className="text-emerald-600" size={20}/>
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-800">Orden #{detalle.numeroOrden}</h2>
                    <p className="text-slate-600 text-xs sm:text-sm">Detalles completos del pedido</p>
                  </div>
                </div>
                <button 
                  onClick={cerrarDetalle} 
                  className="p-2 hover:bg-slate-200 rounded-lg transition-colors duration-200"
                >
                  <X size={20} className="text-slate-600" />
                </button>
              </div>
            </div>
            
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-slate-50 p-4 sm:p-6 rounded-xl border border-slate-200">
                  <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2 text-base sm:text-lg">
                    <Package className="text-emerald-600" size={20}/> 
                    Productos ({detalle.productosCantidad})
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    {detalle.productos.map((p) => (
                      <div key={p.id} className="flex items-center gap-3 sm:gap-4 p-3 bg-white rounded-lg border border-slate-200">
                        <img src={p.imagen} alt={p.nombre} className="w-12 h-12 sm:w-16 sm:h-16 object-contain bg-white border border-slate-200 rounded-lg" />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-800 text-sm sm:text-lg truncate">{p.nombre}</div>
                          <div className="text-slate-600 text-sm">Cantidad: {p.cantidad}</div>
                          <div className="text-slate-500 text-xs sm:text-sm">Precio unitario: {formatCurrency(p.precio)}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-base sm:text-lg text-emerald-600">{formatCurrency(p.precio * p.cantidad)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-slate-50 p-4 sm:p-6 rounded-xl border border-slate-200">
                  <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2 text-base sm:text-lg">
                    <MapPin className="text-emerald-600" size={20}/> 
                    Dirección de envío
                  </h3>
                  <div className="bg-white p-3 sm:p-4 rounded-lg border border-slate-200">
                    <div className="space-y-2 text-slate-700 text-sm sm:text-base">
                      <div className="font-semibold text-slate-800 text-base sm:text-lg">
                        {detalle.direccion?.nombre || `${detalle.cliente?.nombre} ${detalle.cliente?.apellidoPaterno}`}
                      </div>
                      <div className="text-slate-600">
                        {detalle.direccion?.calle} {detalle.direccion?.numeroExterior}
                      </div>
                      <div className="text-slate-600">
                        {detalle.direccion?.colonia}, {detalle.direccion?.ciudad}
                      </div>
                      <div className="text-slate-600">
                        {detalle.direccion?.estado} {detalle.direccion?.codigoPostal}
                      </div>
                      {detalle.direccion?.referencias && (
                        <div className="text-slate-500 text-xs sm:text-sm mt-2">
                          <span className="font-medium">Referencias:</span> {detalle.direccion.referencias}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Información de cancelación si está cancelado */}
              {detalle.estado === 'cancelado' && detalle.motivoCancelacion && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6">
                  <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2 text-base sm:text-lg">
                    <AlertCircle className="text-red-600" size={20}/> 
                    Pedido Cancelado
                  </h3>
                  <div className="text-red-700 space-y-2 text-sm sm:text-base">
                    <div><span className="font-medium">Motivo:</span> {detalle.motivoCancelacion}</div>
                    <div><span className="font-medium">Cancelado por:</span> {detalle.canceladoPor === 'admin' ? 'Administrador' : detalle.canceladoPor === 'sistema' ? 'Sistema' : 'Cliente'}</div>
                    {detalle.fechaCancelacion && (
                      <div><span className="font-medium">Fecha de cancelación:</span> {new Date(detalle.fechaCancelacion).toLocaleString('es-MX')}</div>
                    )}
                  </div>
                </div>
              )}

              {/* Resumen financiero */}
              <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-4 sm:p-6 rounded-xl border border-emerald-200">
                <h3 className="font-semibold text-emerald-800 mb-4 text-base sm:text-lg">Resumen Financiero</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-emerald-200">
                    <div className="text-emerald-700 text-sm sm:text-base">Productos ({detalle.productosCantidad})</div>
                    <div className="text-emerald-700 font-medium text-sm sm:text-base">{formatCurrency(detalle.subtotal)}</div>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-emerald-200">
                    <div className="text-emerald-700 flex items-center gap-2 text-sm sm:text-base">
                      <Truck size={16} className="text-emerald-600"/> 
                      Envío
                    </div>
                    <div className={`font-medium text-sm sm:text-base ${detalle.costoEnvio === 0 ? 'text-emerald-600' : 'text-emerald-700'}`}>
                      {detalle.costoEnvio === 0 ? 'Gratis' : formatCurrency(detalle.costoEnvio)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="text-emerald-800 font-bold text-base sm:text-lg">Total</div>
                    <div className="text-2xl sm:text-3xl font-bold text-emerald-800">{formatCurrency(detalle.total)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edición - Responsivo */}
      {showEditModal && ordenParaEditar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowEditModal(false)}></div>
          <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-lg z-10 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-4 sm:px-6 py-4 border-b border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Pencil className="text-blue-600" size={20}/>
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-blue-800">Editar Estado del Pedido</h2>
                    <p className="text-blue-600 text-xs sm:text-sm">Pedido #{ordenParaEditar.numeroOrden}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowEditModal(false)} 
                  className="p-2 hover:bg-blue-200 rounded-lg transition-colors duration-200"
                >
                  <X size={20} className="text-blue-600" />
                </button>
              </div>
            </div>
            
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Número de guía
                  </label>
                  <input
                    type="text"
                    value={editValues.numeroGuia}
                    onChange={(e) => setEditValues({...editValues, numeroGuia: e.target.value})}
                    placeholder="Ej: 123456789"
                    className="w-full border border-slate-300 rounded-xl px-3 sm:px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Empresa de envío
                  </label>
                  <input
                    type="text"
                    value={editValues.empresaEnvio}
                    onChange={(e) => setEditValues({...editValues, empresaEnvio: e.target.value})}
                    placeholder="Ej: DHL, FedEx, Estafeta"
                    className="w-full border border-slate-300 rounded-xl px-3 sm:px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
                
                                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Estado del pedido
                    </label>
                    <select
                      value={editValues.estadoEnvio}
                      onChange={(e) => setEditValues({...editValues, estadoEnvio: e.target.value})}
                      className="w-full border border-slate-300 rounded-xl px-3 sm:px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                    >
                      <option value="">Seleccionar estado</option>
                      <option value="confirmado">Confirmado</option>
                      <option value="enviado">Enviado</option>
                      <option value="entregado">Entregado</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </div>

                  {/* Campo de motivo de cancelación - solo visible cuando se selecciona "Cancelado" */}
                  {editValues.estadoEnvio === 'cancelado' && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Motivo de la cancelación *
                      </label>
                      <textarea
                        value={editValues.motivoCancelacion || ''}
                        onChange={(e) => setEditValues({...editValues, motivoCancelacion: e.target.value})}
                        placeholder="Describe el motivo de la cancelación..."
                        className="w-full border border-slate-300 rounded-xl px-3 sm:px-4 py-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 resize-none"
                        rows={3}
                        required
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        * Este campo es obligatorio para cancelar el pedido
                      </p>
                    </div>
                  )}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="w-full sm:flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 font-medium text-sm sm:text-base"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => saveEdit(ordenParaEditar)}
                  disabled={editValues.estadoEnvio === 'cancelado' && !editValues.motivoCancelacion?.trim()}
                  className="w-full sm:flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium shadow-lg text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={20} className="inline mr-2" />
                  Guardar cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}

