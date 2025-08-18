import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { paymentIntentId } = await request.json();

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'ID del Payment Intent es requerido' },
        { status: 400 }
      );
    }

    // Obtener el Payment Intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (!paymentIntent) {
      return NextResponse.json(
        { error: 'Payment Intent no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100, // Convertir de centavos a pesos
      currency: paymentIntent.currency,
      paymentMethod: paymentIntent.payment_method,
      metadata: paymentIntent.metadata,
    });
  } catch (error) {
    console.error('Error al confirmar pago:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
