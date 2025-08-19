import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { deleteAuthCookie } from '@/utils/cookieConfig';

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

  // Agregar headers de seguridad a todas las respuestas
  const response = NextResponse.next();
  
  // Headers de seguridad para prevenir cache y mejorar seguridad
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Headers para rutas de autenticación
  if (pathname.startsWith('/api/auth/')) {
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, private');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }

  if (isProtectedRoute) {
    // Obtener token de la cookie
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      // Redirigir a login si no hay token
      const redirectResponse = NextResponse.redirect(new URL('/loginUsuario', request.url));
      
      // Limpiar cookie si existe usando la función centralizada
      deleteAuthCookie(redirectResponse);
      
      return redirectResponse;
    }

    try {
      // Verificar token con jose (Edge compatible)
      const resultado = await verificarTokenEdge(token);

      if (!resultado.success) {
        // Token inválido, redirigir a login y limpiar cookie
        const redirectResponse = NextResponse.redirect(new URL('/loginUsuario', request.url));
        
        // Limpiar cookie inválida usando la función centralizada
        deleteAuthCookie(redirectResponse);
        
        return redirectResponse;
      }

      // Para rutas de admin, verificar si es administrador usando el rol del JWT
      if (pathname.startsWith('/admin')) {
        if (resultado.payload.rol !== 'admin') {
          // No es admin, redirigir a página principal y limpiar cookie
          const redirectResponse = NextResponse.redirect(new URL('/', request.url));
          
          deleteAuthCookie(redirectResponse);
          
          return redirectResponse;
        }
      }

      // Token válido, continuar
      return response;

    } catch (error) {
      console.error('Error en middleware:', error);
      // Error al verificar token, redirigir a login y limpiar cookie
      const redirectResponse = NextResponse.redirect(new URL('/loginUsuario', request.url));
      
      deleteAuthCookie(redirectResponse);
      
      return redirectResponse;
    }
  }

  // Para rutas no protegidas, continuar
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 