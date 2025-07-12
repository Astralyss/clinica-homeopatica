'use client';
import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Leaf, Check, Stethoscope, Shield, Award } from 'lucide-react';
import { useProductos } from '@/utils/hooks/useProductos';

function Farmacia() {
  const [cantidades, setCantidades] = useState({});
  const [carrito, setCarrito] = useState([]);
  const [imageErrors, setImageErrors] = useState({});
  const { productos, loading, error } = useProductos();

  const actualizarCantidad = (id, nueva) => {
    setCantidades(prev => ({
      ...prev,
      [id]: Math.max(0, nueva)
    }));
  };

  const agregarAlCarrito = (producto) => {
    const cantidad = cantidades[producto.id] || 1;
    setCarrito(prev => [...prev, { ...producto, cantidad }]);
    setCantidades(prev => ({ ...prev, [producto.id]: 0 }));
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

  return (
    <div className="min-h-screen bg-white">
      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
            Nuestros Productos
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto px-4">
            Cada producto está cuidadosamente formulado siguiendo los principios de la homeopatía 
            clásica y las mejores prácticas de manufactura farmacéutica.
          </p>
        </div>

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
                  {/* <div className="absolute top-2 sm:top-3 lg:top-4 right-2 sm:right-3 lg:right-4">
                    <div className="bg-white/90 backdrop-blur-sm text-emerald-700 text-xs font-medium px-2 py-1 rounded-full border border-emerald-200">
                      <Shield size={10} className="inline mr-1" />
                      Reg. Sanitario
                    </div>
                  </div> */}
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

                    {/* Controles de cantidad */}
                    {/* <div className="flex items-center gap-3 mb-3 sm:mb-4">
                      <button
                        onClick={() => actualizarCantidad(producto.id, (cantidades[producto.id] || 1) - 1)}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
                      >
                        <Minus size={12} className="text-gray-600" />
                      </button>
                      
                      <span className="min-w-[2rem] text-center font-medium text-gray-900 text-sm sm:text-base">
                        {cantidades[producto.id] || 1}
                      </span>
                      
                      <button
                        onClick={() => actualizarCantidad(producto.id, (cantidades[producto.id] || 1) + 1)}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
                      >
                        <Plus size={12} className="text-gray-600" />
                      </button>
                    </div> */}

                    {/* Botón agregar al carrito */}
                    <button 
                      onClick={() => agregarAlCarrito(producto)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 sm:py-3 px-4 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 transition-colors duration-200 shadow-sm hover:shadow-md text-sm sm:text-base"
                    >
                      <ShoppingCart size={16} />
                      Agregar al carrito
                    </button>
                  </div>
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
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 sm:py-3 px-6 sm:px-8 rounded-xl sm:rounded-2xl transition-colors duration-200 text-sm sm:text-base">
            Agendar Consulta
          </button>
        </div>
      </div>
    </div>
  );
}

export default Farmacia;