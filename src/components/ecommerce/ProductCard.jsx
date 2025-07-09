import React from 'react';
import { Edit, Trash2, Image } from 'lucide-react';

const ProductCard = ({ producto, onEdit, onDelete, onSelect }) => {
  // Obtener imagen principal
  const imagenPrincipal = producto.imagenes && producto.imagenes.length > 0
    ? producto.imagenes.find(img => img.esPrincipal) || producto.imagenes[0]
    : null;

  return (
    <div
      className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 flex flex-col gap-2 hover:shadow-lg transition-all duration-200 cursor-pointer group"
      onClick={() => onSelect && onSelect(producto)}
    >
      {/* Imagen del producto */}
      <div className="relative w-full h-32 bg-gray-100 rounded-xl overflow-hidden mb-3">
        {imagenPrincipal ? (
          <img
            src={imagenPrincipal.url}
            alt={producto.nombre}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div 
          className={`w-full h-full flex items-center justify-center ${imagenPrincipal ? 'hidden' : 'flex'}`}
        >
          <div className="text-center">
            <Image size={24} className="text-gray-400 mx-auto mb-1" />
            <p className="text-gray-500 text-xs">Sin imagen</p>
          </div>
        </div>
      </div>

      <div className="font-bold text-gray-800 text-lg truncate group-hover:text-gray-700 transition-colors">
        {producto.nombre}
      </div>
      <div className="text-sm text-gray-400 truncate group-hover:text-gray-600 transition-colors">
        {producto.categoria}
      </div>
      <div className="flex items-center gap-2 mt-2">
        <button
          className="text-gray-400 hover:text-gray-700 p-1 rounded transition-colors"
          title="Editar"
          onClick={e => { e.stopPropagation(); onEdit && onEdit(producto); }}
        >
          <Edit size={18} />
        </button>
        <button
          className="text-gray-300 hover:text-red-500 p-1 rounded transition-colors"
          title="Eliminar"
          onClick={e => { e.stopPropagation(); onDelete && onDelete(producto.id); }}
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default ProductCard; 