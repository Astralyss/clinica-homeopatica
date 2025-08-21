// Archivo de prueba para verificar la API de edición de pedidos
// Ejecutar con: node test-edit-pedido.js

const testEditPedido = async () => {
  try {
    console.log('🧪 Probando la API de edición de pedidos...\n');

    // Primero obtener la lista de pedidos
    console.log('1. Obteniendo lista de pedidos...');
    const getResponse = await fetch('http://localhost:3000/api/admin/ordenes');
    const getData = await getResponse.json();
    
    if (!getData.success || !getData.ordenes || getData.ordenes.length === 0) {
      console.error('❌ No se pudieron obtener pedidos:', getData);
      return;
    }

    const primerPedido = getData.ordenes[0];
    console.log('✅ Pedido encontrado:', {
      id: primerPedido.id,
      numeroOrden: primerPedido.numeroOrden,
      estado: primerPedido.estado,
      envio: primerPedido.envio?.estado
    });

    // Probar edición del pedido
    console.log('\n2. Probando edición del pedido...');
    const editData = {
      compraId: primerPedido.id,
      numeroGuia: 'TEST123456',
      empresaEnvio: 'DHL',
      estadoEnvio: 'enviado',
      estadoCompra: 'enviada'
    };

    console.log('📤 Datos enviados:', editData);

    const editResponse = await fetch('http://localhost:3000/api/admin/ordenes', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editData)
    });

    console.log('📥 Respuesta de la API:', editResponse.status, editResponse.statusText);

    if (!editResponse.ok) {
      const errorData = await editResponse.json();
      console.error('❌ Error en la edición:', errorData);
      return;
    }

    const editResult = await editResponse.json();
    console.log('✅ Edición exitosa:', editResult);

    // Verificar que los cambios se aplicaron
    console.log('\n3. Verificando cambios aplicados...');
    const verifyResponse = await fetch('http://localhost:3000/api/admin/ordenes');
    const verifyData = await verifyResponse.json();
    
    const pedidoActualizado = verifyData.ordenes.find(p => p.id === primerPedido.id);
    if (pedidoActualizado) {
      console.log('✅ Pedido actualizado:', {
        id: pedidoActualizado.id,
        estado: pedidoActualizado.estado,
        envio: pedidoActualizado.envio?.estado,
        numeroGuia: pedidoActualizado.envio?.numeroGuia,
        empresaEnvio: pedidoActualizado.envio?.empresaEnvio
      });
    } else {
      console.error('❌ No se pudo encontrar el pedido actualizado');
    }

  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  }
};

// Ejecutar la prueba
testEditPedido();
