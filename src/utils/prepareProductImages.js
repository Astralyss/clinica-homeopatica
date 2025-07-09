import { uploadImageToSupabase } from './uploadToSupabase';

/**
 * Prepara el array de imágenes para guardar en la base de datos.
 * Sube a Supabase solo las nuevas (tipo archivo) y mantiene las existentes (con url).
 * @param {Array} imagenesFormulario - Array de imágenes del formulario
 * @returns {Promise<Array<{url: string, esPrincipal: boolean}>>}
 */
export async function prepareProductImages(imagenesFormulario) {
  const resultado = [];
  for (const img of imagenesFormulario) {
    if (img.url && img.url.startsWith('http')) {
      // Imagen ya existente
      resultado.push({ url: img.url, esPrincipal: !!img.esPrincipal });
    } else if (img.archivo) {
      // Imagen nueva, subir a Supabase
      const publicUrl = await uploadImageToSupabase(img.archivo);
      resultado.push({ url: publicUrl, esPrincipal: !!img.esPrincipal });
    }
    // Si no tiene ni url ni archivo, se ignora
  }
  return resultado;
} 