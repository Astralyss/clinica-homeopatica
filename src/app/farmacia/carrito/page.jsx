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
  X,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/utils/hooks/useAuth';
import { useCarrito } from '@/utils/context/CarritoContext';

export default function CarritoPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { 
    carrito, 
    loading, 
    incrementarCantidad,
    decrementarCantidad,
    eliminarProducto, 
    obtenerCantidadTotal, 
    obtenerTotal,
    obtenerInfoStock,
    hayErroresStock,
    obtenerProductosSinStock,
    tieneStockSuficiente
  } = useCarrito();
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
  const totalCarrito = obtenerTotal();
  const envioCosto = totalCarrito >= 1250 ? 0 : 250;
  const totalConEnvio = totalCarrito + envioCosto;
  const totalItems = obtenerCantidadTotal();

  // Funciones del carrito
  const handleIncrementarCantidad = (item) => {
    const resultado = incrementarCantidad(item);
    if (!resultado) {
      // Mostrar notificación de stock insuficiente si es necesario
      console.log('No se puede agregar más unidades - stock insuficiente');
    }
  };

  const handleDecrementarCantidad = (item) => {
    decrementarCantidad(item);
  };

  const handleEliminarProducto = (id) => {
    eliminarProducto(id);
  };

  const comprarTodo = () => {
    if (carrito.length === 0) return;
    
    // Verificar que no haya errores de stock
    if (hayErroresStock()) {
      alert('No puedes proceder con productos que exceden el stock disponible. Revisa las cantidades.');
      return;
    }
    
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

        {/* Advertencia de stock si hay errores */}
        {hayErroresStock() && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700 mb-2">
              <AlertTriangle size={20} />
              <span className="font-medium">Stock insuficiente</span>
            </div>
            <p className="text-sm text-red-600">
              Algunos productos en tu carrito exceden el stock disponible. 
              Revisa las cantidades antes de proceder con la compra.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {/* Header de productos */}
              <div className="mb-6 pb-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">
                  Productos en tu carrito ({carrito.length})
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Revisa y ajusta las cantidades antes de proceder con tu compra
                </p>
              </div>

              {/* Lista de productos */}
              <div className="space-y-4">
                {carrito.map((item) => {
                  const stockInfo = obtenerInfoStock(item.id);
                  const tieneErrorStock = !!stockInfo;
                  const puedeAgregarMas = tieneStockSuficiente(item.id);
                  
                  return (
                    <div key={item.id} className={`flex items-center gap-4 p-4 border rounded-xl hover:shadow-sm transition-shadow ${
                      tieneErrorStock ? 'border-red-200 bg-red-50' : 'border-gray-100'
                    }`}>
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
                        
                        {/* Mensaje de error de stock */}
                        {tieneErrorStock && (
                          <div className="flex items-center gap-1 mb-2 text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                            <AlertTriangle size={12} />
                            <span>{stockInfo.mensaje}</span>
                          </div>
                        )}
                        
                        {/* Controles de cantidad */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border border-gray-200 rounded-lg">
                            <button
                              onClick={() => handleDecrementarCantidad(item)}
                              disabled={item.cantidad <= 1}
                              className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Minus size={16} />
                            </button>
                            <span className={`px-4 py-2 font-medium ${tieneErrorStock ? 'text-red-600' : 'text-gray-800'}`}>
                              {item.cantidad}
                            </span>
                            <button
                              onClick={() => handleIncrementarCantidad(item)}
                              disabled={!puedeAgregarMas}
                              className={`p-2 transition-colors ${
                                !puedeAgregarMas 
                                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                  : tieneErrorStock 
                                    ? 'hover:bg-red-100 text-red-600' 
                                    : 'hover:bg-gray-50'
                              }`}
                              title={!puedeAgregarMas ? 'No hay más stock disponible' : tieneErrorStock ? `Máximo ${stockInfo.maximoPermitido} unidades disponibles` : 'Agregar una unidad más'}
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => handleEliminarProducto(item.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar producto"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Precio */}
                      <div className="text-right">
                        <div className={`text-lg font-bold ${tieneErrorStock ? 'text-red-600' : 'text-emerald-700'}`}>
                          {formatPrice(item.precio * item.cantidad)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatPrice(item.precio)} c/u
                        </div>
                      </div>
                    </div>
                  );
                })}
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
                <button
                  onClick={comprarTodo}
                  className={`w-full font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                    hayErroresStock() 
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <CreditCard size={20} />
                  {hayErroresStock() ? 'Revisar carrito' : 'Comprar todo'}
                </button>

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