// Script simple para probar la API de compras
// No requiere Prisma, solo hace una petición HTTP

async function testAPI() {
  try {
    console.log('🧪 Probando API de compras...');
    
    // Hacer una petición a la API de compras
    const response = await fetch('http://localhost:3000/api/compras?usuarioId=1');
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API respondió correctamente');
      console.log('📊 Total de compras:', data.total);
      
      // Buscar compras canceladas
      const comprasCanceladas = data.compras.filter(compra => compra.estado === 'cancelada');
      
      if (comprasCanceladas.length > 0) {
        console.log('🎯 Compras canceladas encontradas:', comprasCanceladas.length);
        
        comprasCanceladas.forEach((compra, index) => {
          console.log(`\n📋 Compra cancelada ${index + 1}:`);
          console.log(`   ID: ${compra.id}`);
          console.log(`   Orden: ${compra.numeroOrden}`);
          console.log(`   Estado: ${compra.estado}`);
          console.log(`   Motivo: ${compra.motivoCancelacion || 'NO HAY MOTIVO'}`);
          console.log(`   Cancelado por: ${compra.canceladoPor || 'NO HAY INFO'}`);
          console.log(`   Fecha cancelación: ${compra.fechaCancelacion || 'NO HAY FECHA'}`);
        });
        
        // Verificar si los campos de cancelación están presentes
        const tieneCamposCancelacion = comprasCanceladas.some(compra => 
          compra.motivoCancelacion && compra.canceladoPor && compra.fechaCancelacion
        );
        
        if (tieneCamposCancelacion) {
          console.log('\n🎉 ¡EXCELENTE! Los campos de cancelación están funcionando en la API');
        } else {
          console.log('\n❌ PROBLEMA: Los campos de cancelación NO están siendo devueltos por la API');
          console.log('💡 Esto significa que el problema está en el mapeo de la API');
        }
        
      } else {
        console.log('ℹ️ No hay compras canceladas para probar');
        console.log('💡 Necesitas crear y cancelar un pedido primero');
      }
      
    } else {
      console.log('❌ Error en la API:', response.status, response.statusText);
    }
    
  } catch (error) {
    console.error('❌ Error al probar la API:', error.message);
    console.log('💡 Asegúrate de que el servidor esté corriendo en http://localhost:3000');
  }
}

// Ejecutar la prueba
testAPI(); 