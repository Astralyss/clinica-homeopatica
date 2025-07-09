import React, { useState, useMemo } from 'react';
import { Plus, Trash2, Edit, ChevronDown, Package, User, Search, X, Filter, Grid, List, Star } from 'lucide-react';

const AdminSidebar = ({
  productos,
  seleccionado,
  handleSeleccionar,
  handlePrepararAgregar,
  handlePrepararEditar,
  handleEliminar,
  showUserMenu,
  setShowUserMenu
}) => {
  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [vistaGrid, setVistaGrid] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filtrar productos según búsqueda y categoría
  const productosFiltrados = useMemo(() => {
    return productos.filter(prod => {
      const matchesBusqueda = prod.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                             prod.categoria.toLowerCase().includes(busqueda.toLowerCase());
      const matchesCategoria = !filtroCategoria || prod.categoria === filtroCategoria;
      return matchesBusqueda && matchesCategoria;
    });
  }, [productos, busqueda, filtroCategoria]);

  // Obtener categorías únicas
  const categorias = useMemo(() => {
    return [...new Set(productos.map(prod => prod.categoria))];
  }, [productos]);

  const limpiarFiltros = () => {
    setBusqueda('');
    setFiltroCategoria('');
  };

  return (
    <aside className="relative w-full max-w-[320px] min-w-[280px] bg-gradient-to-b from-slate-50 to-white shadow-2xl border-r border-slate-200/50 flex flex-col transition-all duration-700 z-20 backdrop-blur-sm">
      {/* Header de usuario premium */}
      <div className="flex items-center gap-4 px-6 py-5 border-b border-slate-200/30 bg-gradient-to-r from-white/95 to-slate-50/95 backdrop-blur-md">
        <div className="relative">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-lg font-bold shadow-lg ring-2 ring-emerald-100">
            <User size={20} />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-base font-bold text-slate-800 truncate">Administrador</div>
          <div className="text-sm text-slate-500 truncate flex items-center gap-1">
            <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
            En línea
          </div>
        </div>
        <div className="relative">
          <button 
            className="p-2 rounded-xl hover:bg-slate-100/80 transition-all duration-200 hover:scale-105 active:scale-95" 
            onClick={() => setShowUserMenu(v => !v)}
          >
            <ChevronDown size={18} className={`text-slate-600 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
          </button>
          {showUserMenu && (
            <div className="absolute right-0 mt-3 w-52 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/50 z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
              <div className="p-2">
                <button className="w-full text-left px-4 py-3 hover:bg-slate-50/80 text-slate-700 font-medium rounded-xl transition-all duration-200 hover:translate-x-1">
                  Cambiar usuario
                </button>
                <button className="w-full text-left px-4 py-3 hover:bg-red-50/80 text-red-500 font-medium rounded-xl transition-all duration-200 hover:translate-x-1">
                  Cerrar sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Header de productos con búsqueda */}
      <div className="px-6 py-4 border-b border-slate-200/30 bg-gradient-to-r from-slate-50/50 to-white/50 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
              <Package size={16} className="text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Productos</h2>
            <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-full">
              {productosFiltrados.length}
            </span>
          </div>
          <button
            className="group bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
            title="Agregar producto"
            onClick={handlePrepararAgregar}
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* Barra de búsqueda mejorada */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-12 py-3 bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all duration-200 text-slate-700 placeholder-slate-400"
          />
          {busqueda && (
            <button
              onClick={() => setBusqueda('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Controles de filtros y vista */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                showFilters || filtroCategoria 
                  ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Filter size={16} />
              Filtros
            </button>
            {(busqueda || filtroCategoria) && (
              <button
                onClick={limpiarFiltros}
                className="flex items-center gap-1 px-2 py-1.5 text-xs text-slate-500 hover:text-slate-700 transition-colors duration-200"
              >
                <X size={14} />
                Limpiar
              </button>
            )}
          </div>
          
          <div className="flex items-center bg-slate-100 rounded-xl p-1">
            <button
              onClick={() => setVistaGrid(false)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                !vistaGrid ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setVistaGrid(true)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                vistaGrid ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Grid size={16} />
            </button>
          </div>
        </div>

        {/* Panel de filtros */}
        {showFilters && (
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 animate-in slide-in-from-top-2 duration-300">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Categoría</label>
                <select
                  value={filtroCategoria}
                  onChange={(e) => setFiltroCategoria(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all duration-200 text-slate-700"
                >
                  <option value="">Todas las categorías</option>
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lista de productos premium */}
      <div className="flex-1 overflow-y-auto px-4 py-6 bg-gradient-to-b from-slate-50/30 to-white/30">
        {productosFiltrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <Package size={24} className="text-slate-400" />
            </div>
            <p className="text-slate-500 font-medium">
              {productos.length === 0 ? 'No hay productos' : 'No se encontraron productos'}
            </p>
            <p className="text-sm text-slate-400 mt-1">
              {productos.length === 0 ? 'Agrega tu primer producto' : 'Intenta cambiar los filtros'}
            </p>
          </div>
        ) : (
          <div className={vistaGrid ? 'grid grid-cols-1 gap-4' : 'space-y-4'}>
            {productosFiltrados.map(prod => (
              <div
                key={prod.id}
                className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
                  seleccionado && seleccionado.id === prod.id 
                    ? 'bg-gradient-to-r from-emerald-50 to-teal-50 ring-2 ring-emerald-500/30 shadow-lg' 
                    : 'bg-white/80 backdrop-blur-sm hover:bg-white shadow-md border border-slate-200/50'
                }`}
                onClick={() => handleSeleccionar(prod)}
              >
                {/* Efecto de brillo */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                <div className="relative flex items-center justify-between p-5">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`font-bold text-lg truncate transition-colors duration-200 ${
                        seleccionado && seleccionado.id === prod.id ? 'text-emerald-700' : 'text-slate-800 group-hover:text-emerald-600'
                      }`}>
                        {prod.nombre}
                      </h3>
                      {prod.destacado && (
                        <Star size={16} className="text-amber-400 fill-current ml-2 flex-shrink-0" />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-sm font-medium transition-colors duration-200 ${
                        seleccionado && seleccionado.id === prod.id ? 'text-emerald-600' : 'text-slate-500 group-hover:text-slate-600'
                      }`}>
                        {prod.categoria}
                      </span>
                      {prod.precio && (
                        <span className="text-sm font-bold text-emerald-600">
                          ${prod.precio}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-200 ${
                        seleccionado && seleccionado.id === prod.id 
                          ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200' 
                          : 'bg-slate-100 text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-600'
                      }`}>
                        <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                        {prod.imagenes?.length || 0} imagen{prod.imagenes?.length !== 1 ? 'es' : ''}
                      </span>
                      
                      {prod.stock !== undefined && (
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${
                          prod.stock > 0 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          Stock: {prod.stock}
                        </span>
                      )}
                      
                      {seleccionado && seleccionado.id === prod.id && (
                        <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm animate-in slide-in-from-left-2 duration-300">
                          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                          Seleccionado
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex gap-1 ml-4">
                    <button
                      className="group/btn p-2.5 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200 hover:scale-110 active:scale-95"
                      title="Editar producto"
                      onClick={e => { e.stopPropagation(); handlePrepararEditar(prod); }}
                    >
                      <Edit size={18} className="group-hover/btn:rotate-12 transition-transform duration-200" />
                    </button>
                    <button
                      className="group/btn p-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 hover:scale-110 active:scale-95"
                      title="Eliminar producto"
                      onClick={e => { e.stopPropagation(); handleEliminar(prod.id); }}
                    >
                      <Trash2 size={18} className="group-hover/btn:rotate-12 transition-transform duration-200" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default AdminSidebar;