import { NextResponse } from 'next/server';
import stripe from '@/utils/stripe';

export async function POST(request) {
  try {
    const { amount, currency = 'mxn', customerEmail, customerName, metadata = {} } = await request.json();

    // Validar datos requeridos
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Monto inválido' },
        { status: 400 }
      );
    }

    if (!customerEmail || !customerName) {
      return NextResponse.json(
        { error: 'Email y nombre del cliente son requeridos para pagos OXXO' },
        { status: 400 }
      );
    }

    // Crear PaymentIntent para OXXO
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe usa centavos
      currency: currency,
      payment_method_types: ['oxxo'],
      payment_method_data: {
        type: 'oxxo',
        oxxo: {
          expires_after_days: 3,
          display_details: {
            name: customerName,
            email: customerEmail,
          },
        },
      },
      metadata: {
        ...metadata,
        payment_method: 'oxxo',
        customer_email: customerEmail,
        customer_name: customerName,
        created_at: new Date().toISOString(),
      },
      receipt_email: customerEmail,
      description: `Pago OXXO - ${customerName}`,
    });

    // Obtener los detalles del voucher OXXO
    const oxxoDetails = paymentIntent.next_action?.oxxo_display_details;

    return NextResponse.json({
      success: true,
      paymentIntent: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        created: paymentIntent.created,
        expires_at: paymentIntent.expires_at,
      },
      oxxoDetails: {
        hosted_voucher_url: oxxoDetails?.hosted_voucher_url,
        expires_after_days: 3,
        customer_name: customerName,
        customer_email: customerEmail,
      },
      message: 'Voucher OXXO generado exitosamente',
    });

  } catch (error) {
    console.error('Error al crear pago OXXO:', error);
    
    // Manejar errores específicos de Stripe
    if (error.type === 'StripeInvalidRequestError') {
      return NextResponse.json(
        { error: 'Solicitud inválida', details: error.message },
        { status: 400 }
      );
    } else if (error.type === 'StripeAPIError') {
      return NextResponse.json(
        { error: 'Error del servidor de Stripe', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Endpoint para verificar el estado de un pago OXXO
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentIntentId = searchParams.get('paymentIntentId');

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'ID del PaymentIntent requerido' },
        { status: 400 }
      );
    }

    // Recuperar el PaymentIntent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    return NextResponse.json({
      success: true,
      paymentIntent: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        created: paymentIntent.created,
        expires_at: paymentIntent.expires_at,
        metadata: paymentIntent.metadata,
      },
      oxxoDetails: paymentIntent.next_action?.oxxo_display_details,
    });

  } catch (error) {
    console.error('Error al verificar pago OXXO:', error);
    
    if (error.type === 'StripeInvalidRequestError') {
      return NextResponse.json(
        { error: 'ID de PaymentIntent inválido' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
