import React, { useState } from 'react';
import { Search, ShoppingCart, User, ChevronDown } from 'lucide-react';
import ProductFilters from '../ui/ProductFilters';

const EcommerceNavbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(3);

  const handleSearch = () => {
    console.log('Buscar:', searchQuery);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleAuthAction = () => {
    if (isLoggedIn) {
      // Lógica para logout
      setIsLoggedIn(false);
      setIsUserMenuOpen(false);
    } else {
      // Lógica para mostrar modal de login/registro
      console.log('Mostrar modal de login/registro');
    }
  };

  return (
    <div className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          
          {/* Logo/Nombre de la tienda */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-800">MiTienda</h1>
          </div>

          {/* Barra de búsqueda central */}
          {/* <div className="flex-1 max-w-2xl mx-8">
            <div className="relative flex">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div> */}

          

          {/* Lado derecho: Filtros, Usuario y Carrito */}
          <div className="flex items-center space-x-4">
            
            {/* Filtro "Todas" */}
            <div className="relative">
              <button className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
                <span className="text-sm">Todas</span>
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
            </div>

            {/* Botón de Usuario/Autenticación */}
            <div className="relative">
              {isLoggedIn ? (
                <div>
                  <button
                    onClick={toggleUserMenu}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span className="text-sm">Mi cuenta</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                      <div className="py-1">
                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Mi perfil</a>
                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Mis pedidos</a>
                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Configuración</a>
                        <hr className="my-1" />
                        <button
                          onClick={handleAuthAction}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Cerrar sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleAuthAction}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm">Iniciar sesión</span>
                </button>
              )}
            </div>

            {/* Botón de Registrarse (solo si no está logueado) */}
            {!isLoggedIn && (
              <button
                onClick={() => console.log('Mostrar modal de registro')}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <span className="text-sm">Registrarse</span>
              </button>
            )}

            {/* Carrito */}
            <button className="relative flex items-center text-blue-600 hover:text-blue-700 transition-colors">
              <ShoppingCart className="w-6 h-6" />
              <span className="ml-1 text-sm">Carrito</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcommerceNavbar;