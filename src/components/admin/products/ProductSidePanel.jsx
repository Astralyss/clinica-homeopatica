import React, { useState } from 'react'
import { X, RefreshCw } from 'lucide-react'
import MultiImageUpload from './MultiImageUpload'
import { uploadImagesToSupabase } from '@/utils/uploadToSupabase'

// Función para generar código de barras único
const generarCodigoBarras = () => {
  const fecha = new Date()
  const fechaStr = fecha.getFullYear().toString() + 
                   (fecha.getMonth() + 1).toString().padStart(2, '0') + 
                   fecha.getDate().toString().padStart(2, '0')
  const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0')
  return `PROD-${fechaStr}-${random}`
}

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
  // NUEVOS CAMPOS
  const [idProducto, setIdProducto] = useState(producto?.id_producto || '')
  const [cantidad, setCantidad] = useState(producto?.cantidad?.toString() || '')
  const [esPrincipal, setEsPrincipal] = useState(producto?.esPrincipal || false)
  const [activo, setActivo] = useState(producto?.activo !== undefined ? producto.activo : true)

  // Obtener el número de productos principales (se recibe por prop o se puede pedir a la API)
  // Por simplicidad, lo recibiremos por prop: numPrincipales
  // Si no se pasa, por defecto 0
  const numPrincipales = typeof producto?.numPrincipales === 'number' ? producto.numPrincipales : 0
  const maxPrincipales = 6
  const principalDeshabilitado = !esPrincipal && numPrincipales >= maxPrincipales && panelMode === 'editar'

  // Función para regenerar código de barras
  const regenerarCodigoBarras = () => {
    setIdProducto(generarCodigoBarras())
  }

  // Función para manejar cambios en cantidad
  const handleCantidadChange = (e) => {
    const valor = e.target.value
    // Permitir solo números y campo vacío
    if (valor === '' || /^\d+$/.test(valor)) {
      setCantidad(valor)
    }
  }

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
      // Generar código de barras automáticamente para productos nuevos
      setIdProducto(generarCodigoBarras())
      setCantidad('')
      setEsPrincipal(false)
      setActivo(true)
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
      setIdProducto(producto.id_producto || '')
      setCantidad(producto.cantidad?.toString() || '')
      setEsPrincipal(producto.esPrincipal || false)
      setActivo(producto.activo !== undefined ? producto.activo : true)
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
      const imagenesFinalRaw = [
        ...imagenes.filter(img => !img.file).map(img => ({ url: img.url, esPrincipal: false })),
        ...urls.map((url, idx) => ({ url, esPrincipal: idx === 0 && imagenes.length === 0 }))
      ]
      // Preparar datos
      // La primera imagen es la principal
      const imagenesFinal = imagenesFinalRaw.map((img, idx) => ({
        ...img,
        esPrincipal: idx === 0
      }))
      const data = {
        id_producto: idProducto,
        nombre,
        categoria,
        precio: parseFloat(precio),
        presentacion,
        descripcion,
        imagenes: imagenesFinal,
        beneficios: beneficios.split(',').map(b => b.trim()).filter(Boolean),
        cantidad: cantidad === '' ? 0 : parseInt(cantidad),
        esPrincipal,
        activo,
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
  className={`fixed top-0 right-0 z-50 h-full w-full max-w-[520px] bg-white shadow-xl border-l border-gray-100 flex flex-col transition-all duration-300 ease-out
  ${open ? 'translate-x-0' : 'translate-x-full'}
  `}
  style={{
    width: '100%',
    maxWidth: 520,
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  }}
  aria-modal="true"
  role="dialog"
>
  {/* Header */}
  <div className="flex items-center justify-between px-8 py-6 border-b border-gray-50 bg-white sticky top-0 z-10">
    <div>
      <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
        {panelMode === 'nuevo' && 'Nuevo Producto'}
        {panelMode === 'editar' && 'Editar Producto'}
        {panelMode === 'ver' && 'Detalle del Producto'}
      </h2>
      <p className="text-sm text-gray-500 mt-1">
        {panelMode === 'nuevo' && 'Agrega un nuevo producto al inventario'}
        {panelMode === 'editar' && 'Modifica la información del producto'}
        {panelMode === 'ver' && 'Información completa del producto'}
      </p>
    </div>
    <button
      onClick={onClose}
      className="p-2.5 rounded-full hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-all duration-200 border border-transparent hover:border-gray-200"
      aria-label="Cerrar panel"
      disabled={loading}
    >
      <X size={20} strokeWidth={2} />
    </button>
  </div>

  {/* Contenido del formulario */}
  <div className="flex-1 overflow-y-auto">
    <div className="px-8 py-8">
      <form className="space-y-8" onSubmit={handleSubmit}>
        {/* Información básica */}
        <div className="space-y-6">
          <div className="pb-4 border-b border-gray-50">
            <h3 className="text-lg font-medium text-gray-900 mb-1">Información básica</h3>
            <p className="text-sm text-gray-500">Datos principales del producto</p>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {/* Código de barras */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Código de barras
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 bg-white"
                  placeholder="Ej. PROD-20241207-0001"
                  value={idProducto}
                  onChange={e => setIdProducto(e.target.value)}
                  disabled={panelMode === 'ver' || loading}
                  required
                />
                <button
                  type="button"
                  onClick={regenerarCodigoBarras}
                  disabled={panelMode === 'ver' || loading}
                  className="px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Generar nuevo código"
                >
                  <RefreshCw size={18} />
                </button>
              </div>
            </div>

              <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Nombre del producto
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 bg-white"
                placeholder="Ej. Arnica Montana"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                disabled={panelMode === 'ver' || loading}
                required
              />
            </div>
            {/* Cantidad */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Cantidad en inventario
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 bg-white"
                placeholder="Ej. 10"
                value={cantidad}
                onChange={handleCantidadChange}
                disabled={panelMode === 'ver' || loading}
                required
              />
            </div>
          </div>
          
          
        

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Categoría
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 bg-white"
                  placeholder="Ej. Homeopatía"
                  value={categoria}
                  onChange={e => setCategoria(e.target.value)}
                  disabled={panelMode === 'ver' || loading}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Precio
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                  <input
                    type="number"
                    className="w-full border border-gray-200 rounded-lg pl-8 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 bg-white"
                    placeholder="120.00"
                    value={precio}
                    onChange={e => setPrecio(e.target.value)}
                    disabled={panelMode === 'ver' || loading}
                    min={0}
                    step={0.01}
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Presentación
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 bg-white"
                placeholder="Ej. Frasco de 30ml"
                value={presentacion}
                onChange={e => setPresentacion(e.target.value)}
                disabled={panelMode === 'ver' || loading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Descripción
              </label>
              <textarea
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 bg-white resize-none"
                placeholder="Descripción detallada del producto..."
                value={descripcion}
                onChange={e => setDescripcion(e.target.value)}
                disabled={panelMode === 'ver' || loading}
                rows={4}
                required
              />
            </div>
          </div>
        </div>

        {/* Beneficios */}
        <div className="space-y-6">
          <div className="pb-4 border-b border-gray-50">
            <h3 className="text-lg font-medium text-gray-900 mb-1">Beneficios</h3>
            <p className="text-sm text-gray-500">Propiedades y ventajas del producto</p>
          </div>

          {panelMode === 'ver' ? (
            <div className="bg-gray-50 rounded-lg p-6">
              <ul className="space-y-2">
                {beneficios.split(',').map((b, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-black rounded-full mt-2.5 flex-shrink-0"></div>
                    <span className="text-gray-700 text-sm leading-relaxed">{b.trim()}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div>
              <textarea
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 bg-white resize-none"
                placeholder="Ej. Desinflama, Alivia dolor, Regenera tejidos"
                value={beneficios}
                onChange={e => setBeneficios(e.target.value)}
                disabled={panelMode === 'ver' || loading}
                rows={3}
                required
              />
              <p className="text-xs text-gray-500 mt-2">Separa cada beneficio con una coma</p>
            </div>
          )}
        </div>

        {/* Imágenes del producto */}
        <div className="space-y-6">
          <div className="pb-4 border-b border-gray-50">
            <h3 className="text-lg font-medium text-gray-900 mb-1">Imágenes</h3>
            <p className="text-sm text-gray-500">Fotografías del producto (máximo 5)</p>
          </div>
          
          <MultiImageUpload
            imagenes={imagenes}
            setImagenes={setImagenes}
            max={5}
            disabled={panelMode === 'ver' || loading}
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-red-500 rounded-full flex-shrink-0"></div>
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Checkbox de principal solo en editar */}
        {panelMode === 'editar' && (
          <>
            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                id="esPrincipal"
                checked={esPrincipal}
                onChange={e => setEsPrincipal(e.target.checked)}
                disabled={principalDeshabilitado || loading}
              />
              <label htmlFor="esPrincipal" className={`text-sm font-medium ${principalDeshabilitado ? 'text-gray-400' : 'text-gray-900'}`}>
                Mostrar como producto principal (máx. 6)
              </label>
              {principalDeshabilitado && (
                <span className="text-xs text-gray-400 ml-2">Ya hay 6 productos principales</span>
              )}
            </div>
           {/* Botón para cambiar estado activo/inactivo */}
<div className="mb-4">
  <button
    type="button"
    onClick={() => setActivo(a => !a)}
    className={`relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm ${
      activo 
        ? 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 border border-green-600' 
        : 'bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-300 border border-gray-300'
    }`}
    disabled={loading}
  >
    {/* Indicador de estado */}
    <div className={`w-2 h-2 rounded-full ${activo ? 'bg-green-200' : 'bg-gray-400'}`} />
    
    {/* Texto principal */}
    <span className="font-medium">
      {activo ? 'Activo' : 'Inactivo'}
    </span>
    
    {/* Texto de ayuda */}
    <span className="text-xs opacity-75">
      {activo ? '(Click para desactivar)' : '(Click para activar)'}
    </span>
    
    {/* Spinner de loading */}
    {loading && (
      <div className="absolute inset-0 flex items-center justify-center bg-inherit rounded-lg">
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      </div>
    )}
  </button>
</div>
          </>
        )}

        {/* Botones de acción */}
        <div className="pt-6 border-t border-gray-50">
          {panelMode === 'ver' ? (
            <button
              type="button"
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg px-6 py-3.5 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => onEdit && onEdit(producto)}
              disabled={loading}
            >
              Editar producto
            </button>
          ) : (
            <button
              type="submit"
              className="w-full bg-black hover:bg-gray-900 text-white font-medium rounded-lg px-6 py-3.5 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Guardando...
                </span>
              ) : (
                'Guardar producto'
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  </div>
</aside>
    </>
  )
} 