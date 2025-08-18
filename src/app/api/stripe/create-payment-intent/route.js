import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    // Verificar que Stripe esté configurado
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY no está configurada');
      return NextResponse.json(
        { error: 'Configuración de Stripe incompleta' },
        { status: 500 }
      );
    }

    const { amount, currency = 'mxn', metadata = {} } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'El monto debe ser mayor a 0' },
        { status: 400 }
      );
    }

    console.log('Creando Payment Intent:', { amount, currency, metadata });

    // Crear Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe usa centavos
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },

      metadata: {
        ...metadata,
        created_at: new Date().toISOString(),
      },
    });

    console.log('Payment Intent creado exitosamente:', paymentIntent.id);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Error detallado al crear Payment Intent:', {
      message: error.message,
      type: error.type,
      code: error.code,
      stack: error.stack
    });
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error.message,
        type: error.type || 'unknown'
      },
      { status: 500 }
    );
  }
}
