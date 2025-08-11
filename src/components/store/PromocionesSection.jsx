import React from 'react';
import { usePromociones } from '@/utils/hooks/usePromociones';
import { Star, Clock, Tag } from 'lucide-react';

export default function PromocionesSection() {
  const { 
    productosPromocion, 
    loading, 
    error, 
    calcularPrecioFinal, 
    calcularDescuento,
    esPromocionVigente 
  } = usePromociones();

  if (loading) {
    return (
      <div className="py-12 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando promociones...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">Error al cargar promociones: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!productosPromocion || productosPromocion.length === 0) {
    return null; // No mostrar nada si no hay promociones
  }

  return (
    <section className="py-12 bg-gradient-to-r from-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header de la sección */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Tag className="w-8 h-8 text-orange-600" />
            <h2 className="text-3xl font-bold text-gray-900">
              ¡Ofertas Especiales!
            </h2>
            <Tag className="w-8 h-8 text-orange-600" />
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre nuestros productos con descuentos increíbles. 
            ¡Aprovecha estas ofertas por tiempo limitado!
          </p>
        </div>

        {/* Grid de productos en promoción */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productosPromocion.map((producto) => {
            const precioFinal = calcularPrecioFinal(producto);
            const descuento = calcularDescuento(producto);
            const esVigente = esPromocionVigente(producto);
            
            if (!esVigente) return null; // No mostrar productos con promociones expiradas

            return (
              <div 
                key={producto.id} 
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-orange-100"
              >
                {/* Badge de descuento */}
                <div className="relative">
                  {producto.imagenes && producto.imagenes.length > 0 && (
                    <img
                      src={producto.imagenes[0].url}
                      alt={producto.nombre}
                      className="w-full h-48 object-cover rounded-t-xl"
                    />
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                      -{descuento}%
                    </span>
                  </div>
                  {producto.fechaFinPromocion && (
                    <div className="absolute top-3 right-3">
                      <div className="bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Oferta</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Información del producto */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
                    {producto.nombre}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {producto.descripcion}
                  </p>

                  {/* Precios */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl font-bold text-orange-600">
                      ${precioFinal}
                    </span>
                    <span className="text-lg text-gray-400 line-through">
                      ${producto.precio}
                    </span>
                  </div>

                  {/* Descripción de la promoción */}
                  {producto.descripcionPromocion && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-3">
                      <p className="text-orange-800 text-sm font-medium">
                        {producto.descripcionPromocion}
                      </p>
                    </div>
                  )}

                  {/* Fechas de la promoción */}
                  {(producto.fechaInicioPromocion || producto.fechaFinPromocion) && (
                    <div className="text-xs text-gray-500 mb-3">
                      {producto.fechaInicioPromocion && (
                        <p>Desde: {new Date(producto.fechaInicioPromocion).toLocaleDateString()}</p>
                      )}
                      {producto.fechaFinPromocion && (
                        <p>Hasta: {new Date(producto.fechaFinPromocion).toLocaleDateString()}</p>
                      )}
                    </div>
                  )}

                  {/* Botón de acción */}
                  <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                    Ver Producto
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mensaje si no hay promociones vigentes */}
        {productosPromocion.filter(p => esPromocionVigente(p)).length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">
              No hay promociones activas en este momento.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              ¡Vuelve pronto para nuevas ofertas!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
