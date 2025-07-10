import React, { useRef, useState } from 'react'
import { Plus, X, Image as ImageIcon, Crop } from 'lucide-react'
import ImageCropper from './ImageCropper'

export default function MultiImageUpload({ imagenes = [], setImagenes, max = 5, disabled = false }) {
  const inputRef = useRef()
  const [cropperOpen, setCropperOpen] = useState(false)
  const [imageToCrop, setImageToCrop] = useState(null)
  const [pendingFile, setPendingFile] = useState(null)
  const [cropIdx, setCropIdx] = useState(null)
  const [draggedIdx, setDraggedIdx] = useState(null)

  // Selección de nuevas imágenes
  const handleSelect = (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    // Solo una imagen a la vez para recortar
    const file = files[0]
    setPendingFile(file)
    setImageToCrop(URL.createObjectURL(file))
    setCropperOpen(true)
    inputRef.current.value = ''
  }

  // Cuando termina el crop inicial
  const handleCropComplete = (croppedBlob) => {
    const url = URL.createObjectURL(croppedBlob)
    setImagenes([...imagenes, { file: croppedBlob, url }])
    setCropperOpen(false)
    setImageToCrop(null)
    setPendingFile(null)
  }

  // Recortar una imagen ya agregada
  const handleReCrop = (idx) => {
    setCropIdx(idx)
    setImageToCrop(imagenes[idx].url)
    setCropperOpen(true)
  }

  // Cuando termina el recorte de una imagen existente
  const handleReCropComplete = (croppedBlob) => {
    const url = URL.createObjectURL(croppedBlob)
    const nuevas = imagenes.slice()
    URL.revokeObjectURL(nuevas[cropIdx].url)
    nuevas[cropIdx] = { ...nuevas[cropIdx], file: croppedBlob, url }
    setImagenes(nuevas)
    setCropperOpen(false)
    setImageToCrop(null)
    setCropIdx(null)
  }

  const handleRemove = (idx) => {
    const nuevas = imagenes.slice()
    URL.revokeObjectURL(nuevas[idx].url)
    nuevas.splice(idx, 1)
    setImagenes(nuevas)
  }

  // Drag & drop handlers
  const handleDragStart = (idx) => setDraggedIdx(idx)
  const handleDragOver = (e) => e.preventDefault()
  const handleDrop = (idx) => {
    if (draggedIdx === null || draggedIdx === idx) return
    const nuevas = imagenes.slice()
    const [moved] = nuevas.splice(draggedIdx, 1)
    nuevas.splice(idx, 0, moved)
    setImagenes(nuevas)
    setDraggedIdx(null)
  }
  const handleDragEnd = () => setDraggedIdx(null)

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Imágenes del producto</label>
      <div className="flex gap-3 flex-wrap">
        {imagenes.map((img, idx) => (
          <div
            key={idx}
            className={`relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center group cursor-move`}
            draggable={!disabled}
            onDragStart={() => handleDragStart(idx)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(idx)}
            onDragEnd={handleDragEnd}
            style={{ opacity: draggedIdx === idx ? 0.5 : 1 }}
            title="Arrastra para reordenar"
          >
            <img
              src={img.url}
              alt={`Imagen ${idx + 1}`}
              className="w-full h-full object-cover"
            />
            {/* Botón eliminar */}
            <button
              type="button"
              className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all shadow group-hover:opacity-100 opacity-80"
              onClick={() => handleRemove(idx)}
              tabIndex={-1}
              disabled={disabled}
            >
              <X size={16} />
            </button>
            {/* Botón recortar */}
            <button
              type="button"
              className="absolute bottom-1 right-1 bg-white/80 rounded-full p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all shadow group-hover:opacity-100 opacity-80"
              onClick={() => handleReCrop(idx)}
              tabIndex={-1}
              disabled={disabled}
              title="Recortar imagen"
            >
              <Crop size={15} />
            </button>
          </div>
        ))}
        {imagenes.length < max && (
          <button
            type="button"
            className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all focus:outline-none"
            onClick={() => inputRef.current.click()}
            disabled={disabled}
          >
            <Plus size={28} className="text-gray-400 mb-1" />
            <span className="text-xs text-gray-500">Agregar</span>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple={false}
              className="hidden"
              onChange={handleSelect}
              disabled={disabled}
            />
          </button>
        )}
      </div>
      <p className="text-xs text-gray-400 mt-2">Máximo {max} imágenes. Arrastra para reordenar. La primera imagen será la principal.</p>
      {/* Cropper modal */}
      <ImageCropper
        image={imageToCrop}
        open={cropperOpen}
        onClose={() => {
          setCropperOpen(false)
          setImageToCrop(null)
          setPendingFile(null)
          setCropIdx(null)
        }}
        onCropComplete={cropIdx !== null ? handleReCropComplete : handleCropComplete}
      />
    </div>
  )
} 