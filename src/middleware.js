import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

async function verificarTokenEdge(token) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'tu-secreto-jwt-super-seguro');
    const { payload } = await jwtVerify(token, secret);
    return { success: true, payload };
  } catch (error) {
    return { success: false };
  }
}

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
      // Verificar token con jose (Edge compatible)
      const resultado = await verificarTokenEdge(token);

      if (!resultado.success) {
        // Token inválido, redirigir a login
        const response = NextResponse.redirect(new URL('/loginUsuario', request.url));
        response.cookies.set('auth-token', '', { maxAge: 0 });
        return response;
      }

      // Para rutas de admin, verificar si es administrador usando el rol del JWT
      if (pathname.startsWith('/admin')) {
        if (resultado.payload.rol !== 'admin') {
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
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 