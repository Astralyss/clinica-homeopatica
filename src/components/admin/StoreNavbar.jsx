import React, { useState } from 'react';
import SearchBar from '../ui/SearchBar';
import { ShoppingCart, User, Package, Menu, Tag, ChevronDown } from 'lucide-react';
import { useCategorias } from '../../utils/hooks/useCategorias';

function StoreNavbar({
  searchTerm,
  onSearchChange,
  onBuscar,
  user,
  onCartClick,
  onOrdersClick,
  cartCount = 0,
  categoria,
  onCategoriaChange,
  ...props
}) {
  const { categorias } = useCategorias();
  const [menuOpen, setMenuOpen] = useState(false);

  // Obtener el texto a mostrar
  const categoriaLabel = categoria === 'all' ? 'Todas las categorías' : categoria;
  const pad = '\u00A0\u00A0'; // dos espacios unicode

  return (
    <nav className="w-full bg-white border-b border-gray-100 shadow-md px-2 py-2 flex items-center justify-between sticky top-0 z-40">
      {/* Buscador y select: responsivo */}
      <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-2xl mx-1">
        <div className="flex flex-row gap-2 w-full">
          <SearchBar
            value={searchTerm}
            onChange={onSearchChange}
            onBuscar={onBuscar}
            placeholder="Buscar productos..."
            className="flex-1"
          />
          {/* Select custom solo en desktop */}
          {categorias.length > 0 && (
            <div className="relative hidden sm:flex items-center justify-center min-w-[180px]">
              {/* Contenedor visual custom */}
              <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700 w-full cursor-pointer select-none relative">
                <Tag size={20} className="text-gray-400 mr-2" />
                <span className="font-medium flex-1 text-left truncate">{categoriaLabel}</span>
                <ChevronDown size={18} className="text-gray-400 ml-2" />
                {/* Select nativo transparente encima */}
                <select
                  value={categoria}
                  onChange={e => onCategoriaChange(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  style={{ appearance: 'none' }}
                >
                  <option value="all">Todas las categorías</option>
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{'  '}{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Botones de usuario/carrito/compras: desktop y móvil */}
      {/* Desktop: visible, móvil: oculto */}
      <div className="hidden sm:flex items-center gap-4 ml-6">
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
          <User size={20} className="text-emerald-600" />
          <span className="hidden sm:inline text-gray-700 font-medium">{user?.nombre || 'Mi cuenta'}</span>
        </button>
        <button onClick={onOrdersClick} className="relative flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
          <Package size={20} className="text-emerald-600" />
          <span className="hidden sm:inline text-gray-700 font-medium">Mis compras</span>
        </button>
        <button onClick={onCartClick} className="relative flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
          <ShoppingCart size={20} className="text-emerald-600" />
          <span className="hidden sm:inline text-gray-700 font-medium">Carrito</span>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Móvil: menú hamburguesa */}
      <div className="sm:hidden flex items-center ml-2">
        <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-400">
          <Menu size={26} className="text-emerald-600" />
        </button>
        {/* Menú desplegable */}
        {menuOpen && (
          <div className="absolute top-16 right-4 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-48 animate-fade-in flex flex-col">
            <button className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 transition-colors w-full text-left" onClick={() => setMenuOpen(false)}>
              <User size={20} className="text-emerald-600" />
              <span className="text-gray-700 font-medium">{user?.nombre || 'Mi cuenta'}</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 transition-colors w-full text-left" onClick={() => { onOrdersClick(); setMenuOpen(false); }}>
              <Package size={20} className="text-emerald-600" />
              <span className="text-gray-700 font-medium">Mis compras</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 transition-colors w-full text-left relative" onClick={() => { onCartClick(); setMenuOpen(false); }}>
              <ShoppingCart size={20} className="text-emerald-600" />
              <span className="text-gray-700 font-medium">Carrito</span>
              {cartCount > 0 && (
                <span className="absolute right-4 top-2 bg-emerald-600 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default StoreNavbar;
