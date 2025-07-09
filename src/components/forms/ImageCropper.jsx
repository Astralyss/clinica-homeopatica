"use client";
import React, { useState, useRef } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Check, X, RotateCw, ZoomIn, ZoomOut, Crop } from 'lucide-react';
import { getCroppedImg } from '@/utils/imageProcessing';

const ImageCropper = ({ 
  imagen, 
  onCropComplete, 
  onCancel, 
  aspectRatio = 1, // 1:1 por defecto (cuadrado)
  minWidth = 200,
  minHeight = 200,
  imagenIndex = 0, // Índice de la imagen para múltiples imágenes
  totalImagenes = 1 // Total de imágenes para mostrar progreso
}) => {
  const [crop, setCrop] = useState({
    unit: '%',
    width: 80,
    height: 80,
    x: 10,
    y: 10
  });
  
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const imgRef = useRef(null);

  // Manejar completado del recorte
  const handleCropComplete = async () => {
    try {
      console.log('Iniciando recorte de imagen...');
      const croppedBlob = await getCroppedImg(imgRef.current, crop, zoom, rotation);
      
      if (croppedBlob) {
        console.log('Blob generado exitosamente:', croppedBlob);
        
        // Crear URL para preview
        const croppedUrl = URL.createObjectURL(croppedBlob);
        console.log('URL de blob creada:', croppedUrl);
        
        // Crear archivo con el blob
        const croppedFile = new File([croppedBlob], `cropped-image-${imagenIndex}.jpg`, {
          type: 'image/jpeg',
        });
        
        console.log('Archivo creado:', croppedFile);
        
        onCropComplete(croppedFile, croppedUrl, imagenIndex);
      } else {
        console.error('No se pudo generar el blob');
        alert('Error al procesar la imagen. Intenta de nuevo.');
      }
    } catch (error) {
      console.error('Error al recortar imagen:', error);
      alert('Error al recortar la imagen: ' + error.message);
    }
  };

  // Ajustar zoom
  const handleZoom = (delta) => {
    setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  // Rotar imagen
  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 transition-all duration-300">
      <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-auto shadow-2xl border border-gray-200 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <Crop size={20} className="text-gray-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Recortar imagen</h3>
              {totalImagenes > 1 && (
                <p className="text-sm text-gray-500 mt-1">
                  Imagen {imagenIndex + 1} de {totalImagenes}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
          >
            <X size={24} />
          </button>
        </div>

        {/* Controles */}
        <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleZoom(-0.1)}
              className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 text-gray-600 hover:text-gray-800"
              title="Reducir zoom"
            >
              <ZoomOut size={16} />
            </button>
            <span className="text-sm font-medium min-w-[60px] text-center text-gray-700">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => handleZoom(0.1)}
              className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 text-gray-600 hover:text-gray-800"
              title="Aumentar zoom"
            >
              <ZoomIn size={16} />
            </button>
          </div>
          <div className="w-px h-6 bg-gray-300"></div>
          <button
            onClick={handleRotate}
            className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 text-gray-600 hover:text-gray-800"
            title="Rotar 90°"
          >
            <RotateCw size={16} />
          </button>
          <div className="w-px h-6 bg-gray-300"></div>
          <div className="text-sm text-gray-600">
            Arrastra para ajustar el recorte
          </div>
        </div>

        {/* Área de recorte */}
        <div className="flex justify-center mb-6 animate-fade-in">
          <div className="max-w-full max-h-[60vh] overflow-auto rounded-xl border border-gray-200 bg-gray-50 shadow-sm">
            <ReactCrop
              crop={crop}
              onChange={setCrop}
              aspect={aspectRatio}
              minWidth={minWidth}
              minHeight={minHeight}
              keepSelection
              className="max-w-full"
            >
              <img
                ref={imgRef}
                src={imagen}
                alt="Recortar"
                className="max-w-full max-h-[60vh] object-contain rounded-xl"
              />
            </ReactCrop>
          </div>
        </div>

        {/* Información del recorte */}
        <div className="text-sm text-gray-600 mb-6 text-center bg-gray-50 p-3 rounded-lg border border-gray-200">
          <p>Proporción: {aspectRatio}:1 • Tamaño mínimo: {minWidth}x{minHeight}px</p>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold"
          >
            Cancelar
          </button>
          <button
            onClick={handleCropComplete}
            className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl transition-all duration-200 flex items-center gap-2 font-semibold shadow-lg"
          >
            <Check size={20} />
            Aplicar recorte
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper; 