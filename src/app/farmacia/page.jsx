'use client';
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Leaf, Check, Stethoscope, Shield, Award } from 'lucide-react';

function Farmacia() {
  const [cantidades, setCantidades] = useState({});
  const [carrito, setCarrito] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  // Opción 1: Cargar desde archivo JSON estático
  useEffect(() => {
    const cargarProductosDesdeJSON = async () => {
      try {
        const response = await fetch('/data.json');
        if (!response.ok) {
          throw new Error('Error al cargar productos');
        }
        const data = await response.json();
        setProductos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarProductosDesdeJSON();
  }, []);

  // Opción 2: Cargar desde API/Base de datos
  // Descomenta esta función y comenta la anterior si usas una API
  /*
  useEffect(() => {
    const cargarProductosDesdeAPI = async () => {
      try {
        const response = await fetch('/api/productos'); // Tu endpoint de API
        if (!response.ok) {
          throw new Error('Error al cargar productos');
        }
        const data = await response.json();
        setProductos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarProductosDesdeAPI();
  }, []);
  */

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
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestros Productos</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Cada producto está cuidadosamente formulado siguiendo los principios de la homeopatía 
            clásica y las mejores prácticas de manufactura farmacéutica.
          </p>
        </div>

        {productos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No hay productos disponibles en este momento.</p>
          </div>
        ) : (
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {productos.map((producto) => (
              <div
                key={producto.id}
                className="group bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-emerald-200 transition-all duration-300 flex flex-col h-full"
              >
                {/* Imagen del producto */}
                <div className="relative overflow-hidden bg-gray-50 flex-shrink-0">
                  {imageErrors[producto.id] ? (
                    // Mostrar placeholder cuando hay error de imagen
                    <div className="w-full h-48 bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                      <div className="text-center">
                        <Shield size={32} className="text-emerald-400 mx-auto mb-2" />
                        <p className="text-emerald-600 text-sm font-medium">Producto</p>
                        <p className="text-emerald-500 text-xs">Imagen no disponible</p>
                      </div>
                    </div>
                  ) : (
                    producto.imagen ? (
                      <img
                        src={producto.imagen}
                        alt={producto.nombre}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={() => handleImageError(producto.id)}
                      />
                    ) : (
                      // Mostrar placeholder cuando no hay imagen definida
                      <div className="w-full h-48 bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                        <div className="text-center">
                          <Shield size={32} className="text-emerald-400 mx-auto mb-2" />
                          <p className="text-emerald-600 text-sm font-medium">Producto</p>
                          <p className="text-emerald-500 text-xs">Imagen no disponible</p>
                        </div>
                      </div>
                    )
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="bg-emerald-100 text-emerald-700 text-xs font-medium px-3 py-1 rounded-full">
                      {producto.categoria}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm text-emerald-700 text-xs font-medium px-2 py-1 rounded-full border border-emerald-200">
                      <Shield size={12} className="inline mr-1" />
                      Reg. Sanitario
                    </div>
                  </div>
                </div>

                {/* Contenido del producto */}
                <div className="p-6 flex flex-col flex-grow">
                  {/* Título - altura fija */}
                  <div className="mb-2 h-14 flex items-start">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-2">
                      {producto.nombre}
                    </h3>
                  </div>
                  
                  {/* Descripción - altura fija */}
                  <div className="mb-4 h-16 flex items-start">
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {producto.descripcion}
                    </p>
                  </div>

                  {/* Presentación - altura fija */}
                  <div className="mb-4 h-16 flex items-start">
                    <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-xl w-full">
                      <strong>Presentación:</strong> {producto.presentacion}
                    </div>
                  </div>

                  {/* Beneficios - altura fija */}
                  <div className="mb-6 h-16 overflow-hidden">
                    <div className="flex flex-wrap gap-1">
                      {producto.beneficios?.slice(0, 4).map((beneficio, index) => (
                        <span 
                          key={index}
                          className="bg-teal-50 text-teal-700 text-xs px-2 py-1 rounded-md whitespace-nowrap"
                        >
                          {beneficio}
                        </span>
                      ))}
                      {producto.beneficios?.length > 4 && (
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md">
                          +{producto.beneficios.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Parte inferior fija - se mantiene en la parte de abajo */}
                  <div className="mt-auto">
                    {/* Precio */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-bold text-emerald-600">
                        ${producto.precio}
                      </div>
                      <div className="text-sm text-gray-500">MXN</div>
                    </div>

                    {/* Controles de cantidad */}
                    <div className="flex items-center gap-3 mb-4">
                      <button
                        onClick={() => actualizarCantidad(producto.id, (cantidades[producto.id] || 1) - 1)}
                        className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
                      >
                        <Minus size={14} className="text-gray-600" />
                      </button>
                      
                      <span className="w-8 text-center font-medium text-gray-900">
                        {cantidades[producto.id] || 1}
                      </span>
                      
                      <button
                        onClick={() => actualizarCantidad(producto.id, (cantidades[producto.id] || 1) + 1)}
                        className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
                      >
                        <Plus size={14} className="text-gray-600" />
                      </button>
                    </div>

                    {/* Botón agregar al carrito */}
                    <button 
                      onClick={() => agregarAlCarrito(producto)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-colors duration-200 shadow-sm hover:shadow-md"
                    >
                      <ShoppingCart size={18} />
                      Agregar al carrito
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Información adicional */}
        <div className="mt-8 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">¿Necesitas asesoría personalizada?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Nuestros especialistas en homeopatía están disponibles para brindarte 
            recomendaciones personalizadas según tus necesidades específicas de salud.
          </p>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-8 rounded-2xl transition-colors duration-200">
            Agendar Consulta
          </button>
        </div>
      </div>
    </div>
  );
}

export default Farmacia;