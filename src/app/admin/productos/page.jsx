"use client"
import React, { useState, useEffect } from 'react'
import { Plus, Search, Filter, Grid3X3, List, Package, SlidersHorizontal, Loader2 } from 'lucide-react'
import ProductCard from '@/components/admin/products/ProductCard'
import { useProductos } from '@/utils/hooks/useProductos'
import ProductSidePanel from '@/components/admin/products/ProductSidePanel'


const placeholderIMG = '/globe.svg' 



function ProductosAdmin() {
  const {
    productos,
    estadisticas,
    loading,
    error,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    buscarProductos
  } = useProductos()

  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [sidePanelOpen, setSidePanelOpen] = useState(false)
  const [sidePanelMode, setSidePanelMode] = useState('nuevo') // 'nuevo', 'editar', 'ver'
  const [sidePanelProducto, setSidePanelProducto] = useState(null)

  // Obtener categorías únicas de los productos reales
  const categories = [...new Set(productos.map(p => p.categoria))]

  // Filtrar productos localmente para búsqueda en tiempo real
  const filteredProducts = productos.filter(product => {
    const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.descripcion && product.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || product.categoria === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Buscar productos en el servidor cuando cambie el término de búsqueda
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm || selectedCategory !== 'all') {
        buscarProductos(searchTerm, selectedCategory)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, selectedCategory, buscarProductos])

  const handleEdit = async (product) => {
    setSidePanelMode('editar')
    setSidePanelProducto(product)
    setSidePanelOpen(true)
  }

  const handleDelete = async (product) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      const resultado = await eliminarProducto(product.id)
      if (resultado.success) {
        console.log('Producto eliminado exitosamente')
      } else {
        alert('Error al eliminar el producto: ' + resultado.error)
      }
    }
  }

  const handleView = (product) => {
    setSidePanelMode('ver')
    setSidePanelProducto(product)
    setSidePanelOpen(true)
  }

  const handleDuplicate = (product) => {
    console.log('Duplicar:', product)
    // Lógica para duplicar
  }

  const handleAddProduct = () => {
    setSidePanelMode('nuevo')
    setSidePanelProducto(null)
    setSidePanelOpen(true)
  }

  // Función para obtener imagen principal
  const getMainImage = (product) => {
    if (product.imagenes && product.imagenes.length > 0) {
      const principal = product.imagenes.find(img => img.esPrincipal)
      return principal ? principal.url : product.imagenes[0].url
    }
    return product.imagenUrl || placeholderIMG
  }

  // Función para formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Productos
              </h1>
              <p className="text-gray-600 mt-1">
                Gestiona tu inventario de productos
              </p>
            </div>
            
            <button 
              onClick={handleAddProduct}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Plus size={20} />
              Nuevo Producto
            </button>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Search and Filters */}
            <div className="flex flex-1 gap-3 max-w-xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg transition-all duration-200 ${
                  showFilters 
                    ? 'bg-blue-50 border-blue-200 text-blue-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <SlidersHorizontal size={18} />
                Filtros
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid3X3 size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List size={18} />
              </button>
            </div>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <Filter size={16} className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Categoría:</span>
                </div>
                
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Todas las categorías</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Productos</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="text-blue-600" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Productos Activos</p>
                <p className="text-2xl font-bold text-green-600">{estadisticas.activos}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <div className="w-6 h-6 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Productos Inactivos</p>
                <p className="text-2xl font-bold text-orange-600">{estadisticas.inactivos}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <div className="w-6 h-6 bg-orange-500 rounded-full"></div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sin Stock</p>
                <p className="text-2xl font-bold text-red-600">{estadisticas.sinStock}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <div className="w-6 h-6 bg-red-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <Loader2 className="animate-spin text-blue-600" size={24} />
              <span className="text-gray-600">Cargando productos...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">Error: {error}</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && filteredProducts.length > 0 ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5' 
              : 'grid-cols-1'
          }`}>
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  title: product.nombre,
                  price: product.precio,
                  image: getMainImage(product),
                  category: product.categoria,
                  status: product.activo ? 'active' : 'inactive'
                }}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                onDuplicate={handleDuplicate}
                viewMode={viewMode}
              />
            ))}
          </div>
        ) : !loading && (
          /* Empty State */
          <div className="text-center py-16">
            <div className="max-w-sm mx-auto">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Package className="text-gray-400" size={32} />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm || selectedCategory !== 'all' ? 'No se encontraron productos' : 'No hay productos aún'}
              </h3>
              
              <p className="text-gray-600 mb-8">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Comienza creando tu primer producto para empezar a vender'
                }
              </p>
              
              {!(searchTerm || selectedCategory !== 'all') && (
                <button 
                  onClick={handleAddProduct}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <Plus size={20} />
                  Crear Primer Producto
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Panel lateral para agregar/editar/ver producto */}
      <ProductSidePanel
        open={sidePanelOpen}
        onClose={() => setSidePanelOpen(false)}
        modo={sidePanelMode}
        producto={sidePanelProducto}
        onSave={async (data) => {
          if (sidePanelMode === 'editar' && sidePanelProducto) {
            await actualizarProducto(sidePanelProducto.id, data)
          } else {
            await crearProducto(data)
          }
          setSidePanelOpen(false)
        }}
        onEdit={handleEdit}
      />
    </div>
  )
}

export default ProductosAdmin