"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PackageSearch, Search, Truck, CheckCircle2, Clock, AlertCircle, Pencil, Save, X, Package, MapPin } from 'lucide-react';

function formatCurrency(value) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value || 0);
}

function EstadoBadge({ estado }) {
  const map = {
    pendiente: { text: 'Pendiente', cls: 'bg-yellow-50 text-yellow-700' },
    confirmada: { text: 'Confirmada', cls: 'bg-blue-50 text-blue-700' },
    en_proceso: { text: 'En proceso', cls: 'bg-orange-50 text-orange-700' },
    enviada: { text: 'Enviada', cls: 'bg-purple-50 text-purple-700' },
    entregada: { text: 'Entregada', cls: 'bg-green-50 text-green-700' },
    cancelada: { text: 'Cancelada', cls: 'bg-red-50 text-red-700' },
  };
  const info = map[estado] || map.pendiente;
  return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${info.cls}`}>{info.text}</span>;
}

export default function PedidosAdminPage() {
  const router = useRouter();
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('todos');
  const [editRowId, setEditRowId] = useState(null);
  const [editValues, setEditValues] = useState({ numeroGuia: '', empresaEnvio: '', estadoEnvio: '' });
  const [detalle, setDetalle] = useState(null);

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
  };

  const startEdit = (orden) => {
    setEditRowId(orden.id);
    setEditValues({
      numeroGuia: orden.envio?.numeroGuia || '',
      empresaEnvio: orden.envio?.empresaEnvio || '',
      estadoEnvio: orden.envio?.estado || 'pendiente',
    });
  };

  const saveEdit = async (orden) => {
    try {
      const resp = await fetch('/api/admin/ordenes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          compraId: orden.id,
          numeroGuia: editValues.numeroGuia,
          empresaEnvio: editValues.empresaEnvio,
          estadoEnvio: editValues.estadoEnvio,
          estadoCompra: editValues.estadoEnvio === 'enviado' ? 'enviada' : undefined,
        }),
      });
      if (!resp.ok) throw new Error('Error actualizando orden');
      await cargarOrdenes();
      setEditRowId(null);
    } catch (e) {
      console.error(e);
      alert('No se pudo actualizar la orden');
    }
  };

  const abrirDetalle = (orden) => setDetalle(orden);
  const cerrarDetalle = () => setDetalle(null);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <PackageSearch className="text-emerald-600" />
          <h1 className="text-2xl font-bold text-gray-900">Órdenes</h1>
        </div>
      </div>

      {/* Filtros */}
      <form onSubmit={onSearch} className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
          <Search size={16} className="text-gray-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por orden, cliente o email"
            className="outline-none text-sm"
          />
        </div>
        <select
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value)}
          className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm shadow-sm"
        >
          <option value="todos">Todos</option>
          <option value="pendiente">Pendiente</option>
          <option value="confirmada">Confirmada</option>
          <option value="en_proceso">En proceso</option>
          <option value="enviada">Enviada</option>
          <option value="entregada">Entregada</option>
          <option value="cancelada">Cancelada</option>
        </select>
        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-700">Filtrar</button>
      </form>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Orden</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Productos</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Guía</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-center text-gray-500">Cargando órdenes...</td>
                </tr>
              ) : ordenes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-center text-gray-500">No hay órdenes</td>
                </tr>
              ) : (
                ordenes.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{o.numeroOrden}</td>
                    <td className="px-4 py-3">{new Date(o.fechaCompra).toLocaleString('es-MX')}</td>
                    <td className="px-4 py-3">{o.cliente.nombre} {o.cliente.apellidoPaterno}<br/><span className="text-gray-500 text-xs">{o.cliente.email}</span></td>
                    <td className="px-4 py-3">{o.productosCantidad}</td>
                    <td className="px-4 py-3 font-semibold">{formatCurrency(o.total)}</td>
                    <td className="px-4 py-3"><EstadoBadge estado={o.estado} /></td>
                    <td className="px-4 py-3">
                      {editRowId === o.id ? (
                        <div className="flex flex-col gap-2">
                          <input
                            value={editValues.numeroGuia}
                            onChange={(e) => setEditValues((v) => ({ ...v, numeroGuia: e.target.value }))}
                            placeholder="Número de guía"
                            className="border border-gray-200 rounded px-2 py-1"
                          />
                          <input
                            value={editValues.empresaEnvio}
                            onChange={(e) => setEditValues((v) => ({ ...v, empresaEnvio: e.target.value }))}
                            placeholder="Empresa (DHL, FedEx, etc.)"
                            className="border border-gray-200 rounded px-2 py-1"
                          />
                          <select
                            value={editValues.estadoEnvio}
                            onChange={(e) => setEditValues((v) => ({ ...v, estadoEnvio: e.target.value }))}
                            className="border border-gray-200 rounded px-2 py-1"
                          >
                            <option value="pendiente">Pendiente</option>
                            <option value="enviado">Enviado</option>
                            <option value="en_transito">En tránsito</option>
                            <option value="entregado">Entregado</option>
                          </select>
                        </div>
                      ) : (
                        <div className="text-gray-700">
                          <div className="font-medium">{o.envio?.numeroGuia || '-'}</div>
                          <div className="text-xs text-gray-500">{o.envio?.empresaEnvio || ''}</div>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editRowId === o.id ? (
                        <button
                          onClick={() => saveEdit(o)}
                          className="inline-flex items-center gap-1 bg-emerald-600 text-white px-3 py-1.5 rounded hover:bg-emerald-700"
                        >
                          <Save size={16} /> Guardar
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => abrirDetalle(o)}
                            className="inline-flex items-center gap-1 border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-50"
                          >
                            <Package size={16} /> Ver detalles
                          </button>
                          <button
                            onClick={() => startEdit(o)}
                            className="inline-flex items-center gap-1 border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-50"
                          >
                            <Pencil size={16} /> Editar envío
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detalle */}
      {detalle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={cerrarDetalle}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full z-10 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Orden #{detalle.numeroOrden}</h2>
              <button onClick={cerrarDetalle} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><Package className="text-emerald-600" size={18}/> Productos</h3>
                  <div className="space-y-3">
                    {detalle.productos.map((p) => (
                      <div key={p.id} className="flex items-center gap-3">
                        <img src={p.imagen} alt={p.nombre} className="w-12 h-12 object-contain bg-white border rounded" />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{p.nombre}</div>
                          <div className="text-xs text-gray-500">Cantidad: {p.cantidad}</div>
                        </div>
                        <div className="text-right font-semibold">{formatCurrency(p.precio * p.cantidad)}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><MapPin className="text-emerald-600" size={18}/> Dirección de envío</h3>
                  <div className="text-sm text-gray-700">
                    <div className="font-medium text-gray-900 mb-1">{detalle.direccion?.nombre || `${detalle.cliente?.nombre} ${detalle.cliente?.apellidoPaterno}`}</div>
                    <div>{detalle.direccion?.calle} {detalle.direccion?.numeroExterior}</div>
                    <div>{detalle.direccion?.colonia}, {detalle.direccion?.ciudad}</div>
                    <div>{detalle.direccion?.estado} {detalle.direccion?.codigoPostal}</div>
                    {detalle.direccion?.referencias && <div className="text-xs text-gray-500 mt-1">{detalle.direccion.referencias}</div>}
                  </div>
                </div>
              </div>

              <div className="space-y-2 border-t pt-4">
                <div className="flex items-center justify-between">
                  <div className="text-gray-600 text-sm">Productos: {detalle.productosCantidad}</div>
                  <div className="text-sm text-gray-700">Subtotal: {formatCurrency(detalle.subtotal)}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-gray-600 text-sm flex items-center gap-1"><Truck size={14} className="text-gray-400"/> Envío</div>
                  <div className={`text-sm ${detalle.costoEnvio === 0 ? 'text-emerald-600' : 'text-gray-700'}`}>
                    {detalle.costoEnvio === 0 ? 'Gratis' : formatCurrency(detalle.costoEnvio)}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-gray-600 text-sm">Total</div>
                  <div className="text-2xl font-bold text-emerald-600">{formatCurrency(detalle.total)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

