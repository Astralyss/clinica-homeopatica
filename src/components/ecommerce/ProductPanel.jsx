import React from 'react';
import { X, Plus, Edit, Package, Check, Trash2, Image } from 'lucide-react';
import ImageUploadSection from '@/components/forms/ImageUploadSection';

const ProductPanel = ({ 
  modo, 
  seleccionado, 
  form, 
  imagenesProducto,
  subiendoImagenes,
  onClose,
  onFormChange,
  onImagenesChange,
  onSubmit,
  onEdit,
  onDelete
}) => {
  if (!modo || modo === 'lista') return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/20 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl h-full bg-white shadow-2xl border-l border-gray-200 animate-slide-in-right flex flex-col">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
          onClick={onClose}
          title="Cerrar"
        >
          <span className="sr-only">Cerrar</span>
          <X size={24} />
        </button>
        
        <div className="p-8 overflow-y-auto flex-1">
          {modo === 'agregar' && (
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                  <Plus size={20} className="text-gray-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Agregar producto</h3>
              </div>
              
              {/* Sección de imágenes */}
              <ImageUploadSection
                imagenes={imagenesProducto}
                onImagenesChange={onImagenesChange}
                maxImagenes={5}
                aspectRatio={1}
                minWidth={400}
                minHeight={400}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Nombre</label>
                  <input 
                    name="nombre" 
                    value={form.nombre} 
                    onChange={onFormChange} 
                    placeholder="Nombre del producto" 
                    className="w-full border-2 border-gray-200 focus:border-gray-400 rounded-xl px-4 py-3 text-gray-800 transition-all duration-200 shadow-sm" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Categoría</label>
                  <input 
                    name="categoria" 
                    value={form.categoria} 
                    onChange={onFormChange} 
                    placeholder="Categoría" 
                    className="w-full border-2 border-gray-200 focus:border-gray-400 rounded-xl px-4 py-3 text-gray-800 transition-all duration-200 shadow-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Precio</label>
                  <input 
                    name="precio" 
                    value={form.precio} 
                    onChange={onFormChange} 
                    placeholder="0.00" 
                    type="number" 
                    min="0" 
                    step="0.01"
                    className="w-full border-2 border-gray-200 focus:border-gray-400 rounded-xl px-4 py-3 text-gray-800 transition-all duration-200 shadow-sm" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Presentación</label>
                  <input 
                    name="presentacion" 
                    value={form.presentacion} 
                    onChange={onFormChange} 
                    placeholder="Ej: Frasco de 30ml" 
                    className="w-full border-2 border-gray-200 focus:border-gray-400 rounded-xl px-4 py-3 text-gray-800 transition-all duration-200 shadow-sm" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Descripción</label>
                <textarea 
                  name="descripcion" 
                  value={form.descripcion} 
                  onChange={onFormChange} 
                  placeholder="Descripción detallada del producto" 
                  className="w-full border-2 border-gray-200 focus:border-gray-400 rounded-xl px-4 py-3 text-gray-800 transition-all duration-200 shadow-sm" 
                  rows="3" 
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Beneficios</label>
                <input 
                  name="beneficios" 
                  value={form.beneficios} 
                  onChange={onFormChange} 
                  placeholder="Beneficios separados por coma" 
                  className="w-full border-2 border-gray-200 focus:border-gray-400 rounded-xl px-4 py-3 text-gray-800 transition-all duration-200 shadow-sm" 
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="submit" 
                  disabled={subiendoImagenes}
                  className="flex-1 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all duration-200"
                >
                  {subiendoImagenes ? (
                    <>
                      <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                      Subiendo...
                    </>
                  ) : (
                    <>
                      <Check size={20} /> Guardar producto
                    </>
                  )}
                </button>
                <button 
                  type="button" 
                  className="px-6 py-3 border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold rounded-xl transition-all duration-200" 
                  onClick={onClose}
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          {modo === 'editar' && (
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                  <Edit size={20} className="text-gray-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Editar producto</h3>
              </div>
              
              {/* Sección de imágenes */}
              <ImageUploadSection
                imagenes={imagenesProducto}
                onImagenesChange={onImagenesChange}
                maxImagenes={5}
                aspectRatio={1}
                minWidth={400}
                minHeight={400}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Nombre</label>
                  <input 
                    name="nombre" 
                    value={form.nombre} 
                    onChange={onFormChange} 
                    placeholder="Nombre del producto" 
                    className="w-full border-2 border-gray-200 focus:border-gray-400 rounded-xl px-4 py-3 text-gray-800 transition-all duration-200 shadow-sm" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Categoría</label>
                  <input 
                    name="categoria" 
                    value={form.categoria} 
                    onChange={onFormChange} 
                    placeholder="Categoría" 
                    className="w-full border-2 border-gray-200 focus:border-gray-400 rounded-xl px-4 py-3 text-gray-800 transition-all duration-200 shadow-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Precio</label>
                  <input 
                    name="precio" 
                    value={form.precio} 
                    onChange={onFormChange} 
                    placeholder="0.00" 
                    type="number" 
                    min="0" 
                    step="0.01"
                    className="w-full border-2 border-gray-200 focus:border-gray-400 rounded-xl px-4 py-3 text-gray-800 transition-all duration-200 shadow-sm" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Presentación</label>
                  <input 
                    name="presentacion" 
                    value={form.presentacion} 
                    onChange={onFormChange} 
                    placeholder="Ej: Frasco de 30ml" 
                    className="w-full border-2 border-gray-200 focus:border-gray-400 rounded-xl px-4 py-3 text-gray-800 transition-all duration-200 shadow-sm" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Descripción</label>
                <textarea 
                  name="descripcion" 
                  value={form.descripcion} 
                  onChange={onFormChange} 
                  placeholder="Descripción detallada del producto" 
                  className="w-full border-2 border-gray-200 focus:border-gray-400 rounded-xl px-4 py-3 text-gray-800 transition-all duration-200 shadow-sm" 
                  rows="3" 
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Beneficios</label>
                <input 
                  name="beneficios" 
                  value={form.beneficios} 
                  onChange={onFormChange} 
                  placeholder="Beneficios separados por coma" 
                  className="w-full border-2 border-gray-200 focus:border-gray-400 rounded-xl px-4 py-3 text-gray-800 transition-all duration-200 shadow-sm" 
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="submit" 
                  disabled={subiendoImagenes}
                  className="flex-1 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all duration-200"
                >
                  {subiendoImagenes ? (
                    <>
                      <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                      Subiendo...
                    </>
                  ) : (
                    <>
                      <Check size={20} /> Actualizar producto
                    </>
                  )}
                </button>
                <button 
                  type="button" 
                  className="px-6 py-3 border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold rounded-xl transition-all duration-200" 
                  onClick={onClose}
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          {modo === 'preview' && seleccionado && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                  <Package size={20} className="text-gray-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{seleccionado.nombre}</h3>
                  <span className="text-sm text-gray-500">{seleccionado.categoria}</span>
                </div>
              </div>

              {/* Galería de imágenes */}
              {seleccionado.imagenes && seleccionado.imagenes.length > 0 ? (
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">Imágenes del producto</label>
                  <div className="grid grid-cols-2 gap-3">
                    {seleccionado.imagenes.map((imagen, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                          <img 
                            src={imagen.url} 
                            alt={`${seleccionado.nombre} - Imagen ${index + 1}`} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {imagen.esPrincipal && (
                          <div className="absolute top-2 left-2 bg-gray-900 text-white text-xs px-2 py-1 rounded-full shadow-lg font-semibold">
                            Principal
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">Imágenes del producto</label>
                  <div className="w-full h-32 bg-gray-100 flex items-center justify-center rounded-xl border border-gray-200">
                    <div className="text-center">
                      <Image size={24} className="text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">Sin imágenes</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Descripción</label>
                  <p className="text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-200">
                    {seleccionado.descripcion || 'Sin descripción'}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Presentación</label>
                  <p className="text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-200">
                    {seleccionado.presentacion || 'No especificada'}
                  </p>
                </div>

                {seleccionado.beneficios && seleccionado.beneficios.length > 0 && (
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Beneficios</label>
                    <div className="flex flex-wrap gap-2">
                      {seleccionado.beneficios.map((beneficio, i) => (
                        <span key={i} className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full border border-gray-200">
                          {beneficio}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Precio</label>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-800">${seleccionado.precio}</span>
                    <span className="text-sm text-gray-500">MXN</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all duration-200" 
                  onClick={() => onEdit && onEdit(seleccionado)}
                >
                  <Edit size={20} /> Editar producto
                </button>
                <button 
                  className="px-6 py-3 border-2 border-red-200 hover:border-red-300 text-red-600 font-semibold rounded-xl transition-all duration-200" 
                  onClick={() => onDelete && onDelete(seleccionado.id)}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPanel; 