import React, { useState, useRef } from 'react';
import { Search as SearchIcon } from 'lucide-react';

function SearchBar({
  value,
  onChange,
  onBuscar,
  placeholder = 'Buscar...',
  categoria = 'all',
  categorias = [],
  onCategoriaChange,
  onSuggestionSelect,
  className = '',
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const debounceRef = useRef();

  // Manejo de cambios en el input y fetch de sugerencias
  const handleInputChange = (e) => {
    const val = e.target.value;
    onChange(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!val) {
      setSuggestions([]);
      return;
    }
    setLoadingSuggestions(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/productos/busqueda?search=${encodeURIComponent(val)}&categoria=${categoria}`);
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
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onBuscar(value);
      setSuggestions([]);
    }
  };

  const handleBuscarClick = () => {
    onBuscar(value);
    setSuggestions([]);
  };

  const handleSuggestionClick = (s) => {
    onChange(s);
    onBuscar(s);
    setSuggestions([]);
    if (onSuggestionSelect) onSuggestionSelect(s);
  };

  return (
    <div className={`relative w-full flex gap-2 items-center ${className}`}>
      {/* Select de categorías (no se modifica aquí) */}
      {/* Input de búsqueda */}
      <div className="relative w-full">
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 pr-10"
          autoComplete="off"
        />
        <button
          onClick={handleBuscarClick}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-lg text-sm flex items-center justify-center"
          style={{ height: 32, width: 32 }}
          aria-label="Buscar"
        >
          <SearchIcon size={18} />
        </button>
        {loadingSuggestions && (
          <div className="absolute left-0 right-0 bg-white border border-t-0 border-gray-200 rounded-b-lg shadow z-10 p-2 text-center text-xs text-gray-500">
            Cargando sugerencias...
          </div>
        )}
        {suggestions.length > 0 && !loadingSuggestions && (
          <ul className="absolute left-0 right-0 bg-white border border-t-0 border-gray-200 rounded-b-lg shadow z-10 max-h-48 overflow-y-auto">
            {suggestions.map((s, i) => (
              <li
                key={i}
                className="px-4 py-2 hover:bg-emerald-50 cursor-pointer text-sm"
                onClick={() => handleSuggestionClick(s)}
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default SearchBar; 