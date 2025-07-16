import React from 'react';
import SearchBar from '../ui/SearchBar';
import { ShoppingCart, User, Package } from 'lucide-react';
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

  return (
    <nav className="w-full bg-white border-b border-gray-100 shadow-sm px-4 py-2 flex items-center justify-between sticky top-0 z-40">
      {/* Contenedor de búsqueda y select juntos */}
      <div className="flex-1 max-w-lg flex items-center gap-2">
        <SearchBar
          value={searchTerm}
          onChange={onSearchChange}
          onBuscar={onBuscar}
          placeholder="Buscar productos..."
        />
        {/* Select de categorías justo a la derecha de la barra de búsqueda */}
        {categorias.length > 0 && (
          <select
            value={categoria}
            onChange={e => onCategoriaChange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white text-gray-700 min-w-[140px]"
            style={{ minWidth: 140 }}
          >
            <option value="all">Todas</option>
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        )}
      </div>
      {/* Derecha: usuario, carrito, compras */}
      <div className="flex items-center gap-4 ml-6">
        {/* Sesión de usuario */}
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
          <User size={20} className="text-emerald-600" />
          <span className="hidden sm:inline text-gray-700 font-medium">{user?.nombre || 'Mi cuenta'}</span>
        </button>
        {/* Compras realizadas */}
        <button onClick={onOrdersClick} className="relative flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
          <Package size={20} className="text-emerald-600" />
          <span className="hidden sm:inline text-gray-700 font-medium">Mis compras</span>
        </button>
        {/* Carrito */}
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
    </nav>
  );
}

export default StoreNavbar;
