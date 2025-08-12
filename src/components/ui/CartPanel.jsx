import React, { useState } from 'react';
import { X, ShoppingCart, Plus, Minus, Trash2, ArrowRight, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCarrito } from '../../utils/context/CarritoContext';

export default function CartPanel({ open, onClose, productos = [], onAdd, onRemove, onDelete }) {
  const router = useRouter();
  const [loadingStates, setLoadingStates] = useState({});
  const { 
    carrito, 
    incrementarCantidad, 
    decrementarCantidad, 
    eliminarProducto,
    obtenerInfoStock,
    hayErroresStock,
    tieneStockSuficiente
  } = useCarrito();

  // Calcular total del carrito
  const total = carrito.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);
  const totalItems = carrito.reduce((sum, p) => sum + p.cantidad, 0);

  // Formatear precio
  const formatPrice = (price) =>
    new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(price);

  // Navegar al carrito completo
  const handleVerCarritoCompleto = () => {
    onClose();
    router.push('/farmacia/carrito');
  };

  // Manejar incremento de cantidad
  const handleIncrementar = async (producto) => {
    setLoadingStates(prev => ({ ...prev, [producto.id]: true }));
    
    try {
      const resultado = await incrementarCantidad(producto);
      if (!resultado) {
        console.log('No se puede agregar más unidades - stock insuficiente');
      } else {
        // Actualizar estado después de incrementar
        await actualizarEstadoAgregar(producto.id);
      }
    } catch (error) {
      console.error('Error al incrementar cantidad:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [producto.id]: false }));
    }
  };

  // Verificar si se puede agregar más de un producto específico
  const puedeAgregarMas = async (producto) => {
    try {
      return await tieneStockSuficiente(producto.id);
    } catch (error) {
      console.error('Error al verificar stock:', error);
      return false;
    }
  };

  // Estado para controlar si se puede agregar más
  const [puedeAgregarEstados, setPuedeAgregarEstados] = useState({});

  // Verificar stock para cada producto al cargar
  React.useEffect(() => {
    const verificarStocks = async () => {
      const nuevosEstados = {};
      for (const producto of carrito) {
        nuevosEstados[producto.id] = await puedeAgregarMas(producto);
      }
      setPuedeAgregarEstados(nuevosEstados);
    };

    if (carrito.length > 0) {
      verificarStocks();
    }
  }, [carrito]);

  // Actualizar estado cuando cambie la cantidad
  const actualizarEstadoAgregar = async (productoId) => {
    console.log('Actualizando estado para producto:', productoId);
    const producto = carrito.find(p => p.id === productoId);
    if (producto) {
      console.log('Producto encontrado, verificando si puede agregar más...');
      const puede = await puedeAgregarMas(producto);
      console.log('Resultado de puedeAgregarMas:', puede);
      setPuedeAgregarEstados(prev => ({
        ...prev,
        [productoId]: puede
      }));
      console.log('Estado actualizado para producto:', productoId, 'puede agregar:', puede);
    } else {
      console.log('Producto no encontrado en el carrito');
    }
  };

  // Manejar decremento de cantidad
  const handleDecrementar = async (producto) => {
    console.log('Iniciando decremento para producto:', producto.id, 'Cantidad actual:', producto.cantidad);
    setLoadingStates(prev => ({ ...prev, [producto.id]: true }));
    
    try {
      console.log('Llamando a decrementarCantidad...');
      await decrementarCantidad(producto);
      console.log('Decremento completado, actualizando estado...');
      
      // Actualizar estado después de decrementar para verificar si ahora se puede agregar más
      await actualizarEstadoAgregar(producto.id);
      console.log('Estado actualizado después del decremento');
    } catch (error) {
      console.error('Error al decrementar cantidad:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [producto.id]: false }));
      console.log('Estado de carga limpiado');
    }
  };

  // Manejar eliminación de producto
  const handleEliminar = (producto) => {
    eliminarProducto(producto.id);
  };

  return (
    <div className={`fixed inset-0 z-50 transition-all duration-300 ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      {/* Fondo oscuro */}
      <div
        className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
        aria-hidden={!open}
      />
      {/* Panel lateral */}
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl border-l border-gray-100 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
        aria-modal="true"
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <ShoppingCart size={22} className="text-emerald-600" />
            <h2 className="text-lg font-semibold text-gray-900">Carrito</h2>
            {totalItems > 0 && (
              <span className="bg-emerald-600 text-white text-xs rounded-full px-2 py-1 font-bold">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all duration-200 border border-transparent hover:border-gray-200"
            aria-label="Cerrar panel"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Productos en el carrito */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {carrito.length === 0 ? (
            <div className="text-center text-gray-500 py-16">
              <ShoppingCart size={40} className="mx-auto mb-4 text-gray-300" />
              <p>Tu carrito está vacío.</p>
              <p className="text-sm mt-2">Agrega productos para comenzar</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {carrito.map((p, idx) => {
                const stockInfo = obtenerInfoStock(p.id);
                const tieneErrorStock = !!stockInfo;
                const isLoading = loadingStates[p.id];
                
                return (
                  <li key={p.id || idx} className="flex gap-4 items-center border-b border-gray-100 pb-4 last:border-b-0">
                    {/* Imagen del producto */}
                    <div className="relative w-16 h-16 bg-gray-50 rounded-lg border border-gray-100 overflow-hidden flex-shrink-0">
                      <Image
                        src={p.imagenes && p.imagenes.length > 0 ? p.imagenes[0].url : '/productos/placeholder.png'}
                        alt={p.nombre}
                        fill
                        className="object-contain"
                        sizes="64px"
                      />
                    </div>
                    
                    {/* Información del producto */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{p.nombre}</h3>
                      <div className="text-xs text-gray-500 truncate">{p.presentacion}</div>
                      
                      {/* Mensaje de error de stock */}
                      {tieneErrorStock && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                          <AlertTriangle size={12} />
                          <span>{stockInfo.mensaje}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 mt-2">
                        <button 
                          onClick={() => handleDecrementar(p)} 
                          disabled={p.cantidad <= 1 || isLoading}
                          className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-emerald-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus size={14} />
                        </button>
                        <span className={`px-2 text-base font-semibold ${tieneErrorStock ? 'text-red-600' : 'text-gray-800'}`}>
                          {p.cantidad}
                        </span>
                        <button 
                          onClick={() => handleIncrementar(p)} 
                          disabled={isLoading || !puedeAgregarEstados[p.id]}
                          className={`p-1.5 rounded-full transition ${
                            isLoading 
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                              : !puedeAgregarEstados[p.id]
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                : tieneErrorStock 
                                  ? 'bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700' 
                                  : 'bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-emerald-600'
                          }`}
                          title={
                            isLoading 
                              ? 'Verificando stock...' 
                              : !puedeAgregarEstados[p.id]
                                ? 'Stock máximo alcanzado'
                                : tieneErrorStock 
                                  ? `Máximo ${stockInfo.maximoPermitido} unidades disponibles` 
                                  : 'Agregar una unidad más'
                          }
                        >
                          {isLoading ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-b border-current"></div>
                          ) : (
                            <Plus size={14} />
                          )}
                        </button>
                        
                        {/* Botón de prueba temporal */}
                        <button 
                          onClick={() => console.log('Estado actual:', puedeAgregarEstados[p.id], 'Cantidad:', p.cantidad)}
                          className="p-1 text-xs bg-blue-100 text-blue-600 rounded"
                          title="Debug info"
                        >
                          Debug
                        </button>
                      </div>
                    </div>
                    
                    {/* Precio y botón eliminar */}
                    <div className="flex flex-col items-end gap-2">
                      <span className={`text-base font-bold ${tieneErrorStock ? 'text-red-600' : 'text-emerald-700'}`}>
                        {formatPrice(p.precio * p.cantidad)}
                      </span>
                      <button 
                        onClick={() => handleEliminar(p)} 
                        className="p-1.5 rounded-full bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-700 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        
        {/* Footer con total y botón */}
        <div className="px-6 py-5 border-t border-gray-100 bg-white">
          {/* Advertencia de stock si hay errores */}
          {hayErroresStock() && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle size={16} />
                <span className="text-sm font-medium">Stock insuficiente</span>
              </div>
              <p className="text-xs text-red-600 mt-1">
                Algunos productos en tu carrito exceden el stock disponible. 
                Revisa las cantidades antes de continuar.
              </p>
            </div>
          )}
          
          {carrito.length > 0 && (
            <div className="mb-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total:</span>
                <span className="text-emerald-700">{formatPrice(total)}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
              </p>
            </div>
          )}
          
          <button 
            onClick={handleVerCarritoCompleto}
            disabled={carrito.length === 0}
            className={`w-full font-semibold py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md text-base flex items-center justify-center gap-2 ${
              hayErroresStock() 
                ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            } disabled:bg-gray-300 disabled:cursor-not-allowed`}
          >
            <ShoppingCart size={18} /> 
            {hayErroresStock() ? 'Revisar carrito' : 'Ver carrito completo'}
            <ArrowRight size={16} />
          </button>
        </div>
      </aside>
    </div>
  );
} 