/**
 * Configuración centralizada para cookies de autenticación
 * Asegura consistencia en toda la aplicación
 */

export const COOKIE_CONFIG = {
  // Nombre de la cookie de autenticación
  AUTH_TOKEN_NAME: 'auth-token',
  
  // Configuración para cookies seguras
  SECURE_OPTIONS: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  },
  
  // Configuración para eliminar cookies
  DELETE_OPTIONS: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    expires: new Date(0),
    path: '/',
  },
  
  // Configuración para cookies de producción
  PRODUCTION_OPTIONS: {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    domain: process.env.COOKIE_DOMAIN || undefined,
  }
};

/**
 * Función para eliminar cookies de autenticación
 * Se usa tanto en el servidor como en el cliente
 */
export const deleteAuthCookie = (response = null) => {
  if (response) {
    // Eliminación en el servidor (NextResponse)
    response.cookies.set(COOKIE_CONFIG.AUTH_TOKEN_NAME, '', COOKIE_CONFIG.DELETE_OPTIONS);
    
    // Eliminación adicional con diferentes configuraciones
    response.cookies.set(COOKIE_CONFIG.AUTH_TOKEN_NAME, null, {
      ...COOKIE_CONFIG.DELETE_OPTIONS,
      maxAge: -1,
      expires: new Date('1970-01-01'),
    });
    
    // Si es producción, eliminar también con dominio específico
    if (process.env.NODE_ENV === 'production') {
      response.cookies.set(COOKIE_CONFIG.AUTH_TOKEN_NAME, '', COOKIE_CONFIG.PRODUCTION_OPTIONS);
    }
  } else {
    // Eliminación en el cliente
    if (typeof document !== 'undefined') {
      const cookieName = COOKIE_CONFIG.AUTH_TOKEN_NAME;
      const hostname = window.location.hostname;
      
      // Eliminar con diferentes paths y dominios
      document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${hostname}`;
      document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${hostname}`;
      
      console.log('🧹 Cookie de autenticación eliminada del cliente');
    }
  }
};

/**
 * Función para verificar si una cookie existe
 */
export const hasAuthCookie = () => {
  if (typeof document !== 'undefined') {
    return document.cookie.includes(COOKIE_CONFIG.AUTH_TOKEN_NAME);
  }
  return false;
};

/**
 * Función para obtener el valor de la cookie de autenticación
 */
export const getAuthCookieValue = () => {
  if (typeof document !== 'undefined') {
    const cookies = document.cookie.split(';');
    const authCookie = cookies.find(cookie => 
      cookie.trim().startsWith(`${COOKIE_CONFIG.AUTH_TOKEN_NAME}=`)
    );
    
    if (authCookie) {
      return authCookie.split('=')[1];
    }
  }
  return null;
};
