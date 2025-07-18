import { NextResponse } from 'next/server';
import { AuthService } from '@/utils/auth/authService';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, nombre, apellidoPaterno, apellidoMaterno, telefono } = body;

    // Validaciones básicas
    if (!email || !password || !nombre || !apellidoPaterno) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos requeridos: nombre, apellido paterno, email y contraseña' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Formato de email inválido' },
        { status: 400 }
      );
    }

    // Registrar usuario
    const resultado = await AuthService.registrarUsuario({
      email,
      password,
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      telefono
    });

    if (!resultado.success) {
      return NextResponse.json(
        { success: false, error: resultado.error },
        { status: 400 }
      );
    }

    // Crear respuesta con cookie
    const response = NextResponse.json({
      success: true,
      usuario: resultado.usuario,
      message: 'Usuario registrado exitosamente'
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
    console.error('Error en registro:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 