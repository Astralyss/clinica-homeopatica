import React, { useState } from 'react'
import { X } from 'lucide-react'
import MultiImageUpload from './MultiImageUpload'
import { uploadImagesToSupabase } from '@/utils/uploadToSupabase'

export default function ProductSidePanel({ open, onClose, modo = 'nuevo', producto = null, onSave, onEdit }) {
  // Estado para imágenes seleccionadas
  const [imagenes, setImagenes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [panelMode, setPanelMode] = useState(modo)

  // Estados para los campos del formulario
  const [nombre, setNombre] = useState(producto?.nombre || '')
  const [categoria, setCategoria] = useState(producto?.categoria || '')
  const [precio, setPrecio] = useState(producto?.precio || '')
  const [presentacion, setPresentacion] = useState(producto?.presentacion || '')
  const [descripcion, setDescripcion] = useState(producto?.descripcion || '')
  const [beneficios, setBeneficios] = useState(producto?.beneficios ? producto.beneficios.join(', ') : '')

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Refuerza el manejo del estado de beneficios
  React.useEffect(() => {
    setPanelMode(modo)
    if (open && modo === 'nuevo') {
      setNombre('')
      setCategoria('')
      setPrecio('')
      setPresentacion('')
      setDescripcion('')
      setImagenes([])
      setBeneficios('')
      setError(null)
    }
    if (open && producto && modo !== 'nuevo') {
      setNombre(producto.nombre || '')
      setCategoria(producto.categoria || '')
      setPrecio(producto.precio || '')
      setPresentacion(producto.presentacion || '')
      setDescripcion(producto.descripcion || '')
      setImagenes(producto.imagenes ? producto.imagenes.map(img => ({ url: img.url, file: null, id: img.id })) : [])
      // Refuerza: si beneficios ya es array, úsalos, si es string, sepáralos
      if (Array.isArray(producto.beneficios)) {
        setBeneficios(producto.beneficios.join(', '))
      } else if (typeof producto.beneficios === 'string') {
        setBeneficios(producto.beneficios)
      } else {
        setBeneficios('')
      }
      setError(null)
    }
  }, [open, modo, producto])

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // Guardar producto
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      // Subir imágenes a Supabase si son nuevas (tienen file)
      const nuevas = imagenes.filter(img => img.file)
      let urls = []
      if (nuevas.length > 0) {
        urls = await uploadImagesToSupabase(nuevas.map(img => img.file), 'productos')
      }
      // Combinar con imágenes ya existentes (si las hay)
      const imagenesFinal = [
        ...imagenes.filter(img => !img.file).map(img => ({ url: img.url, esPrincipal: false })),
        ...urls.map((url, idx) => ({ url, esPrincipal: idx === 0 && imagenes.length === 0 }))
      ]
      // Preparar datos
      const data = {
        nombre,
        categoria,
        precio: parseFloat(precio),
        presentacion,
        descripcion,
        imagenes: imagenesFinal,
        beneficios: beneficios.split(',').map(b => b.trim()).filter(Boolean)
      }
      await onSave(data)
      onClose()
    } catch (err) {
      setError(err.message || 'Error al guardar el producto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Fondo semitransparente */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={handleBackdropClick}
        aria-hidden={!open}
      />
      {/* Panel lateral */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-[480px] bg-white shadow-2xl border-l border-gray-200 flex flex-col transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : 'translate-x-full'}
        `}
        style={{
          width: '100%',
          maxWidth: 480,
        }}
        aria-modal="true"
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
          <h2 className="text-lg font-bold text-gray-900">
            {panelMode === 'nuevo' && 'Nuevo Producto'}
            {panelMode === 'editar' && 'Editar Producto'}
            {panelMode === 'ver' && 'Detalle del Producto'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
            aria-label="Cerrar panel"
            disabled={loading}
          >
            <X size={22} />
          </button>
        </div>
        {/* Contenido del formulario */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del producto</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej. Arnica Montana"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                disabled={panelMode === 'ver' || loading}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej. Homeopatía"
                value={categoria}
                onChange={e => setCategoria(e.target.value)}
                disabled={panelMode === 'ver' || loading}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej. 120"
                value={precio}
                onChange={e => setPrecio(e.target.value)}
                disabled={panelMode === 'ver' || loading}
                min={0}
                step={0.01}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Presentación</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej. Frasco de 30ml"
                value={presentacion}
                onChange={e => setPresentacion(e.target.value)}
                disabled={panelMode === 'ver' || loading}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[80px]"
                placeholder="Descripción del producto"
                value={descripcion}
                onChange={e => setDescripcion(e.target.value)}
                disabled={panelMode === 'ver' || loading}
                required
              />
            </div>
            {/* Beneficios */}
            {panelMode === 'ver' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Beneficios</label>
                <ul className="list-disc pl-5 text-gray-700 text-sm">
                  {beneficios.split(',').map((b, i) => (
                    <li key={i}>{b.trim()}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Beneficios (separados por coma)</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[60px]"
                  placeholder="Ej. Desinflama, Alivia dolor, Regenera tejidos"
                  value={beneficios}
                  onChange={e => setBeneficios(e.target.value)}
                  disabled={panelMode === 'ver' || loading}
                  required
                />
              </div>
            )}
            {/* Imágenes del producto */}
            <MultiImageUpload
              imagenes={imagenes}
              setImagenes={setImagenes}
              max={5}
              disabled={panelMode === 'ver' || loading}
            />
            {/* Aquí irán los componentes de beneficios y otros campos */}
            {error && <div className="text-red-600 text-sm">{error}</div>}
            {panelMode === 'ver' && (
              <button
                type="button"
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg px-6 py-3 transition-all shadow-md mt-4"
                onClick={() => onEdit && onEdit(producto)}
              >
                Editar producto
              </button>
            )}
            {panelMode !== 'ver' && (
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-6 py-3 transition-all shadow-md mt-4 disabled:opacity-60"
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar producto'}
              </button>
            )}
          </form>
        </div>
      </aside>
    </>
  )
} 