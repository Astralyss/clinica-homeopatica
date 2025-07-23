"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Eye,
  Download,
  Calendar,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  ShoppingCart
} from 'lucide-react';
import { useAuth } from '@/utils/hooks/useAuth';

export default function MisComprasPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompra, setSelectedCompra] = useState(null);
  const [showDetalles, setShowDetalles] = useState(false);



  // Cargar compras desde la API
  useEffect(() => {
    const cargarCompras = async () => {
      try {
        const params = new URLSearchParams({
          usuarioId: user?.id || '1'
        });

        const response = await fetch(`/api/compras?${params}`);
        if (!response.ok) {
          throw new Error('Error al cargar compras');
        }

        const data = await response.json();
        setCompras(data.compras);
      } catch (error) {
        console.error('Error al cargar compras:', error);
        // En caso de error, usar datos de ejemplo
        setCompras([]);
      } finally {
        setLoading(false);
      }
    };

    cargarCompras();
  }, [user?.id]);

  // Formatear precio
  const formatPrice = (price) =>
    new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(price);

  // Formatear fecha
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Obtener estado con color
  const getEstadoInfo = (estado) => {
    const estados = {
      'pendiente': { color: 'text-yellow-600', bg: 'bg-yellow-50', icon: Clock, text: 'Pendiente' },
      'confirmada': { color: 'text-blue-600', bg: 'bg-blue-50', icon: Package, text: 'Confirmada' },
      'en_proceso': { color: 'text-orange-600', bg: 'bg-orange-50', icon: Package, text: 'En Proceso' },
      'enviada': { color: 'text-purple-600', bg: 'bg-purple-50', icon: Truck, text: 'Enviada' },
      'entregada': { color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle, text: 'Entregada' },
      'cancelada': { color: 'text-red-600', bg: 'bg-red-50', icon: AlertCircle, text: 'Cancelada' }
    };
    return estados[estado] || estados['pendiente'];
  };



  // Ver detalles de compra
  const verDetalles = (compra) => {
    setSelectedCompra(compra);
    setShowDetalles(true);
  };

  // Descargar factura (simulado)
  const descargarFactura = (compra) => {
    alert(`Descargando factura de ${compra.numeroOrden}`);
  };

  // Rastrear envío (simulado)
  const rastrearEnvio = (compra) => {
    if (compra.numeroSeguimiento) {
      window.open(`https://tracking.example.com/${compra.numeroSeguimiento}`, '_blank');
    } else {
      alert('Número de seguimiento no disponible aún');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tus compras...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
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
              <h1 className="text-2xl font-bold text-gray-900">Mis Compras</h1>
              <p className="text-gray-600">{compras.length} compras encontradas</p>
            </div>
          </div>
        </div>



        {/* Lista de compras */}
        <div className="space-y-6">
          {compras.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <Package size={64} className="mx-auto mb-6 text-gray-300" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No hay compras</h2>
              <p className="text-gray-600 mb-8">
                No se encontraron compras con los filtros seleccionados.
              </p>
              <button
                onClick={() => router.push('/farmacia')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
              >
                Ir a la tienda
              </button>
            </div>
          ) : (
            compras.map((compra) => {
              const estadoInfo = getEstadoInfo(compra.estado);
              const EstadoIcon = estadoInfo.icon;
              
              return (
                <div key={compra.id} className="bg-white rounded-2xl shadow-lg p-6">
                  {/* Header de la compra */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Orden #{compra.numeroOrden}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(compra.fechaCompra)}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className={`px-3 py-1 rounded-full ${estadoInfo.bg} ${estadoInfo.color} flex items-center gap-2`}>
                        <EstadoIcon size={16} />
                        <span className="text-sm font-medium">{estadoInfo.text}</span>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-lg font-bold text-emerald-600">
                          {formatPrice(compra.total)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {compra.productos.length} {compra.productos.length === 1 ? 'producto' : 'productos'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Productos */}
                  <div className="space-y-3 mb-4">
                    {compra.productos.map((producto) => (
                      <div key={producto.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="relative w-12 h-12 bg-white rounded-lg border border-gray-200 overflow-hidden flex-shrink-0">
                          <Image
                            src={producto.imagen}
                            alt={producto.nombre}
                            fill
                            className="object-contain"
                            sizes="48px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{producto.nombre}</h4>
                          <p className="text-sm text-gray-500">Cantidad: {producto.cantidad}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatPrice(producto.precio * producto.cantidad)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => verDetalles(compra)}
                        className="flex items-center gap-2 px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      >
                        <Eye size={16} />
                        Ver detalles
                      </button>
                      
                      {compra.numeroSeguimiento && (
                        <button
                          onClick={() => rastrearEnvio(compra)}
                          className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Truck size={16} />
                          Rastrear
                        </button>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => descargarFactura(compra)}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <Download size={16} />
                        Factura
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal de detalles */}
      {showDetalles && selectedCompra && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowDetalles(false)}></div>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto relative z-10">
                          <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Detalles de la Orden #{selectedCompra.numeroOrden}
                  </h2>
                  <button
                    onClick={() => setShowDetalles(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ArrowLeft size={20} className="text-gray-600" />
                  </button>
                </div>

                {/* Información de la orden */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Package size={18} className="text-emerald-600" />
                      Información de la Orden
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Número de Orden:</span>
                        <span className="font-medium text-gray-900">{selectedCompra.numeroOrden}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Fecha de Compra:</span>
                        <span className="font-medium text-gray-900">{formatDate(selectedCompra.fechaCompra)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Estado:</span>
                        <span className="font-medium text-gray-900">{getEstadoInfo(selectedCompra.estado).text}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Método de Pago:</span>
                        <span className="font-medium text-gray-900 capitalize">{selectedCompra.metodoPago}</span>
                      </div>
                      {selectedCompra.numeroSeguimiento && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Número de Seguimiento:</span>
                          <span className="font-medium text-gray-900">{selectedCompra.numeroSeguimiento}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <MapPin size={18} className="text-emerald-600" />
                      Dirección de Envío
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{selectedCompra.direccion.nombre}</p>
                          <p className="text-gray-600">{selectedCompra.direccion.calle}</p>
                          <p className="text-gray-600">
                            {selectedCompra.direccion.colonia}, {selectedCompra.direccion.ciudad}
                          </p>
                          <p className="text-gray-600">
                            {selectedCompra.direccion.estado} {selectedCompra.direccion.codigoPostal}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Productos */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <ShoppingCart size={18} className="text-emerald-600" />
                    Productos ({selectedCompra.productos.length})
                  </h3>
                  <div className="space-y-3">
                    {selectedCompra.productos.map((producto) => (
                      <div key={producto.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="relative w-16 h-16 bg-white rounded-lg border border-gray-200 overflow-hidden flex-shrink-0">
                          <Image
                            src={producto.imagen}
                            alt={producto.nombre}
                            fill
                            className="object-contain"
                            sizes="64px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900">{producto.nombre}</h4>
                          <p className="text-sm text-gray-500">Cantidad: {producto.cantidad}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatPrice(producto.precio * producto.cantidad)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatPrice(producto.precio)} c/u
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-gray-200 pt-4 bg-emerald-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total de la Orden</span>
                    <span className="text-2xl font-bold text-emerald-600">
                      {formatPrice(selectedCompra.total)}
                    </span>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    {selectedCompra.numeroSeguimiento && (
                      <button
                        onClick={() => rastrearEnvio(selectedCompra)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        <Truck size={16} />
                        Rastrear Envío
                      </button>
                    )}
                  </div>
                  
                  <button
                    onClick={() => descargarFactura(selectedCompra)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    <Download size={16} />
                    Descargar Factura
                  </button>
                </div>
              </div>
          </div>
        </div>
      )}
    </div>
  );
} 