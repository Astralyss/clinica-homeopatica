import React from 'react';
import { X, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';

export default function CartPanel({ open, onClose, productos = [], onAdd, onRemove, onDelete }) {
  return (
    <div className={`fixed inset-0 z-50 transition-all duration-300 ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      {/* Fondo oscuro */}
      <div
        className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
        aria-hidden={!open}
      />
      {/* Panel lateral */}
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl border-l border-gray-100 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
        aria-modal="true"
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <ShoppingCart size={22} className="text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Carrito</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all duration-200 border border-transparent hover:border-gray-200"
            aria-label="Cerrar panel"
          >
            <X size={20} />
          </button>
        </div>
        {/* Productos en el carrito */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {productos.length === 0 ? (
            <div className="text-center text-gray-500 py-16">
              <ShoppingCart size={40} className="mx-auto mb-4 text-gray-300" />
              <p>Tu carrito está vacío.</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {productos.map((p, idx) => (
                <li key={p.id || idx} className="flex gap-4 items-center border-b border-gray-100 pb-4 last:border-b-0">
                  <img src={p.imagen || '/productos/placeholder.png'} alt={p.nombre} className="w-16 h-16 object-contain rounded-lg bg-gray-50 border border-gray-100" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{p.nombre}</h3>
                    <div className="text-xs text-gray-500 truncate">{p.presentacion}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => onRemove(p)} className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-blue-600 transition"><Minus size={14} /></button>
                      <span className="px-2 text-base font-semibold text-gray-800">{p.cantidad}</span>
                      <button onClick={() => onAdd(p)} className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-blue-600 transition"><Plus size={14} /></button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-base font-bold text-blue-700">${p.precio}</span>
                    <button onClick={() => onDelete(p)} className="p-1.5 rounded-full bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-700 transition"><Trash2 size={16} /></button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Footer */}
        <div className="px-6 py-5 border-t border-gray-100 bg-white">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md text-base flex items-center justify-center gap-2">
            <ShoppingCart size={18} /> Ver carrito completo
          </button>
        </div>
      </aside>
    </div>
  );
} 