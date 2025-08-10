const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testCancelacion() {
  try {
    console.log('🧪 Iniciando prueba de cancelación...');

    // 1. Verificar si existe un usuario de prueba
    let usuario = await prisma.usuario.findFirst({
      where: { email: 'test@example.com' }
    });

    if (!usuario) {
      console.log('👤 Creando usuario de prueba...');
      usuario = await prisma.usuario.create({
        data: {
          email: 'test@example.com',
          nombre: 'Usuario',
          apellidoPaterno: 'Prueba',
          password: 'test123',
          rol: 'cliente'
        }
      });
      console.log('✅ Usuario creado:', usuario.id);
    }

    // 2. Verificar si existe un producto de prueba
    let producto = await prisma.producto.findFirst({
      where: { nombre: 'Producto Prueba' }
    });

    if (!producto) {
      console.log('📦 Creando producto de prueba...');
      producto = await prisma.producto.create({
        data: {
          nombre: 'Producto Prueba',
          descripcion: 'Producto para pruebas de cancelación',
          precio: 100.00,
          cantidad: 10,
          categoria: 'prueba',
          codigo: 'TEST001'
        }
      });
      console.log('✅ Producto creado:', producto.id);
    }

    // 3. Crear una compra de prueba
    console.log('🛒 Creando compra de prueba...');
    const compra = await prisma.compra.create({
      data: {
        usuarioId: usuario.id,
        numeroOrden: `ORD-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
        total: 100.00,
        estado: 'pendiente',
        fechaCompra: new Date(),
        items: {
          create: {
            productoId: producto.id,
            cantidad: 1,
            precioUnitario: 100.00
          }
        },
        direccion: {
          create: {
            nombre: 'Usuario Prueba',
            calle: 'Calle Prueba 123',
            colonia: 'Colonia Prueba',
            ciudad: 'Ciudad Prueba',
            estado: 'Estado Prueba',
            codigoPostal: '12345'
          }
        }
      },
      include: {
        items: true,
        direccion: true
      }
    });
    console.log('✅ Compra creada:', compra.id);

    // 4. Cancelar la compra
    console.log('❌ Cancelando compra...');
    const compraCancelada = await prisma.compra.update({
      where: { id: compra.id },
      data: {
        estado: 'cancelada',
        motivoCancelacion: 'Pedido cancelado por pruebas del sistema',
        fechaCancelacion: new Date(),
        canceladoPor: 'admin'
      }
    });
    console.log('✅ Compra cancelada');

    // 5. Verificar que los campos de cancelación estén presentes
    console.log('\n📋 Verificando campos de cancelación...');
    const compraVerificada = await prisma.compra.findUnique({
      where: { id: compra.id },
      select: {
        id: true,
        numeroOrden: true,
        estado: true,
        motivoCancelacion: true,
        fechaCancelacion: true,
        canceladoPor: true
      }
    });

    console.log('🔍 Resultado de la verificación:');
    console.log(JSON.stringify(compraVerificada, null, 2));

    if (compraVerificada.motivoCancelacion && compraVerificada.fechaCancelacion && compraVerificada.canceladoPor) {
      console.log('\n🎉 ¡PRUEBA EXITOSA! Los campos de cancelación están funcionando correctamente.');
    } else {
      console.log('\n❌ PRUEBA FALLIDA! Faltan campos de cancelación.');
    }

    console.log('\n📝 Para probar en la interfaz:');
    console.log(`1. Ve a /farmacia/mis-compras`);
    console.log(`2. Busca la orden: ${compraVerificada.numeroOrden}`);
    console.log(`3. Haz clic en "Ver detalles"`);
    console.log(`4. Deberías ver el motivo de cancelación`);

  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCancelacion(); 