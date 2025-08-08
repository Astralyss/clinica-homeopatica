import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { AuthService } from '@/utils/auth/authService';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    console.log('🔐 Verificando autenticación...');
    
    // Obtener token de la cookie y validar realmente
    const token = request.cookies.get('auth-token')?.value;
    console.log('🎫 Token encontrado:', !!token);
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No autenticado' },
        { status: 401 }
      );
    }

    const verificado = await AuthService.verificarToken(token);
    if (!verificado?.success || !verificado.usuario?.id) {
      return NextResponse.json(
        { success: false, error: verificado?.error || 'Token inválido' },
        { status: 401 }
      );
    }
    const userId = verificado.usuario.id;

    // En producción, verificar token real
    // const resultado = await AuthService.verificarToken(token);
    
    // Devolver usuario real desde BD
    const usuario = await prisma.usuario.findUnique({
      where: { id: userId },
      include: { rol: true }
    });

    if (!usuario) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      usuario: {
        id: usuario.id,
        id_usuario: usuario.id_usuario,
        email: usuario.email,
        nombre: usuario.nombre,
        apellidoPaterno: usuario.apellidoPaterno,
        apellidoMaterno: usuario.apellidoMaterno,
        rol: usuario.rol?.nombre || 'cliente'
      }
    });

  } catch (error) {
    console.error('❌ Error verificando autenticación:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 