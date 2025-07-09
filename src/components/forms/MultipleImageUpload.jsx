"use client";
import React, { useState } from 'react';
import { Upload, X, GripVertical, Eye, Trash2, Image } from 'lucide-react';
import ImageCropper from './ImageCropper';

const MultipleImageUpload = ({ 
  imagenes = [], 
  onImagenesChange, 
  maxImagenes = 5,
  aspectRatio = 1,
  minWidth = 400,
  minHeight = 400
}) => {
  const [mostrarCropper, setMostrarCropper] = useState(false);
  const [imagenParaRecortar, setImagenParaRecortar] = useState('');
  const [imagenIndex, setImagenIndex] = useState(0);
  const [mostrarPreview, setMostrarPreview] = useState(false);
  const [imagenPreview, setImagenPreview] = useState('');
  const [imagenesConError, setImagenesConError] = useState(new Set());

  // Manejo de selección de imagen
  const handleImagenChange = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      // Validar tipo de archivo
      if (!archivo.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        return;
      }
      
      // Validar tamaño (máximo 10MB)
      if (archivo.size > 10 * 1024 * 1024) {
        alert('La imagen debe ser menor a 10MB');
        return;
      }

      // Validar límite de imágenes
      if (imagenes.length >= maxImagenes) {
        alert(`Máximo ${maxImagenes} imágenes permitidas`);
        return;
      }

      // Crear URL temporal para el recorte
      const urlTemporal = URL.createObjectURL(archivo);
      setImagenParaRecortar(urlTemporal);
      setImagenIndex(imagenes.length); // Nueva imagen al final
      setMostrarCropper(true);
    }
  };

  // Manejar completado del recorte
  const handleCropComplete = (archivoRecortado, urlRecortada, index) => {
    console.log('Recorte completado:', { archivoRecortado, urlRecortada, index });
    
    const nuevaImagen = {
      id: Date.now() + index,
      archivo: archivoRecortado,
      url: urlRecortada,
      nombre: archivoRecortado.name,
      esPrincipal: imagenes.length === 0 // La primera imagen es principal
    };

    const nuevasImagenes = [...imagenes, nuevaImagen];
    onImagenesChange(nuevasImagenes);
    
    setMostrarCropper(false);
    
    // Limpiar URL temporal
    if (imagenParaRecortar) {
      URL.revokeObjectURL(imagenParaRecortar);
      setImagenParaRecortar('');
    }
  };

  // Cancelar recorte
  const handleCancelarRecorte = () => {
    setMostrarCropper(false);
    
    // Limpiar URL temporal
    if (imagenParaRecortar) {
      URL.revokeObjectURL(imagenParaRecortar);
      setImagenParaRecortar('');
    }
  };

  // Eliminar imagen
  const handleEliminarImagen = (index) => {
    const imagenAEliminar = imagenes[index];
    
    // Revocar URL de blob si existe
    if (imagenAEliminar.url && imagenAEliminar.url.startsWith('blob:')) {
      URL.revokeObjectURL(imagenAEliminar.url);
    }
    
    const nuevasImagenes = imagenes.filter((_, i) => i !== index);
    
    // Si eliminamos la imagen principal, hacer principal la primera
    if (imagenAEliminar.esPrincipal && nuevasImagenes.length > 0) {
      nuevasImagenes[0].esPrincipal = true;
    }
    
    onImagenesChange(nuevasImagenes);
    
    // Remover de imágenes con error
    setImagenesConError(prev => {
      const nuevo = new Set(prev);
      nuevo.delete(imagenAEliminar.id);
      return nuevo;
    });
  };

  // Hacer imagen principal
  const handleHacerPrincipal = (index) => {
    const nuevasImagenes = imagenes.map((img, i) => ({
      ...img,
      esPrincipal: i === index
    }));
    onImagenesChange(nuevasImagenes);
  };

  // Mostrar preview de imagen
  const handleMostrarPreview = (url) => {
    setImagenPreview(url);
    setMostrarPreview(true);
  };

  // Manejar error de carga de imagen
  const handleImageError = (imagenId) => {
    console.error('Error cargando imagen:', imagenId);
    setImagenesConError(prev => new Set([...prev, imagenId]));
  };

  // Reordenar imágenes (mover hacia arriba)
  const handleMoverArriba = (index) => {
    if (index === 0) return;
    
    const nuevasImagenes = [...imagenes];
    const temp = nuevasImagenes[index];
    nuevasImagenes[index] = nuevasImagenes[index - 1];
    nuevasImagenes[index - 1] = temp;
    
    onImagenesChange(nuevasImagenes);
  };

  // Reordenar imágenes (mover hacia abajo)
  const handleMoverAbajo = (index) => {
    if (index === imagenes.length - 1) return;
    
    const nuevasImagenes = [...imagenes];
    const temp = nuevasImagenes[index];
    nuevasImagenes[index] = nuevasImagenes[index + 1];
    nuevasImagenes[index + 1] = temp;
    
    onImagenesChange(nuevasImagenes);
  };

  return (
    <div className="space-y-4">
      {/* Lista de imágenes */}
      {imagenes.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {imagenes.map((imagen, index) => (
            <div key={imagen.id} className="relative group transition-all duration-200 hover:scale-105 animate-fade-in">
              {/* Imagen */}
              <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                {imagenesConError.has(imagen.id) ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <div className="text-center">
                      <Image size={24} className="text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-xs">Error de carga</p>
                    </div>
                  </div>
                ) : (
                  <img
                    src={imagen.url}
                    alt={`Imagen ${index + 1}`}
                    className="w-full h-full object-cover cursor-pointer transition-transform duration-200 group-hover:scale-105"
                    onClick={() => handleMostrarPreview(imagen.url)}
                    onError={() => handleImageError(imagen.id)}
                    onLoad={() => {
                      // console.log('Imagen cargada exitosamente:', imagen.id, imagen.url);
                    }}
                  />
                )}
                {/* Overlay con controles */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                    <button
                      onClick={() => handleMostrarPreview(imagen.url)}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all duration-200"
                      title="Ver imagen"
                    >
                      <Eye size={16} className="text-gray-700" />
                    </button>
                    <button
                      onClick={() => handleEliminarImagen(index)}
                      className="p-2 bg-red-500 rounded-full shadow-lg hover:bg-red-600 transition-all duration-200"
                      title="Eliminar imagen"
                    >
                      <Trash2 size={16} className="text-white" />
                    </button>
                  </div>
                </div>
                {/* Indicador de imagen principal */}
                {imagen.esPrincipal && (
                  <div className="absolute top-2 left-2 bg-gray-900 text-white text-xs px-2 py-1 rounded-full shadow-lg font-semibold animate-fade-in">
                    Principal
                  </div>
                )}
                {/* Controles de reordenamiento */}
                <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                  <button
                    onClick={() => handleMoverArriba(index)}
                    disabled={index === 0}
                    className="p-1 bg-white rounded shadow-sm hover:bg-gray-50 disabled:opacity-50 transition-all duration-200"
                    title="Mover arriba"
                  >
                    <GripVertical size={12} className="text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleMoverAbajo(index)}
                    disabled={index === imagenes.length - 1}
                    className="p-1 bg-white rounded shadow-sm hover:bg-gray-50 disabled:opacity-50 transition-all duration-200"
                    title="Mover abajo"
                  >
                    <GripVertical size={12} className="text-gray-600 rotate-180" />
                  </button>
                </div>
              </div>
              {/* Botón para hacer principal */}
              {!imagen.esPrincipal && (
                <button
                  onClick={() => handleHacerPrincipal(index)}
                  className="mt-2 w-full text-xs bg-gray-100 text-gray-700 py-1 px-2 rounded-lg hover:bg-gray-200 transition-all duration-200 font-semibold animate-fade-in"
                >
                  Hacer principal
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Input para agregar más imágenes */}
      {imagenes.length < maxImagenes && (
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-gray-400 transition-all duration-200 bg-gray-50 hover:bg-gray-100">
          <input
            type="file"
            accept="image/*"
            onChange={handleImagenChange}
            className="hidden"
            id="multiple-imagen-input"
          />
          <label htmlFor="multiple-imagen-input" className="cursor-pointer">
            <Upload size={24} className="mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600 font-medium">
              Agregar imagen {imagenes.length + 1} de {maxImagenes}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG hasta 10MB • Se recortará automáticamente
            </p>
          </label>
        </div>
      )}

      {/* Información */}
      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-200">
        <p>• La primera imagen será la imagen principal del producto</p>
        <p>• Puedes reordenar las imágenes arrastrando o usando los controles</p>
        <p>• Máximo {maxImagenes} imágenes por producto</p>
      </div>

      {/* Modal de recorte */}
      {mostrarCropper && (
        <ImageCropper
          imagen={imagenParaRecortar}
          onCropComplete={handleCropComplete}
          onCancel={handleCancelarRecorte}
          aspectRatio={aspectRatio}
          minWidth={minWidth}
          minHeight={minHeight}
          imagenIndex={imagenIndex}
          totalImagenes={imagenes.length + 1}
        />
      )}

      {/* Modal de preview */}
      {mostrarPreview && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-auto shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Vista previa</h3>
              <button
                onClick={() => setMostrarPreview(false)}
                className="text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
              >
                <X size={24} />
              </button>
            </div>
            <img
              src={imagenPreview}
              alt="Preview"
              className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
              onError={(e) => {
                console.error('Error en preview:', imagenPreview);
                e.target.style.display = 'none';
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MultipleImageUpload; 