const testDashboardAPI = async () => {
  try {
    console.log('🔍 Probando API del Dashboard...');
    
    const response = await fetch('http://localhost:3000/api/admin/dashboard');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log('✅ API del Dashboard funcionando correctamente');
    console.log('📊 Datos recibidos:');
    console.log('- Pedidos:', data.pedidos);
    console.log('- Productos:', data.productos);
    console.log('- Ventas:', data.ventas);
    console.log('- Consultas:', data.consultas);
    console.log('- Usuarios:', data.usuarios);
    console.log('- Financiero:', data.financiero);
    
    return data;
  } catch (error) {
    console.error('❌ Error al probar la API del Dashboard:', error.message);
    return null;
  }
};

// Ejecutar la prueba
testDashboardAPI(); 