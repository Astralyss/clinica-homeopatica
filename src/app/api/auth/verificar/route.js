import { NextResponse } from 'next/server';
import { AuthService } from '@/utils/auth/authService';

export async function GET(request) {
  try {
    // Obtener token de la cookie
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No hay token de autenticación' },
        { status: 401 }
      );
    }

    // Verificar token
    const resultado = await AuthService.verificarToken(token);

    if (!resultado.success) {
      return NextResponse.json(
        { success: false, error: resultado.error },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      usuario: resultado.usuario
    });

  } catch (error) {
    console.error('Error verificando autenticación:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 