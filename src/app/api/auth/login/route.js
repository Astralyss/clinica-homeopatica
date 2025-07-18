import { NextResponse } from 'next/server';
import { AuthService } from '@/utils/auth/authService';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validaciones básicas
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Iniciar sesión
    const resultado = await AuthService.iniciarSesion(email, password);

    if (!resultado.success) {
      return NextResponse.json(
        { success: false, error: resultado.error },
        { status: 401 }
      );
    }

    // Crear respuesta con cookie
    const response = NextResponse.json({
      success: true,
      usuario: resultado.usuario,
      message: 'Sesión iniciada exitosamente'
    });

    // Establecer cookie con el token
    response.cookies.set('auth-token', resultado.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 días
    });

    return response;

  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 