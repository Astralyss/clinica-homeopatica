"use client"
import React, { useState, useEffect } from 'react'
import { Plus, Search, Filter, Grid3X3, List, Package, SlidersHorizontal, Loader2, Boxes, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import ProductCard from '@/components/admin/products/ProductCard'
import { useProductos } from '@/utils/hooks/useProductos'
import ProductSidePanel from '@/components/admin/products/ProductSidePanel'
import ProductFilters from '@/components/ui/ProductFilters'
import { useCategorias } from '@/utils/hooks/useCategorias'


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

  // Restaurar lógica de productos principales
  const productosPrincipales = productos.filter(p => p.esPrincipal);
  const numPrincipales = productosPrincipales.length;
  const maxPrincipales = 6;

  // Restaurar función para marcar/desmarcar como principal
  const handleTogglePrincipal = async (product) => {
    const nuevoEstado = !product.esPrincipal;
    // Si está intentando marcar como principal y ya hay 6, no permitir
    if (nuevoEstado && numPrincipales >= maxPrincipales) {
      alert('Ya hay 6 productos principales. Desmarca uno para poder marcar otro.');
      return;
    }
    try {
      const resultado = await actualizarProducto(product.id, {
        nombre: product.nombre,
        categoria: product.categoria,
        precio: product.precio,
        presentacion: product.presentacion,
        descripcion: product.descripcion,
        beneficios: product.beneficios,
        id_producto: product.id_producto,
        cantidad: product.cantidad,
        esPrincipal: nuevoEstado,
        activo: product.activo,
        imagenes: product.imagenes || []
      });
      if (resultado.success) {
        console.log(`Producto ${nuevoEstado ? 'marcado' : 'desmarcado'} como principal`);
      } else {
        alert('Error al actualizar el producto: ' + resultado.error);
      }
    } catch (error) {
      console.error('Error al cambiar estado principal:', error);
      alert('Error al actualizar el producto');
    }
  };

  // NUEVO: hooks para categorías y sugerencias
  const { categorias } = useCategorias();
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [sidePanelMode, setSidePanelMode] = useState('nuevo'); // 'nuevo', 'editar', 'ver'
  const [sidePanelProducto, setSidePanelProducto] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('total'); // 'total', 'activos', 'inactivos', 'sinStock'

  // Sugerencias debounced (igual que farmacia)
  const debounceRef = React.useRef();
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
    buscarProductos(val, selectedCategory);
  };

  // Selección de sugerencia
  const handleSuggestionSelect = (s) => {
    setInputValue(s);
    setSearchTerm(s);
    setSuggestions([]);
    buscarProductos(s, selectedCategory);
  };

  // Filtrar productos por estado
  const productosFiltradosPorEstado = productos.filter(product => {
    if (selectedStatus === 'activos') return product.activo;
    if (selectedStatus === 'inactivos') return !product.activo;
    if (selectedStatus === 'sinStock') return product.cantidad <= 5;
    return true; // total
  });

  // Filtrar productos localmente para búsqueda en tiempo real
  const filteredProducts = productosFiltradosPorEstado.filter(product => {
    const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.descripcion && product.descripcion.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || product.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between w-full">
            {/* NUEVO: Barra de búsqueda y categorías tipo farmacia */}
            <div className="flex-1 min-w-0 mt-9">
              <ProductFilters
                searchTerm={inputValue}
                onSearchChange={handleInputChange}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                categories={categorias}
                suggestions={suggestions}
                loadingSuggestions={loadingSuggestions}
                onBuscar={handleBuscar}
                onSuggestionSelect={handleSuggestionSelect}
              />
            </div>
            {/* View Mode Toggle alineado verticalmente */}
            <div className="flex items-center h-[56px] md:h-auto gap-2 bg-gray-100 p-1 rounded-lg self-center md:self-auto">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                aria-label="Vista de cuadrícula"
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
                aria-label="Vista de lista"
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total */}
          <button
            className={`bg-white p-6 rounded-xl shadow-sm border text-left transition-all duration-200 ${selectedStatus === 'total' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-blue-200'}`}
            onClick={() => setSelectedStatus('total')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Boxes className="text-blue-500" size={18} />
                  Total Productos
                </p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Boxes className="text-blue-600" size={24} />
              </div>
            </div>
          </button>
          {/* Activos */}
          <button
            className={`bg-white p-6 rounded-xl shadow-sm border text-left transition-all duration-200 ${selectedStatus === 'activos' ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-200 hover:border-green-200'}`}
            onClick={() => setSelectedStatus('activos')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <CheckCircle className="text-green-500" size={18} />
                  Productos Activos
                </p>
                <p className="text-2xl font-bold text-green-600">{estadisticas.activos}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>
          </button>
          {/* Inactivos */}
          <button
            className={`bg-white p-6 rounded-xl shadow-sm border text-left transition-all duration-200 ${selectedStatus === 'inactivos' ? 'border-orange-500 ring-2 ring-orange-200' : 'border-gray-200 hover:border-orange-200'}`}
            onClick={() => setSelectedStatus('inactivos')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <XCircle className="text-orange-500" size={18} />
                  Productos Inactivos
                </p>
                <p className="text-2xl font-bold text-orange-600">{estadisticas.inactivos}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <XCircle className="text-orange-500" size={24} />
              </div>
            </div>
          </button>
          {/* Sin Stock */}
          <button
            className={`bg-white p-6 rounded-xl shadow-sm border text-left transition-all duration-200 ${selectedStatus === 'sinStock' ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-200 hover:border-red-200'}`}
            onClick={() => setSelectedStatus('sinStock')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <AlertTriangle className="text-red-500" size={18} />
                  Sin Stock
                </p>
                <p className="text-2xl font-bold text-red-600">{estadisticas.sinStock}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="text-red-500" size={24} />
              </div>
            </div>
          </button>
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
                onTogglePrincipal={handleTogglePrincipal}
                disablePrincipalToggle={numPrincipales >= maxPrincipales}
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
        producto={{
          ...sidePanelProducto,
          numPrincipales: numPrincipales
        }}
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