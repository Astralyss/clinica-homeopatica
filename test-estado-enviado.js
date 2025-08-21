// Archivo de prueba específico para el estado "enviado"
// Ejecutar con: node test-estado-enviado.js

const testEstadoEnviado = async () => {
  try {
    console.log('🧪 Probando específicamente el estado "enviado"...\n');

    // 1. Obtener lista de pedidos
    console.log('1️⃣ Obteniendo lista de pedidos...');
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
      envio: primerPedido.envio?.estado,
      numeroGuia: primerPedido.envio?.numeroGuia,
      empresaEnvio: primerPedido.envio?.empresaEnvio
    });

    // 2. Probar cambio a estado "enviado"
    console.log('\n2️⃣ Probando cambio a estado "enviado"...');
    const editData = {
      compraId: primerPedido.id,
      numeroGuia: 'ENVIADO123',
      empresaEnvio: 'FedEx',
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

    // 3. Verificar que los cambios se aplicaron
    console.log('\n3️⃣ Verificando cambios aplicados...');
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

      // Verificar que el estado sea correcto
      if (pedidoActualizado.estado === 'enviada' && pedidoActualizado.envio?.estado === 'enviado') {
        console.log('🎉 ¡ÉXITO! El estado "enviado" se aplicó correctamente');
      } else {
        console.log('⚠️ El estado no se aplicó como se esperaba');
        console.log('   - Estado de compra esperado: enviada, actual: ' + pedidoActualizado.estado);
        console.log('   - Estado de envío esperado: enviado, actual: ' + pedidoActualizado.envio?.estado);
      }
    } else {
      console.error('❌ No se pudo encontrar el pedido actualizado');
    }

    // 4. Probar cambio de vuelta a "confirmado"
    console.log('\n4️⃣ Probando cambio de vuelta a "confirmado"...');
    const editData2 = {
      compraId: primerPedido.id,
      numeroGuia: 'CONFIRMADO123',
      empresaEnvio: 'DHL',
      estadoEnvio: 'pendiente',
      estadoCompra: 'confirmada'
    };

    console.log('📤 Datos enviados (confirmado):', editData2);

    const editResponse2 = await fetch('http://localhost:3000/api/admin/ordenes', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editData2)
    });

    if (!editResponse2.ok) {
      const errorData = await editResponse2.json();
      console.error('❌ Error en la segunda edición:', errorData);
      return;
    }

    const editResult2 = await editResponse2.json();
    console.log('✅ Segunda edición exitosa:', editResult2);

    // 5. Verificar el estado final
    console.log('\n5️⃣ Verificando estado final...');
    const finalResponse = await fetch('http://localhost:3000/api/admin/ordenes');
    const finalData = await finalResponse.json();
    
    const pedidoFinal = finalData.ordenes.find(p => p.id === primerPedido.id);
    if (pedidoFinal) {
      console.log('📊 Estado final del pedido:', {
        id: pedidoFinal.id,
        estado: pedidoFinal.estado,
        envio: pedidoFinal.envio?.estado,
        numeroGuia: pedidoFinal.envio?.numeroGuia,
        empresaEnvio: pedidoFinal.envio?.empresaEnvio
      });
    }

  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  }
};

// Ejecutar la prueba
testEstadoEnviado();
