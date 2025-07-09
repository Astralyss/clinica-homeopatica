import React from 'react';
import MultipleImageUpload from './MultipleImageUpload';

const ImageUploadSection = ({ 
  imagenes = [], 
  onImagenesChange, 
  maxImagenes = 5,
  aspectRatio = 1,
  minWidth = 400,
  minHeight = 400
}) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">Imágenes del producto</label>
      <MultipleImageUpload
        imagenes={imagenes}
        onImagenesChange={onImagenesChange}
        maxImagenes={maxImagenes}
        aspectRatio={aspectRatio}
        minWidth={minWidth}
        minHeight={minHeight}
      />
    </div>
  );
};

export default ImageUploadSection; 