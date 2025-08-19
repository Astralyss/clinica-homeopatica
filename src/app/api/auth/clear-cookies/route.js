import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Crear respuesta
    const response = NextResponse.json({
      success: true,
      message: 'Cookies limpiadas exitosamente'
    });

    // Eliminar todas las cookies relacionadas con autenticación
    const cookiesToClear = ['auth-token', 'user', 'session'];
    
    cookiesToClear.forEach(cookieName => {
      response.cookies.set(cookieName, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: new Date(0), // Fecha pasada para eliminar la cookie
        path: '/' // Asegurar que se elimine en toda la aplicación
      });
    });

    return response;

  } catch (error) {
    console.error('Error limpiando cookies:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
