/**
 * Utilidades para limpiar el almacenamiento del navegador
 * Se usa para asegurar que no queden datos de sesión después del logout
 */

export const clearBrowserStorage = () => {
  try {
    // Limpiar localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.clear();
      console.log('🧹 localStorage limpiado');
    }

    // Limpiar sessionStorage
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.clear();
      console.log('🧹 sessionStorage limpiado');
    }

    // Limpiar cookies del lado del cliente
    if (typeof document !== 'undefined' && document.cookie) {
      const cookies = document.cookie.split(';');
      
      cookies.forEach(cookie => {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        
        // Eliminar cookie con diferentes paths y dominios
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
      });
      
      console.log('🧹 Cookies del cliente limpiadas');
    }

    // Limpiar caché del navegador si es posible
    if (typeof window !== 'undefined' && 'caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          caches.delete(cacheName);
        });
        console.log('🧹 Cache del navegador limpiado');
      }).catch(error => {
        console.warn('No se pudo limpiar el cache:', error);
      });
    }

    // Limpiar IndexedDB si es posible
    if (typeof window !== 'undefined' && 'indexedDB' in window) {
      const databases = indexedDB.databases();
      if (databases) {
        databases.then(dbList => {
          dbList.forEach(db => {
            indexedDB.deleteDatabase(db.name);
          });
          console.log('🧹 IndexedDB limpiado');
        }).catch(error => {
          console.warn('No se pudo limpiar IndexedDB:', error);
        });
      }
    }

    // Forzar recarga de la página para asegurar limpieza completa
    // Solo si estamos en una ruta que no sea la principal
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      console.log('🔄 Forzando recarga de página para limpieza completa');
      window.location.href = '/';
    }

  } catch (error) {
    console.error('Error limpiando almacenamiento del navegador:', error);
  }
};

export const clearAuthData = () => {
  try {
    // Limpiar solo datos relacionados con autenticación
    if (typeof window !== 'undefined') {
      // Limpiar tokens específicos
      const authKeys = [
        'auth-token',
        'user',
        'session',
        'auth',
        'login',
        'userData',
        'profile'
      ];

      // Limpiar localStorage
      authKeys.forEach(key => {
        if (localStorage.getItem(key)) {
          localStorage.removeItem(key);
        }
      });

      // Limpiar sessionStorage
      authKeys.forEach(key => {
        if (sessionStorage.getItem(key)) {
          sessionStorage.removeItem(key);
        }
      });

      console.log('🧹 Datos de autenticación limpiados');
    }
  } catch (error) {
    console.error('Error limpiando datos de autenticación:', error);
  }
};

export const forcePageReload = () => {
  if (typeof window !== 'undefined') {
    // Limpiar todo el almacenamiento
    clearBrowserStorage();
    
    // Forzar recarga completa de la página
    window.location.reload(true);
  }
};
