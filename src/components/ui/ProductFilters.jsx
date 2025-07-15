import React, { useState, useRef } from 'react';
import { Search, Tag, X, ChevronDown } from 'lucide-react';

export default function ProductFilters({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories = [],
  placeholder = 'Buscar productos...',
  suggestions = [],
  onBuscar,
  onSuggestionSelect,
  loadingSuggestions = false
}) {
  const [inputValue, setInputValue] = useState(searchTerm || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isCategoryFocused, setIsCategoryFocused] = useState(false);
  const inputRef = useRef();

  // Actualiza el input y notifica al padre para sugerencias
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    onSearchChange && onSearchChange(e.target.value);
    setShowSuggestions(true);
  };

  // Buscar al dar Enter o clic en botón
  const handleBuscar = (e) => {
    e.preventDefault();
    onBuscar && onBuscar(inputValue);
    setShowSuggestions(false);
  };

  // Selección de sugerencia
  const handleSuggestionClick = (s) => {
    setInputValue(s);
    setShowSuggestions(false);
    onSuggestionSelect && onSuggestionSelect(s);
    onBuscar && onBuscar(s);
  };

  // Cierra sugerencias al perder foco
  const handleBlur = (e) => {
    setTimeout(() => setShowSuggestions(false), 150);
  };

  // Limpiar búsqueda
  const clearSearch = () => {
    setInputValue('');
    onSearchChange && onSearchChange('');
    inputRef.current?.focus();
  };

  return (
    <div className="w-full mb-8">
      {/* Contenedor principal limpio y minimal */}
      <div >
        {/* Efecto sutil de profundidad */}
        {/* <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50/30 rounded-xl"></div> */}
        
        <div className="relative z-10 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center w-full">
          {/* Input de búsqueda con efectos glassmorphism */}
          <div className="relative flex-1 min-w-0 group">
            <div className={`relative overflow-hidden rounded-lg border transition-all duration-300 ${
              isSearchFocused 
                ? 'shadow-lg border-blue-500/50 bg-white' 
                : 'shadow-sm border-gray-200 bg-white hover:shadow-md hover:border-gray-300'
            }`}>
              {/* Fondo limpio */}
              <div className="absolute inset-0 bg-white"></div>
              
              {/* Icono de búsqueda con animación */}
              <Search 
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none transition-all duration-300 ${
                  isSearchFocused ? 'text-blue-500' : 'text-gray-400'
                }`} 
                size={18} 
              />
              
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => {
                  setIsSearchFocused(true);
                  setShowSuggestions(true);
                }}
                onBlur={(e) => {
                  setIsSearchFocused(false);
                  handleBlur(e);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleBuscar(e);
                  }
                }}
                placeholder={placeholder}
                className="relative w-full pl-12 pr-20 py-3.5 bg-transparent border-0 outline-none text-gray-700 placeholder-gray-400 text-base font-medium transition-all duration-300"
              />
              
              {/* Botones de acción */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {/* Botón limpiar */}
                {inputValue && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-all duration-200"
                  >
                    <X size={16} />
                  </button>
                )}
                
                {/* Botón buscar */}
                <button
                  type="button"
                  onClick={handleBuscar}
                  className="relative overflow-hidden bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-md px-3.5 py-2 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                >
                  <Search size={16} />
                </button>
              </div>
            </div>
            
            {/* Sugerencias mejoradas */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-30 max-h-60 overflow-y-auto animate-in slide-in-from-top-2 duration-200">
                {loadingSuggestions && (
                  <div className="px-4 py-3 text-gray-500 text-sm flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                    Buscando...
                  </div>
                )}
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 text-gray-700 text-sm transition-all duration-150 border-b border-gray-100 last:border-b-0 first:rounded-t-lg last:rounded-b-lg"
                    onMouseDown={() => handleSuggestionClick(s)}
                  >
                    <div className="flex items-center gap-2">
                      <Search size={14} className="text-gray-400" />
                      <span className="font-medium">{s}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Select de categorías con diseño premium */}
          <div className="relative min-w-[200px] lg:min-w-[240px] group">
            <div className={`relative overflow-hidden rounded-lg border transition-all duration-300 ${
              isCategoryFocused 
                ? 'shadow-lg border-blue-500/50 bg-white' 
                : 'shadow-sm border-gray-200 bg-white hover:shadow-md hover:border-gray-300'
            }`}>
              {/* Fondo limpio */}
              <div className="absolute inset-0 bg-white"></div>
              
              {/* Icono de categoría */}
              <Tag 
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none transition-all duration-300 ${
                  isCategoryFocused ? 'text-blue-500' : 'text-gray-400'
                }`} 
                size={18} 
              />
              
              <select
                value={selectedCategory}
                onChange={e => onCategoryChange(e.target.value)}
                onFocus={() => setIsCategoryFocused(true)}
                onBlur={() => setIsCategoryFocused(false)}
                className="relative w-full pl-12 pr-12 py-3.5 bg-transparent border-0 outline-none text-gray-700 text-base font-medium appearance-none cursor-pointer transition-all duration-300"
              >
                <option value="all">Todas las categorías</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              {/* Flecha personalizada */}
              <ChevronDown 
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none transition-all duration-300 ${
                  isCategoryFocused ? 'text-blue-500 rotate-180' : 'text-gray-400'
                }`} 
                size={18} 
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Indicador de filtros activos - versión limpia */}
      {(inputValue || selectedCategory !== 'all') && (
        <div className="mt-4 flex flex-wrap gap-2 animate-in slide-in-from-bottom-2 duration-200">
          {inputValue && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md text-sm font-medium border border-blue-200">
              <Search size={14} />
              Búsqueda: "{inputValue}"
              <button
                onClick={clearSearch}
                className="ml-1 p-0.5 hover:bg-blue-100 rounded-full transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          )}
          {selectedCategory !== 'all' && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 text-gray-700 rounded-md text-sm font-medium border border-gray-200">
              <Tag size={14} />
              Categoría: {selectedCategory}
              <button
                onClick={() => onCategoryChange('all')}
                className="ml-1 p-0.5 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}