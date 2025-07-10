// components/admin/ProductCard.jsx
"use client"
import React, { useState } from 'react'
import { Edit, Trash2, Eye, Copy, Package, Calendar, Tag, Image as ImageIcon } from 'lucide-react'

function ProductCard({ product, onEdit, onDelete, onView, onDuplicate, viewMode = 'grid' }) {
  const [imgError, setImgError] = useState(false)

  // Función para formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price)
  }

  // Función para formatear fecha
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Función para obtener el estado del producto
  const getStatusBadge = (status) => {
    const isActive = status === 'active' || status === true
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
        isActive 
          ? 'bg-white border-gray-800 text-gray-800' 
          : 'bg-gray-100 border-gray-400 text-gray-600'
      }`}>
        {isActive ? 'Activo' : 'Inactivo'}
      </span>
    )
  }

  // Renderizado de la imagen o ícono
  const renderImage = () => {
    if (!product.image || imgError) {
      return <ImageIcon className="text-gray-400" size={48} />
    }
    return (
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        onError={() => setImgError(true)}
      />
    )
  }

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 group">
        <div className="p-6 flex items-center gap-6">
          {/* Imagen */}
          <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center bg-gray-50 shadow-inner">
            {renderImage()}
          </div>
          {/* Información del producto */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-gray-900 truncate text-lg">{product.title}</h3>
              {getStatusBadge(product.status)}
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Tag size={14} className="text-gray-400" />
                <span>{product.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-gray-400" />
                <span>{formatDate(product.fechaCreacion)}</span>
              </div>
            </div>
          </div>
          {/* Precio */}
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">{formatPrice(product.price)}</p>
          </div>
          {/* Acciones */}
          <div className="flex items-center gap-1">
            <button 
              onClick={() => onView(product)}
              className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all duration-200 hover:shadow-md"
              title="Ver detalles"
            >
              <Eye size={18} />
            </button>
            <button 
              onClick={() => onEdit(product)}
              className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all duration-200 hover:shadow-md"
              title="Editar"
            >
              <Edit size={18} />
            </button>
            <button 
              onClick={() => onDelete(product)}
              className="p-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:shadow-md"
              title="Eliminar"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Vista de cuadrícula (por defecto)
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 group hover:-translate-y-1">
      {/* Imagen */}
      <div className="aspect-square overflow-hidden bg-gray-50 flex items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        {renderImage()}
      </div>
      {/* Contenido */}
      <div className="p-5">
        {/* Header con estado */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-gray-900 text-base leading-tight line-clamp-2 flex-1 group-hover:text-gray-700 transition-colors">
            {product.title}
          </h3>
        </div>
        {/* Estado */}
        <div className="mb-4">
          {getStatusBadge(product.status)}
        </div>
        {/* Categoría */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Tag size={14} className="text-gray-400" />
          <span className="truncate">{product.category}</span>
        </div>
        {/* Precio */}
        <p className="text-2xl font-bold text-gray-900 mb-4">{formatPrice(product.price)}</p>
        {/* Fecha de creación */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Calendar size={14} className="text-gray-400" />
          <span>{formatDate(product.fechaCreacion)}</span>
        </div>
        {/* Botones de acción */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <button 
            onClick={() => onView(product)}
            className="flex items-center justify-center gap-2 bg-gray-900 text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-all duration-200 text-sm font-medium hover:shadow-lg"
          >
            <Eye size={16} />
            Ver
          </button>
          <button 
            onClick={() => onEdit(product)}
            className="flex items-center justify-center gap-2 bg-gray-100 text-gray-900 py-3 px-4 rounded-lg hover:bg-gray-200 transition-all duration-200 text-sm font-medium hover:shadow-md"
          >
            <Edit size={16} />
            Editar
          </button>
        </div>
        {/* Botón eliminar */}
        <div className="flex gap-2">
          <button 
            onClick={() => onDelete(product)}
            className="flex-1 bg-white border border-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2 hover:shadow-md"
          >
            <Trash2 size={14} />
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard