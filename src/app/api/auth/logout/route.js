import { NextResponse } from 'next/server';
import { deleteAuthCookie } from '@/utils/cookieConfig';

export async function POST() {
  try {
    // Crear respuesta
    const response = NextResponse.json({
      success: true,
      message: 'Sesión cerrada exitosamente'
    });

    // Eliminar cookie de autenticación usando la función centralizada
    deleteAuthCookie(response);

    // Headers para limpiar caché del navegador
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, private');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Clear-Site-Data', '"cache", "cookies", "storage"');
    
    // Headers adicionales para asegurar que no se almacene en caché
    response.headers.set('Surrogate-Control', 'no-store');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');

    return response;

  } catch (error) {
    console.error('Error en logout:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 