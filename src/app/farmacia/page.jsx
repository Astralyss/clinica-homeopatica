'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { ShoppingCart, Shield } from 'lucide-react';
import ProductFilters from '@/components/ui/ProductFilters';
import { useCategorias } from '@/utils/hooks/useCategorias';
import { useBusquedaProductos } from '@/utils/hooks/useBusquedaProductos';
import CartPanel from '@/components/ui/CartPanel';
import { useAuth } from '@/utils/hooks/useAuth';
import { useCarrito } from '@/utils/context/CarritoContext';

import StoreNavbar from '@/components/admin/StoreNavbar';

function Farmacia() {
  const router = useRouter();
  const [cantidades, setCantidades] = useState({});
  const { 
    carrito, 
    agregarProducto, 
    actualizarCantidad, 
    eliminarProducto, 
    obtenerCantidadTotal 
  } = useCarrito();
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

  const agregarAlCarrito = (producto) => {
    const cantidad = cantidades[producto.id] || 1;
    agregarProducto(producto, cantidad);
    setCantidades(prev => ({ ...prev, [producto.id]: 0 }));
  };

  // Panel carrito: aumentar/disminuir/borrar
  const handleCartAdd = (p) => {
    actualizarCantidad(p.id, p.cantidad + 1);
  };
  const handleCartRemove = (p) => {
    actualizarCantidad(p.id, Math.max(1, p.cantidad - 1));
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

  return (
    <>
      

     <StoreNavbar
  searchTerm={inputValue}
  onSearchChange={setInputValue}
  categoria={selectedCategory}
  onCategoriaChange={setSelectedCategory}
  onBuscar={handleBuscar}
  user={user}
  onCartClick={() => setCartPanelOpen(true)}
  onOrdersClick={irAMisCompras}
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
      <div className="min-h-screen bg-white pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-1">
         

          {/* <ProductFilters
            searchTerm={inputValue}
            onSearchChange={handleInputChange}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categories={categorias}
            suggestions={suggestions}
            loadingSuggestions={loadingSuggestions}
            onBuscar={handleBuscar}
            onSuggestionSelect={handleSuggestionSelect}
          /> */}

          {productos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No hay productos disponibles en este momento.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {productos.map((producto) => (
                <div
                  key={producto.id}
                  className="group bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-emerald-200 transition-all duration-300 flex flex-col"
                >
                  <Link href={`/farmacia/producto/${producto.id}`} className="block flex-1 h-full" style={{ textDecoration: 'none', color: 'inherit' }}>
                    {/* Imagen del producto */}
                    <div className="relative overflow-hidden bg-white flex-shrink-0 p-3 sm:p-4">
                      {imageErrors[producto.id] ? (
                        <div className="w-full h-32 sm:h-36 lg:h-40 bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center rounded-lg">
                          <div className="text-center">
                            <Shield size={24} className="text-emerald-400 mx-auto mb-1 sm:mb-2" />
                            <p className="text-emerald-600 text-xs sm:text-sm font-medium">Producto</p>
                            <p className="text-emerald-500 text-xs">Imagen no disponible</p>
                          </div>
                        </div>
                      ) : (
                        producto.imagenes && producto.imagenes[0] ? (
                          <img
                            src={producto.imagenes[0].url}
                            alt={producto.nombre}
                            className="w-full h-32 sm:h-36 lg:h-40 object-contain group-hover:scale-105 transition-transform duration-300 rounded-lg"
                            onError={() => handleImageError(producto.id)}
                          />
                        ) : (
                          <div className="w-full h-32 sm:h-36 lg:h-40 bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center rounded-lg">
                            <div className="text-center">
                              <Shield size={24} className="text-emerald-400 mx-auto mb-1 sm:mb-2" />
                              <p className="text-emerald-600 text-xs sm:text-sm font-medium">Producto</p>
                              <p className="text-emerald-500 text-xs">Imagen no disponible</p>
                            </div>
                          </div>
                        )
                      )}
                      {/* Badges */}
                      <div className="absolute top-2 sm:top-3 lg:top-4 left-2 sm:left-3 lg:left-4">
                        <span className="bg-emerald-100 text-emerald-700 text-xs font-medium px-2 sm:px-3 py-1 rounded-full">
                          {producto.categoria}
                        </span>
                      </div>
                    </div>

                    {/* Contenido del producto */}
                    <div className="p-4 sm:p-5 lg:p-6 flex flex-col flex-grow">
                      {/* Título */}
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors mb-2 line-clamp-2">
                        {producto.nombre}
                      </h3>
                      {/* Descripción */}
                      <p className="text-gray-600 text-sm leading-relaxed mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3">
                        {producto.descripcion}
                      </p>
                      {/* Presentación */}
                      <div className="text-xs sm:text-sm text-gray-500 bg-gray-50 p-2 sm:p-3 rounded-lg sm:rounded-xl mb-3 sm:mb-4">
                        <strong>Presentación:</strong> {producto.presentacion}
                      </div>
                      {/* Beneficios */}
                      {producto.beneficios && producto.beneficios.length > 0 && (
                        <div className="mb-4 sm:mb-6">
                          <div className="flex flex-wrap gap-1">
                            {producto.beneficios.slice(0, 3).map((beneficio, index) => (
                              <span 
                                key={index}
                                className="bg-teal-50 text-teal-700 text-xs px-2 py-1 rounded-md whitespace-nowrap"
                              >
                                {beneficio}
                              </span>
                            ))}
                            {producto.beneficios.length > 3 && (
                              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md">
                                +{producto.beneficios.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      {/* Parte inferior - se mantiene en la parte de abajo */}
                      <div className="mt-auto">
                        {/* Precio */}
                        <div className="flex items-center justify-left gap-2 mb-3 sm:mb-4">
                          <div className="text-xl sm:text-2xl font-bold text-emerald-600">
                            ${producto.precio}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500">MXN</div>
                        </div>
                        {/* Advertencia de poco stock */}
                        {producto.cantidad !== undefined && producto.cantidad <= 5 && (
                          <div className="text-xs text-red-500 font-semibold mb-2">
                            ¡Pocas unidades disponibles!
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                  {/* Botón agregar al carrito */}
                  <div className="p-4 pt-0">
                    <button 
                      onClick={() => agregarAlCarrito(producto)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 sm:py-3 px-4 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 transition-colors duration-200 shadow-sm hover:shadow-md text-sm sm:text-base"
                    >
                      <ShoppingCart size={16} />
                      Agregar al carrito
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

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