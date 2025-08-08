import { NextResponse } from 'next/server';

// Almacenamiento temporal en memoria para métodos de pago
let metodosPagoAlmacenados = [
  {
    id: 1,
    tipo: 'tarjeta',
    numero: '**** **** **** 1234',
    nombre: 'Jaime García López',
    fechaVencimiento: '12/25',
    esDefault: true,
    stripePaymentMethodId: 'pm_1234567890'
  },
  {
    id: 2,
    tipo: 'paypal',
    email: 'jaime.garcia@email.com',
    esDefault: false,
    stripePaymentMethodId: 'pm_0987654321'
  }
];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const usuarioId = searchParams.get('usuarioId');

    console.log('💳 Obteniendo métodos de pago para usuario:', usuarioId);

    // En producción, esto vendría de la base de datos
    // const metodosPago = await prisma.metodoPago.findMany({
    //   where: { usuarioId: parseInt(usuarioId) },
    //   orderBy: { esDefault: 'desc' }
    // });

    return NextResponse.json({
      success: true,
      metodosPago: metodosPagoAlmacenados
    });

  } catch (error) {
    console.error('❌ Error al obtener métodos de pago:', error);
    return NextResponse.json(
      { error: 'Error al obtener métodos de pago' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { usuarioId, metodoPago } = body;

    console.log('💳 Agregando método de pago:', metodoPago);

    // En producción, esto integraría con Stripe
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    
    // // Crear PaymentMethod en Stripe
    // const paymentMethod = await stripe.paymentMethods.create({
    //   type: 'card',
    //   card: {
    //     token: metodoPago.token // Token de Stripe Elements
    //   }
    // });

    // // Guardar en base de datos
    // const nuevoMetodo = await prisma.metodoPago.create({
    //   data: {
    //     usuarioId: parseInt(usuarioId),
    //     tipo: 'tarjeta',
    //     numero: `**** **** **** ${metodoPago.numero.slice(-4)}`,
    //     nombre: metodoPago.nombre,
    //     fechaVencimiento: metodoPago.fechaVencimiento,
    //     esDefault: metodoPago.esDefault,
    //     stripePaymentMethodId: paymentMethod.id
    //   }
    // });

    // Crear nuevo método de pago
    const nuevoMetodo = {
      id: Date.now(),
      tipo: 'tarjeta',
      numero: `**** **** **** ${metodoPago.numero.slice(-4)}`,
      nombre: metodoPago.nombre,
      fechaVencimiento: metodoPago.fechaVencimiento,
      esDefault: metodoPago.esDefault,
      stripePaymentMethodId: `pm_${Date.now()}`
    };

    // Si es el método por defecto, quitar el default de los demás
    if (metodoPago.esDefault) {
      metodosPagoAlmacenados = metodosPagoAlmacenados.map(m => ({ ...m, esDefault: false }));
    }

    // Agregar el nuevo método
    metodosPagoAlmacenados.push(nuevoMetodo);

    console.log('✅ Método de pago agregado:', nuevoMetodo);

    return NextResponse.json({
      success: true,
      metodoPago: nuevoMetodo,
      message: 'Método de pago agregado correctamente'
    });

  } catch (error) {
    console.error('❌ Error al agregar método de pago:', error);
    return NextResponse.json(
      { error: 'Error al agregar método de pago' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const metodoId = searchParams.get('id');
    const usuarioId = searchParams.get('usuarioId');

    console.log(`🗑️ Eliminando método de pago ${metodoId} del usuario ${usuarioId}`);

    // En producción, esto eliminaría de Stripe y base de datos
    // const metodo = await prisma.metodoPago.findUnique({
    //   where: { id: parseInt(metodoId) }
    // });

    // if (metodo && metodo.stripePaymentMethodId) {
    //   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    //   await stripe.paymentMethods.detach(metodo.stripePaymentMethodId);
    // }

    // await prisma.metodoPago.delete({
    //   where: { id: parseInt(metodoId) }
    // });

    // Eliminar de la lista en memoria
    const metodoIndex = metodosPagoAlmacenados.findIndex(m => m.id === parseInt(metodoId));
    if (metodoIndex !== -1) {
      const metodoEliminado = metodosPagoAlmacenados[metodoIndex];
      metodosPagoAlmacenados.splice(metodoIndex, 1);
      
      // Si era el método por defecto y hay otros métodos, establecer el primero como default
      if (metodoEliminado.esDefault && metodosPagoAlmacenados.length > 0) {
        metodosPagoAlmacenados[0].esDefault = true;
      }
      
      console.log('✅ Método de pago eliminado:', metodoEliminado);
    }

    return NextResponse.json({
      success: true,
      message: 'Método de pago eliminado correctamente'
    });

  } catch (error) {
    console.error('❌ Error al eliminar método de pago:', error);
    return NextResponse.json(
      { error: 'Error al eliminar método de pago' },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { metodoId, esDefault } = body;

    console.log(`⭐ Estableciendo método ${metodoId} como predeterminado`);

    // En producción, esto actualizaría la base de datos
    // await prisma.metodoPago.updateMany({
    //   where: { usuarioId: parseInt(usuarioId) },
    //   data: { esDefault: false }
    // });

    // await prisma.metodoPago.update({
    //   where: { id: parseInt(metodoId) },
    //   data: { esDefault: true }
    // });

    // Actualizar en memoria
    metodosPagoAlmacenados = metodosPagoAlmacenados.map(metodo => ({
      ...metodo,
      esDefault: metodo.id === parseInt(metodoId)
    }));

    console.log('✅ Método establecido como predeterminado');

    return NextResponse.json({
      success: true,
      message: 'Método de pago establecido como predeterminado'
    });

  } catch (error) {
    console.error('❌ Error al actualizar método de pago:', error);
    return NextResponse.json(
      { error: 'Error al actualizar método de pago' },
      { status: 500 }
    );
  }
} 