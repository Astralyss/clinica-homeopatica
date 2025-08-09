"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  Package,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';
import { useAuth } from '@/utils/hooks/useAuth';
import { useCarrito } from '@/utils/context/CarritoContext';

export default function CarritoPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { 
    carrito, 
    loading, 
    actualizarCantidad, 
    eliminarProducto, 
    obtenerCantidadTotal, 
    obtenerTotal 
  } = useCarrito();
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [showEmptyMessage, setShowEmptyMessage] = useState(false);

  // Mostrar mensaje de carrito vacío cuando no hay productos
  useEffect(() => {
    if (!loading && carrito.length === 0) {
      setShowEmptyMessage(true);
    }
  }, [carrito, loading]);

  // Formatear precio
  const formatPrice = (price) =>
    new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(price);

  // Calcular totales
  const totalSeleccionados = carrito
    .filter(item => selectedItems.has(item.id))
    .reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

  const totalCarrito = obtenerTotal();
  const envioCosto = totalCarrito >= 1250 ? 0 : 250;
  const totalConEnvio = totalCarrito + envioCosto;
  const totalItems = obtenerCantidadTotal();

  // Funciones del carrito
  const handleActualizarCantidad = (id, nuevaCantidad) => {
    actualizarCantidad(id, nuevaCantidad);
  };

  const handleEliminarProducto = (id) => {
    eliminarProducto(id);
    setSelectedItems(prev => {
      const nuevo = new Set(prev);
      nuevo.delete(id);
      return nuevo;
    });
  };

  const toggleSeleccion = (id) => {
    setSelectedItems(prev => {
      const nuevo = new Set(prev);
      if (nuevo.has(id)) {
        nuevo.delete(id);
      } else {
        nuevo.add(id);
      }
      return nuevo;
    });
  };

  const seleccionarTodos = () => {
    if (selectedItems.size === carrito.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(carrito.map(item => item.id)));
    }
  };

  const comprarSeleccionados = () => {
    const itemsSeleccionados = carrito.filter(item => selectedItems.has(item.id));
    if (itemsSeleccionados.length === 0) return;
    
    // Guardar solo los productos seleccionados en el carrito
    localStorage.setItem('carrito', JSON.stringify(itemsSeleccionados));
    
    router.push('/farmacia/checkout');
  };

  const comprarTodo = () => {
    if (carrito.length === 0) return;
    
    // Asegurar que el carrito esté guardado en localStorage antes de navegar
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    // Navegar al checkout con todos los productos
    router.push('/farmacia/checkout');
  };

  const continuarComprando = () => {
    router.push('/farmacia');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando carrito...</p>
        </div>
      </div>
    );
  }

  if (showEmptyMessage) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-white shadow-sm"
            >
              <ArrowLeft size={24} className="text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Carrito de Compras</h1>
          </div>

          {/* Mensaje de carrito vacío */}
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <ShoppingCart size={64} className="mx-auto mb-6 text-gray-300" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tu carrito está vacío</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              No tienes productos en tu carrito. Explora nuestra tienda y encuentra productos increíbles.
            </p>
            <button
              onClick={continuarComprando}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Continuar comprando
            </button>
          </div>
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
              <h1 className="text-2xl font-bold text-gray-900">Carrito de Compras</h1>
              <p className="text-gray-600">{totalItems} productos</p>
            </div>
          </div>
          
          {carrito.length > 0 && (
            <button
              onClick={continuarComprando}
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Continuar comprando
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {/* Header de selección */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedItems.size === carrito.length && carrito.length > 0}
                    onChange={seleccionarTodos}
                    className="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                  />
                  <span className="font-medium text-gray-900">
                    Seleccionar todos ({carrito.length})
                  </span>
                </div>
                
                {selectedItems.size > 0 && (
                  <button
                    onClick={() => setSelectedItems(new Set())}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Deseleccionar
                  </button>
                )}
              </div>

              {/* Lista de productos */}
              <div className="space-y-4">
                {carrito.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:shadow-sm transition-shadow">
                    {/* Checkbox de selección */}
                    <input
                      type="checkbox"
                      checked={selectedItems.has(item.id)}
                      onChange={() => toggleSeleccion(item.id)}
                      className="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                    />

                    {/* Imagen del producto */}
                    <div className="relative w-20 h-20 bg-gray-50 rounded-lg border border-gray-100 overflow-hidden flex-shrink-0">
                      <Image
                        src={item.imagenes && item.imagenes.length > 0 ? item.imagenes[0].url : '/productos/placeholder.png'}
                        alt={item.nombre}
                        fill
                        className="object-contain"
                        sizes="80px"
                      />
                    </div>

                    {/* Información del producto */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1">{item.nombre}</h3>
                      <p className="text-sm text-gray-500 mb-2">{item.presentacion}</p>
                      
                      {/* Controles de cantidad */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-gray-200 rounded-lg">
                                                     <button
                             onClick={() => handleActualizarCantidad(item.id, item.cantidad - 1)}
                             disabled={item.cantidad <= 1}
                             className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                           >
                             <Minus size={16} />
                           </button>
                           <span className="px-4 py-2 font-medium">{item.cantidad}</span>
                           <button
                             onClick={() => handleActualizarCantidad(item.id, item.cantidad + 1)}
                             className="p-2 hover:bg-gray-50"
                           >
                             <Plus size={16} />
                           </button>
                        </div>
                        
                                                 <button
                           onClick={() => handleEliminarProducto(item.id)}
                           className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                         >
                           <Trash2 size={16} />
                         </button>
                      </div>
                    </div>

                    {/* Precio */}
                    <div className="text-right">
                      <div className="text-lg font-bold text-emerald-700">
                        {formatPrice(item.precio * item.cantidad)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatPrice(item.precio)} c/u
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Resumen y acciones */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Resumen del Pedido</h2>
              
              {/* Totales */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({totalItems} productos):</span>
                  <span>{formatPrice(totalCarrito)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Envío:</span>
                  <span className={envioCosto === 0 ? 'text-emerald-600' : ''}>
                    {envioCosto === 0 ? 'Gratis' : formatPrice(envioCosto)}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total:</span>
                    <span>{formatPrice(totalConEnvio)}</span>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="space-y-3">
                {selectedItems.size > 0 ? (
                  <button
                    onClick={comprarSeleccionados}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <CreditCard size={20} />
                    Comprar seleccionados ({selectedItems.size})
                  </button>
                ) : (
                  <button
                    onClick={comprarTodo}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <CreditCard size={20} />
                    Comprar todo
                  </button>
                )}

                <button
                  onClick={continuarComprando}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-lg transition-colors"
                >
                  Continuar comprando
                </button>
              </div>

              {/* Información adicional */}
              <div className="mt-6 p-4 bg-emerald-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-emerald-600 mt-0.5" />
                  <div className="text-sm text-emerald-800">
                    <p className="font-medium mb-1">Envío gratuito</p>
                    <p>En pedidos de $1,250 MXN o más</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 