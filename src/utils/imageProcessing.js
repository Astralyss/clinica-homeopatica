/**
 * Procesa una imagen recortada, con zoom y rotación, y devuelve un blob listo para subir o mostrar.
 * @param {HTMLImageElement} image - Referencia a la imagen cargada
 * @param {Object} crop - Objeto crop de react-image-crop
 * @param {number} zoom - Zoom aplicado
 * @param {number} rotation - Rotación en grados
 * @returns {Promise<Blob>} - Blob de la imagen procesada
 */
export async function getCroppedImg(image, crop, zoom = 1, rotation = 0) {
  if (!image) return null;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Calcular dimensiones del recorte
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  const pixelCrop = {
    x: crop.x * scaleX,
    y: crop.y * scaleY,
    width: crop.width * scaleX,
    height: crop.height * scaleY,
  };

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.scale(zoom, zoom);
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    -pixelCrop.width / 2,
    -pixelCrop.height / 2,
    pixelCrop.width,
    pixelCrop.height
  );
  ctx.restore();

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/jpeg', 0.9);
  });
} 