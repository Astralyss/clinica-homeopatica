import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { clientSecret, paymentMethod } = await request.json();

    // Validar datos requeridos
    if (!clientSecret || !paymentMethod) {
      return NextResponse.json(
        { error: 'Datos de pago incompletos' },
        { status: 400 }
      );
    }

    // En producción, esto sería con Stripe real
    // const paymentIntent = await stripe.paymentIntents.confirm(clientSecret, {
    //   payment_method: paymentMethod,
    // });

    // Simulación para desarrollo
    const mockPaymentResult = {
      id: `pi_${Math.random().toString(36).substr(2, 9)}`,
      status: 'succeeded',
      amount: paymentMethod.amount || 1000,
      currency: 'mxn',
      payment_method: paymentMethod.id || 'pm_mock',
      created: Math.floor(Date.now() / 1000)
    };

    // Simular un pequeño delay para que parezca real
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      paymentIntent: mockPaymentResult,
      message: 'Pago procesado exitosamente'
    });

  } catch (error) {
    console.error('Error al confirmar pago:', error);
    return NextResponse.json(
      { error: 'Error al procesar el pago' },
      { status: 500 }
    );
  }
} 