import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const bucket = 'test-iamage'; // Cambia si tu bucket tiene otro nombre

const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Sube una imagen a Supabase Storage y devuelve la URL pública
 * @param {File|Blob} file - Archivo de imagen
 * @param {string} [folder] - Carpeta opcional dentro del bucket
 * @returns {Promise<string>} - URL pública de la imagen
 */
export async function uploadImageToSupabase(file, folder = '') {
  if (!file) throw new Error('No se proporcionó archivo');
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const filePath = folder ? `${folder}/${fileName}` : fileName;

  // Subir archivo
  const { error } = await supabase.storage.from(bucket).upload(filePath, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw error;

  // Obtener URL pública
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  if (!data || !data.publicUrl) throw new Error('No se pudo obtener la URL pública');
  return data.publicUrl;
}

/**
 * Sube una o varias imágenes a Supabase Storage y retorna las URLs públicas
 * @param {File[]|Blob[]} files - Array de archivos o blobs
 * @param {string} [folder] - Carpeta opcional dentro del bucket
 * @returns {Promise<string[]>} - Array de URLs públicas
 */
export async function uploadImagesToSupabase(files, folder = '') {
  if (!Array.isArray(files)) files = [files]
  const urls = []
  for (const file of files) {
    const ext = file.type.split('/')[1] || 'jpg'
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2,8)}.${ext}`
    const path = folder ? `${folder}/${fileName}` : fileName
    const { error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: '3600',
      upsert: false
    })
    if (error) throw new Error('Error al subir imagen a Supabase: ' + error.message)
    // Obtener URL pública
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    urls.push(data.publicUrl)
  }
  return urls
} 