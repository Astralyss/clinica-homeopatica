import { NextResponse } from 'next/server';
import { AuthService } from '@/utils/auth/authService';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Rutas que requieren autenticación
  const protectedRoutes = ['/admin'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    // Obtener token de la cookie
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      // Redirigir a login si no hay token
      return NextResponse.redirect(new URL('/loginUsuario', request.url));
    }

    try {
      // Verificar token
      const resultado = await AuthService.verificarToken(token);

      if (!resultado.success) {
        // Token inválido, redirigir a login
        const response = NextResponse.redirect(new URL('/loginUsuario', request.url));
        response.cookies.set('auth-token', '', { maxAge: 0 });
        return response;
      }

      // Para rutas de admin, verificar si es administrador
      if (pathname.startsWith('/admin')) {
        const esAdmin = await AuthService.esAdmin(resultado.usuario.id);
        
        if (!esAdmin) {
          // No es admin, redirigir a página principal
          return NextResponse.redirect(new URL('/', request.url));
        }
      }

      // Token válido, continuar
      return NextResponse.next();

    } catch (error) {
      console.error('Error en middleware:', error);
      // Error al verificar token, redirigir a login
      const response = NextResponse.redirect(new URL('/loginUsuario', request.url));
      response.cookies.set('auth-token', '', { maxAge: 0 });
      return response;
    }
  }

  // Para rutas no protegidas, continuar
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 