import React from 'react';
import { Star, Clock, Tag, ShoppingCart } from 'lucide-react';

export default function ProductCard({ producto, onAddToCart, showPromocion = true }) {
  const calcularPrecioFinal = (producto) => {
    if (!producto.tienePromocion || !producto.precioPromocion) {
      return producto.precio;
    }
    
    // Verificar si la promoción está vigente
    const ahora = new Date();
    const inicio = producto.fechaInicioPromocion ? new Date(producto.fechaInicioPromocion) : null;
    const fin = producto.fechaFinPromocion ? new Date(producto.fechaFinPromocion) : null;
    
    // Si no hay fechas, la promoción siempre está activa
    if (!inicio && !fin) {
      return producto.precioPromocion;
    }
    
    // Si hay fechas, verificar que esté vigente
    if (inicio && fin) {
      if (ahora >= inicio && ahora <= fin) {
        return producto.precioPromocion;
      }
    } else if (inicio && !fin) {
      if (ahora >= inicio) {
        return producto.precioPromocion;
      }
    }
    
    return producto.precio;
  };

  const calcularDescuento = (producto) => {
    if (!producto.tienePromocion || !producto.precioPromocion) {
      return 0;
    }
    
    const precioOriginal = parseFloat(producto.precio);
    const precioPromocional = parseFloat(producto.precioPromocion);
    const descuento = ((precioOriginal - precioPromocional) / precioOriginal) * 100;
    
    return Math.round(descuento);
  };

  const esPromocionVigente = (producto) => {
    if (!producto.tienePromocion) return false;
    
    const ahora = new Date();
    const inicio = producto.fechaInicioPromocion ? new Date(producto.fechaInicioPromocion) : null;
    const fin = producto.fechaFinPromocion ? new Date(producto.fechaFinPromocion) : null;
    
    // Sin fechas = siempre vigente
    if (!inicio && !fin) return true;
    
    // Con fechas = verificar vigencia
    if (inicio && fin) {
      return ahora >= inicio && ahora <= fin;
    } else if (inicio && !fin) {
      return ahora >= inicio;
    }
    
    return false;
  };

  const precioFinal = calcularPrecioFinal(producto);
  const descuento = calcularDescuento(producto);
  const tienePromocionVigente = showPromocion && esPromocionVigente(producto);

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden">
      {/* Imagen del producto */}
      <div className="relative">
        {producto.imagenes && producto.imagenes.length > 0 && (
          <img
            src={producto.imagenes[0].url}
            alt={producto.nombre}
            className="w-full h-48 object-cover"
          />
        )}
        
        {/* Badge de promoción */}
        {tienePromocionVigente && (
          <div className="absolute top-3 left-3">
            <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
              -{descuento}%
            </span>
          </div>
        )}
        
        {/* Badge de tiempo limitado */}
        {tienePromocionVigente && producto.fechaFinPromocion && (
          <div className="absolute top-3 right-3">
            <div className="bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Oferta</span>
            </div>
          </div>
        )}
        
        {/* Badge de producto principal */}
        {producto.esPrincipal && (
          <div className="absolute bottom-3 left-3">
            <div className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3" />
              <span>Destacado</span>
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

        {/* Categoría */}
        <div className="mb-3">
          <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
            {producto.categoria}
          </span>
        </div>

        {/* Precios */}
        <div className="flex items-center gap-3 mb-3">
          <span className={`text-2xl font-bold ${tienePromocionVigente ? 'text-red-600' : 'text-gray-900'}`}>
            ${precioFinal}
          </span>
          {tienePromocionVigente && (
            <span className="text-lg text-gray-400 line-through">
              ${producto.precio}
            </span>
          )}
        </div>

        {/* Descripción de la promoción */}
        {tienePromocionVigente && producto.descripcionPromocion && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-3">
            <p className="text-orange-800 text-sm font-medium">
              {producto.descripcionPromocion}
            </p>
          </div>
        )}

        {/* Fechas de la promoción */}
        {tienePromocionVigente && (producto.fechaInicioPromocion || producto.fechaFinPromocion) && (
          <div className="text-xs text-gray-500 mb-3">
            {producto.fechaInicioPromocion && (
              <p>Desde: {new Date(producto.fechaInicioPromocion).toLocaleDateString()}</p>
            )}
            {producto.fechaFinPromocion && (
              <p>Hasta: {new Date(producto.fechaFinPromocion).toLocaleDateString()}</p>
            )}
          </div>
        )}

        {/* Stock */}
        <div className="mb-4">
          <span className={`text-sm ${producto.cantidad > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {producto.cantidad > 0 ? `Stock: ${producto.cantidad}` : 'Sin stock'}
          </span>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-2">
          <button 
            onClick={() => onAddToCart && onAddToCart(producto)}
            disabled={producto.cantidad === 0}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Agregar
          </button>
          
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            Ver
          </button>
        </div>
      </div>
    </div>
  );
}
