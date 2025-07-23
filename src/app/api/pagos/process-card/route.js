import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { amount, cardData } = await request.json();

    // Validar datos requeridos
    if (!amount || !cardData) {
      return NextResponse.json(
        { error: 'Datos de pago incompletos' },
        { status: 400 }
      );
    }

    // Validar datos de tarjeta
    const validationErrors = [];
    
    if (!cardData.numero || cardData.numero.replace(/\s/g, '').length < 13) {
      validationErrors.push('Número de tarjeta inválido');
    }
    
    if (!cardData.nombre || cardData.nombre.trim().length < 2) {
      validationErrors.push('Nombre requerido');
    }
    
    if (!cardData.expiracion || !/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(cardData.expiracion)) {
      validationErrors.push('Fecha de expiración inválida');
    }
    
    if (!cardData.cvv || cardData.cvv.length < 3 || cardData.cvv.length > 4) {
      validationErrors.push('CVV inválido');
    }

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Datos de tarjeta inválidos', details: validationErrors },
        { status: 400 }
      );
    }

    // En producción, esto sería con Stripe real
    // const paymentMethod = await stripe.paymentMethods.create({
    //   type: 'card',
    //   card: {
    //     number: cardData.numero.replace(/\s/g, ''),
    //     exp_month: parseInt(cardData.expiracion.split('/')[0]),
    //     exp_year: parseInt('20' + cardData.expiracion.split('/')[1]),
    //     cvc: cardData.cvv,
    //   },
    // });

    // Simulación para desarrollo
    const mockPaymentMethod = {
      id: `pm_${Math.random().toString(36).substr(2, 9)}`,
      type: 'card',
      card: {
        brand: 'visa',
        last4: cardData.numero.slice(-4),
        exp_month: parseInt(cardData.expiracion.split('/')[0]),
        exp_year: parseInt('20' + cardData.expiracion.split('/')[1]),
      }
    };

    // Simular procesamiento de pago
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simular éxito (en producción esto dependería de Stripe)
    const mockPaymentResult = {
      id: `pi_${Math.random().toString(36).substr(2, 9)}`,
      status: 'succeeded',
      amount: Math.round(amount * 100), // Stripe usa centavos
      currency: 'mxn',
      payment_method: mockPaymentMethod.id,
      created: Math.floor(Date.now() / 1000),
      receipt_url: `https://receipt.stripe.com/${Math.random().toString(36).substr(2, 9)}`
    };

    return NextResponse.json({
      success: true,
      paymentIntent: mockPaymentResult,
      paymentMethod: mockPaymentMethod,
      message: 'Pago procesado exitosamente'
    });

  } catch (error) {
    console.error('Error al procesar pago con tarjeta:', error);
    return NextResponse.json(
      { error: 'Error al procesar el pago' },
      { status: 500 }
    );
  }
} 