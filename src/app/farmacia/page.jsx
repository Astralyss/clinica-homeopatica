'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { ShoppingCart, Shield, AlertTriangle, CheckCircle, Minus, Plus } from 'lucide-react';
import ProductFilters from '@/components/ui/ProductFilters';
import { useCategorias } from '@/utils/hooks/useCategorias';
import { useBusquedaProductos } from '@/utils/hooks/useBusquedaProductos';
import CartPanel from '@/components/ui/CartPanel';
import { useAuth } from '@/utils/hooks/useAuth';
import { useCarrito } from '@/utils/context/CarritoContext';
import { useNotifications } from '@/utils/hooks/useNotifications';
import { NotificationContainer } from '@/components/ui/NotificationToast';
import Image from 'next/image';

import StoreNavbar from '@/components/admin/StoreNavbar';

function Farmacia() {
  const router = useRouter();
  const [cantidades, setCantidades] = useState({});
  const [stockErrors, setStockErrors] = useState({});
  const { 
    carrito, 
    agregarProducto, 
    incrementarCantidad,
    decrementarCantidad,
    eliminarProducto, 
    obtenerCantidadTotal,
    verificarStockDisponible
  } = useCarrito();
  const { notifications, addStockError, addStockWarning, addSuccess, removeNotification } = useNotifications();
  const [cartPanelOpen, setCartPanelOpen] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const { categorias } = useCategorias();
  const { productos, loading, error } = useBusquedaProductos({ search: searchTerm, categoria: selectedCategory });
  const debounceRef = useRef();
  const { user } = useAuth();

  // Sugerencias debounced
  const handleInputChange = (val) => {
    setInputValue(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!val) {
      setSuggestions([]);
      return;
    }
    setLoadingSuggestions(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/productos/busqueda?search=${encodeURIComponent(val)}&categoria=${selectedCategory}`);
        if (!res.ok) throw new Error('Error al buscar sugerencias');
        const data = await res.json();
        setSuggestions(data.map(p => p.nombre).slice(0, 8));
      } catch {
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 300);
  };

  // Buscar real solo al dar Enter o clic en buscar
  const handleBuscar = (val) => {
    setSearchTerm(val);
    setSuggestions([]);
  };

  // Selección de sugerencia
  const handleSuggestionSelect = (s) => {
    setInputValue(s);
    setSearchTerm(s);
    setSuggestions([]);
  };

  const actualizarCantidadInput = (id, nueva) => {
    setCantidades(prev => ({
      ...prev,
      [id]: Math.max(0, nueva)
    }));
  };

  const agregarAlCarrito = async (producto) => {
    const cantidad = cantidades[producto.id] || 1;
    
    // Verificar stock antes de agregar
    const stockInfo = await verificarStockDisponible(producto, cantidad);
    
    if (!stockInfo.disponible) {
      // Solo mostrar error si realmente se excede el stock disponible
      if (stockInfo.cantidadEnCarrito + cantidad > stockInfo.stockDisponible) {
        // Mostrar notificación de error de stock
        addStockError(producto, stockInfo.stockDisponible, cantidad);
        
        // Mostrar error de stock en la UI
        setStockErrors(prev => ({
          ...prev,
          [producto.id]: {
            mensaje: `Solo hay ${stockInfo.stockDisponible} unidades disponibles`,
            stockDisponible: stockInfo.stockDisponible,
            maximoPermitido: stockInfo.stockDisponible
          }
        }));
        
        // Limpiar el error después de 5 segundos
        setTimeout(() => {
          setStockErrors(prev => {
            const { [producto.id]: removed, ...rest } = prev;
            return rest;
          });
        }, 5000);
        
        return;
      }
    }

    // Limpiar error de stock si existe
    setStockErrors(prev => {
      const { [producto.id]: removed, ...rest } = prev;
      return rest;
    });

    const resultado = await agregarProducto(producto, cantidad);
    if (resultado) {
      setCantidades(prev => ({ ...prev, [producto.id]: 0 }));
      
      // Mostrar notificación de éxito
      addSuccess(`${cantidad} ${cantidad === 1 ? 'unidad' : 'unidades'} de "${producto.nombre}" agregada${cantidad === 1 ? '' : 's'} al carrito`);
      
      // Mostrar advertencia si el stock es bajo
      const stockRestante = stockInfo.stockDisponible - (stockInfo.cantidadEnCarrito + cantidad);
      if (stockRestante <= 5 && stockRestante > 0) {
        addStockWarning(producto, stockRestante);
      }
    }
  };

  // Panel carrito: aumentar/disminuir/borrar
  const handleCartAdd = (p) => {
    incrementarCantidad(p);
  };
  const handleCartRemove = (p) => {
    decrementarCantidad(p);
  };
  const handleCartDelete = (p) => {
    eliminarProducto(p.id);
  };

  // FUNCIÓN  Manejo de errores de imagen
  const handleImageError = (productId) => {
    setImageErrors(prev => ({
      ...prev,
      [productId]: true
    }));
  };

  // Obtener información de stock para un producto
  const obtenerInfoStock = (productoId) => {
    return stockErrors[productoId] || null;
  };

  // Formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-MX", { 
      style: "currency", 
      currency: "MXN" 
    }).format(price);
  };

  // Obtener cantidad de un producto en el carrito
  const obtenerCantidadProducto = (productoId) => {
    return carrito.find(p => p.id === productoId)?.cantidad || 0;
  };

  // Calcular stock restante para un producto
  const calcularStockRestante = (producto) => {
    const cantidadEnCarrito = obtenerCantidadProducto(producto.id);
    const stockDisponible = producto.cantidad || 0;
    const stockRestante = Math.max(0, stockDisponible - cantidadEnCarrito);
    
    console.log(`🔍 Stock Debug - Producto: ${producto.nombre}`);
    console.log(`   Stock disponible: ${stockDisponible}`);
    console.log(`   En carrito: ${cantidadEnCarrito}`);
    console.log(`   Stock restante: ${stockRestante}`);
    
    return stockRestante;
  };

  // Verificar si se puede agregar más de un producto
  const puedeAgregarMas = (productoId) => {
    const producto = productos.find(p => p.id === productoId);
    if (!producto) return false;
    const stockRestante = calcularStockRestante(producto);
    const cantidadActual = cantidades[productoId] || 0;
    return stockRestante > cantidadActual;
  };

  // Manejar incremento en el selector de cantidad
  const handleIncrementarCantidad = (producto) => {
    const stockRestante = calcularStockRestante(producto);
    const cantidadActual = cantidades[producto.id] || 0;
    
    if (cantidadActual < stockRestante) {
      setCantidades(prev => ({
        ...prev,
        [producto.id]: cantidadActual + 1
      }));
    }
  };

  // Manejar decremento en el selector de cantidad
  const handleDecrementarCantidad = (producto) => {
    const cantidadActual = cantidades[producto.id] || 0;
    if (cantidadActual > 0) {
      setCantidades(prev => ({
        ...prev,
        [producto.id]: cantidadActual - 1
      }));
    }
  };

  // Estados de carga y error
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

   const irAMisCompras = () => {
     router.push('/farmacia/mis-compras');
   };

   const irAPerfil = () => {
     console.log('🚀 Navegando a perfil...');
     router.push('/farmacia/perfil');
   };

  return (
    <>
      <NotificationContainer 
        notifications={notifications} 
        onRemove={removeNotification} 
      />

      <StoreNavbar
        searchTerm={inputValue}
        onSearchChange={setInputValue}
        categoria={selectedCategory}
        onCategoriaChange={setSelectedCategory}
        onBuscar={handleBuscar}
        user={user}
        onCartClick={() => setCartPanelOpen(true)}
        onOrdersClick={irAMisCompras}
        onProfileClick={irAPerfil}
        cartCount={obtenerCantidadTotal()}
      />
      
      <CartPanel
        open={cartPanelOpen}
        onClose={() => setCartPanelOpen(false)}
        productos={carrito}
        onAdd={handleCartAdd}
        onRemove={handleCartRemove}
        onDelete={handleCartDelete}
      />

      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Filtros */}
          <ProductFilters
            categorias={categorias}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            searchTerm={inputValue}
            onSearchChange={handleInputChange}
            onSearch={handleBuscar}
            suggestions={suggestions}
            onSuggestionSelect={handleSuggestionSelect}
            loadingSuggestions={loadingSuggestions}
          />

          {/* Grid de productos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {productos.map((producto) => {
              const stockRestante = calcularStockRestante(producto);
              const tieneStock = stockRestante > 0;
              const cantidadEnCarrito = obtenerCantidadProducto(producto.id);
              const stockInfo = stockErrors[producto.id];
              const tieneErrorStock = stockErrors[producto.id];
                
                return (
                  <div key={producto.id} className="flex flex-col h-full">
                    {/* Tarjeta del producto */}
                    <div className="product-card bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                      {/* Imagen del producto */}
                      <div className="relative w-full h-48 bg-white rounded-t-xl overflow-hidden flex-shrink-0">
                        <Image
                          src={producto.imagenes && producto.imagenes.length > 0 ? producto.imagenes[0].url : '/productos/placeholder.png'}
                          alt={producto.nombre}
                          fill
                          className="object-contain p-4"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      
                      {/* Contenido de la tarjeta */}
                      <div className="card-content p-4">
                        {/* Sección de descripción */}
                        <div className="description-section">
                          {/* Título del producto */}
                          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2 leading-tight h-10">
                            {producto.nombre}
                          </h3>
                          
                          {/* Descripción truncada */}
                          <div className="description mb-3">
                            <p className="text-gray-600 text-xs leading-relaxed line-clamp-3">
                              {producto.descripcion}
                            </p>
                            {producto.descripcion.length > 150 && (
                              <div className="text-emerald-500 text-xs italic mt-1">
                                ... más información disponible
                              </div>
                            )}
                          </div>
                          
                          {/* Puntos clave truncados */}
                          {producto.puntosClave && producto.puntosClave.length > 0 && (
                            <div className="points mb-3">
                              <ul className="text-xs text-gray-500 space-y-1">
                                {producto.puntosClave.slice(0, 2).map((punto, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <span className="text-emerald-500 mt-1 flex-shrink-0">•</span>
                                    <span className="line-clamp-1">{punto}</span>
                                  </li>
                                ))}
                                {producto.puntosClave.length > 2 && (
                                  <li className="text-emerald-500 text-xs italic">
                                    ... y {producto.puntosClave.length - 2} más
                                  </li>
                                )}
                              </ul>
                            </div>
                          )}
                        </div>
                        
                        {/* Sección de acción */}
                        <div className="action-section">
                          {/* Presentación */}
                          <div className="text-xs text-gray-500 mb-3 h-4 presentation">
                            {producto.presentacion}
                          </div>
                          
                          {/* Precio */}
                          <div className="text-lg font-bold text-emerald-700 mb-4 h-7 price">
                            {formatPrice(producto.precio)}
                          </div>
                          
                          {/* Información de stock */}
                          <div className="text-xs text-gray-500 mb-3 h-4 stock-info">
                            {stockRestante > 0 ? (
                              <span className="text-emerald-600">
                                {stockRestante} unidad{stockRestante !== 1 ? 'es' : ''} disponible{stockRestante !== 1 ? 's' : ''}
                              </span>
                            ) : (
                              <span className="text-red-600">
                                Sin stock (DB: {producto.cantidad || 0})
                              </span>
                            )}
                          </div>
                          

                          
                          {/* Selector de cantidad */}
                          <div className="flex items-center gap-2 mb-3 h-8 quantity-selector">
                            <button
                              onClick={() => handleDecrementarCantidad(producto)}
                              className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-emerald-600 transition disabled:opacity-50"
                              disabled={(cantidades[producto.id] || 1) <= 1}
                            >
                              <Minus size={14} />
                            </button>
                            <input
                              type="number"
                              min="1"
                              max={stockRestante}
                              value={cantidades[producto.id] || 1}
                              onChange={(e) => actualizarCantidadInput(producto.id, parseInt(e.target.value) || 1)}
                              className="w-12 text-center text-sm border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                            <button
                              onClick={() => handleIncrementarCantidad(producto)}
                              className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-emerald-600 transition disabled:opacity-50"
                              disabled={(cantidades[producto.id] || 1) >= stockRestante}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          
                          {/* Botón agregar al carrito */}
                          <button
                            onClick={() => agregarAlCarrito(producto)}
                            disabled={!tieneStock || (cantidades[producto.id] || 1) === 0}
                            className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 h-10 add-button ${
                              !tieneStock || (cantidades[producto.id] || 1) === 0
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md'
                            }`}
                          >
                            {!tieneStock 
                              ? `Sin stock (DB: ${producto.cantidad || 0})` 
                              : (cantidades[producto.id] || 1) === 0
                                ? 'Selecciona cantidad'
                                : 'Agregar al carrito'
                            }
                          </button>
                          
                          {/* Botón ver más información */}
                          <button
                            onClick={() => router.push(`/farmacia/producto/${producto.id}`)}
                            className="w-full mt-2 py-1.5 px-3 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors duration-200 border border-emerald-200 hover:border-emerald-300 more-info-button"
                          >
                            Ver más información
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          {/* Información adicional */}
          <div className="mt-8 sm:mt-12 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
              ¿Necesitas asesoría personalizada?
            </h3>
            <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6 max-w-2xl mx-auto px-4">
              Nuestros especialistas en homeopatía están disponibles para brindarte 
              recomendaciones personalizadas según tus necesidades específicas de salud.
            </p>
            <Link href="/agendarConsulta">
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 sm:py-3 px-6 sm:px-8 rounded-xl sm:rounded-2xl transition-colors duration-200 text-sm sm:text-base">
              Agendar Consulta
            </button>
            </Link>
            
          </div>
        </div>
      </div>
    </>
  );
}

export default Farmacia;