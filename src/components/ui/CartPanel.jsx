import React from 'react';
import { X, ShoppingCart, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function CartPanel({ open, onClose, productos = [], onAdd, onRemove, onDelete }) {
  const router = useRouter();

  // Calcular total del carrito
  const total = productos.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);
  const totalItems = productos.reduce((sum, p) => sum + p.cantidad, 0);

  // Formatear precio
  const formatPrice = (price) =>
    new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(price);

  // Navegar al carrito completo
  const handleVerCarritoCompleto = () => {
    onClose();
    router.push('/farmacia/carrito');
  };

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
            <ShoppingCart size={22} className="text-emerald-600" />
            <h2 className="text-lg font-semibold text-gray-900">Carrito</h2>
            {totalItems > 0 && (
              <span className="bg-emerald-600 text-white text-xs rounded-full px-2 py-1 font-bold">
                {totalItems}
              </span>
            )}
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
              <p className="text-sm mt-2">Agrega productos para comenzar</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {productos.map((p, idx) => (
                <li key={p.id || idx} className="flex gap-4 items-center border-b border-gray-100 pb-4 last:border-b-0">
                  {/* Imagen del producto */}
                  <div className="relative w-16 h-16 bg-gray-50 rounded-lg border border-gray-100 overflow-hidden flex-shrink-0">
                    <Image
                      src={p.imagenes && p.imagenes.length > 0 ? p.imagenes[0].url : '/productos/placeholder.png'}
                      alt={p.nombre}
                      fill
                      className="object-contain"
                      sizes="64px"
                    />
                  </div>
                  
                  {/* Información del producto */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{p.nombre}</h3>
                    <div className="text-xs text-gray-500 truncate">{p.presentacion}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <button 
                        onClick={() => onRemove(p)} 
                        className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-emerald-600 transition"
                        disabled={p.cantidad <= 1}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-2 text-base font-semibold text-gray-800">{p.cantidad}</span>
                      <button 
                        onClick={() => onAdd(p)} 
                        className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-emerald-600 transition"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Precio y botón eliminar */}
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-base font-bold text-emerald-700">{formatPrice(p.precio * p.cantidad)}</span>
                    <button 
                      onClick={() => onDelete(p)} 
                      className="p-1.5 rounded-full bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-700 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Footer con total y botón */}
        <div className="px-6 py-5 border-t border-gray-100 bg-white">
          {productos.length > 0 && (
            <div className="mb-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total:</span>
                <span className="text-emerald-700">{formatPrice(total)}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
              </p>
            </div>
          )}
          
          <button 
            onClick={handleVerCarritoCompleto}
            disabled={productos.length === 0}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md text-base flex items-center justify-center gap-2"
          >
            <ShoppingCart size={18} /> 
            Ver carrito completo
            <ArrowRight size={16} />
          </button>
        </div>
      </aside>
    </div>
  );
} 