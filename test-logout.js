// Test para verificar el funcionamiento del logout
// Ejecutar con: node test-logout.js

const BASE_URL = 'http://localhost:3000';

async function testLogout() {
  console.log('🧪 Iniciando test de logout...\n');

  try {
    // 1. Simular login (necesitarás credenciales válidas)
    console.log('1️⃣ Intentando login...');
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com', // Cambiar por email válido
        password: 'password123'    // Cambiar por password válido
      }),
      credentials: 'include'
    });

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login exitoso:', loginData.message);
      
      // 2. Verificar que la sesión esté activa
      console.log('\n2️⃣ Verificando sesión activa...');
      const verifyResponse = await fetch(`${BASE_URL}/api/auth/verificar`, {
        credentials: 'include'
      });
      
      if (verifyResponse.ok) {
        const verifyData = await verifyResponse.json();
        console.log('✅ Sesión verificada:', verifyData.usuario.email);
        
        // 3. Realizar logout
        console.log('\n3️⃣ Realizando logout...');
        const logoutResponse = await fetch(`${BASE_URL}/api/auth/logout`, {
          method: 'POST',
          credentials: 'include'
        });
        
        if (logoutResponse.ok) {
          const logoutData = await logoutResponse.json();
          console.log('✅ Logout exitoso:', logoutData.message);
          
          // 4. Verificar que la sesión se haya cerrado
          console.log('\n4️⃣ Verificando que la sesión se haya cerrado...');
          const verifyAfterLogout = await fetch(`${BASE_URL}/api/auth/verificar`, {
            credentials: 'include'
          });
          
          if (verifyAfterLogout.status === 401) {
            console.log('✅ Sesión cerrada correctamente - API retorna 401');
          } else {
            console.log('❌ Error: La sesión no se cerró correctamente');
            const verifyData = await verifyAfterLogout.json();
            console.log('Respuesta:', verifyData);
          }
          
        } else {
          console.log('❌ Error en logout:', logoutResponse.status);
        }
        
      } else {
        console.log('❌ Error verificando sesión:', verifyResponse.status);
      }
      
    } else {
      console.log('❌ Error en login:', loginResponse.status);
      const errorData = await loginResponse.json();
      console.log('Error:', errorData);
    }
    
  } catch (error) {
    console.error('❌ Error en el test:', error);
  }
}

// Ejecutar el test
testLogout();
