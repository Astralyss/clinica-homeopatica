"use client"
import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from './PaymentForm';

// Cargar Stripe con la clave pública
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function StripePaymentElement({ amount, onPaymentSuccess, onPaymentError, onPaymentStatusChange }) {
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch('/api/stripe/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: amount,
            currency: 'mxn',
            metadata: {
              source: 'clinica_homeopatica_checkout',
            },
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error de la API:', errorData);
          throw new Error(errorData.error || 'Error al crear el Payment Intent');
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error('Error detallado:', err);
        setError(err.message || 'Error al inicializar el sistema de pagos');
      } finally {
        setLoading(false);
      }
    };

    if (amount > 0) {
      createPaymentIntent();
    }
  }, [amount]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        <span className="ml-3 text-gray-600">Inicializando pagos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No se pudo inicializar el sistema de pagos</p>
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#059669', // emerald-600
            colorBackground: '#ffffff',
            colorText: '#374151',
            colorDanger: '#dc2626',
            fontFamily: 'ui-sans-serif, system-ui, sans-serif',
            spacingUnit: '4px',
            borderRadius: '8px',
          },
        },
        loader: 'always',
      }}
    >
      <PaymentForm
        clientSecret={clientSecret}
        onPaymentSuccess={onPaymentSuccess}
        onPaymentError={onPaymentError}
        onPaymentStatusChange={onPaymentStatusChange}
      />
    </Elements>
  );
}
