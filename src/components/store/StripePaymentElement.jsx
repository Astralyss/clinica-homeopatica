"use client"
import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

// Cargar Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// Verificar que la key esté configurada
if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === 'pk_test_your_key_here') {
  console.error('⚠️ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY no está configurada correctamente');
}

// Componente interno del Payment Element
function CheckoutForm({ clientSecret, onSuccess, onError, amount, currency = 'mxn' }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message);
        setIsLoading(false);
        return;
      }

      // Confirmar el pago
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/farmacia/checkout/confirmacion`,
        },
        redirect: 'if_required',
      });

      if (confirmError) {
        if (confirmError.type === 'card_error' || confirmError.type === 'validation_error') {
          setError(confirmError.message);
        } else {
          setError('Ocurrió un error inesperado. Por favor, inténtalo de nuevo.');
        }
      } else {
        // Pago exitoso
        setSuccess(true);
        if (onSuccess) {
          onSuccess({
            status: 'succeeded',
            amount: amount,
            currency: currency,
            timestamp: new Date().toISOString(),
          });
        }
      }
    } catch (err) {
      console.error('Error al procesar pago:', err);
      setError('Ocurrió un error inesperado. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          ¡Pago Procesado Exitosamente!
        </h3>
        <p className="text-gray-600">
          Tu pago ha sido confirmado. Recibirás un email de confirmación pronto.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Información del pago */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total a pagar:</span>
          <span className="text-xl font-bold text-gray-900">
            {new Intl.NumberFormat('es-MX', {
              style: 'currency',
              currency: currency.toUpperCase(),
            }).format(amount)}
          </span>
        </div>
      </div>

      {/* Payment Element */}
      <div className="border border-gray-200 rounded-lg p-4">
        <PaymentElement 
          options={{
            layout: 'tabs',
            defaultValues: {
              billingDetails: {
                name: '',
                email: '',
                phone: '',
                address: {
                  country: 'MX',
                },
              },
            },
            fields: {
              billingDetails: {
                name: 'auto',
                email: 'auto',
                phone: 'auto',
                address: {
                  country: 'auto',
                  line1: 'auto',
                  line2: 'auto',
                  city: 'auto',
                  state: 'auto',
                  postalCode: 'auto',
                },
              },
            },
            terms: {
              card: 'auto',
            },
            wallets: {
              applePay: 'auto',
              googlePay: 'auto',
            },
          }}
        />
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}

      {/* Botón de pago */}
      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Procesando Pago...
          </>
        ) : (
          <>
            <CheckCircle className="w-5 h-5" />
            Confirmar Pago
          </>
        )}
      </button>

      {/* Información de seguridad */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          Tus datos están protegidos con encriptación SSL de 256 bits
        </p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <div className="w-8 h-5 bg-gray-200 rounded"></div>
          <div className="w-8 h-5 bg-gray-200 rounded"></div>
          <div className="w-8 h-5 bg-gray-200 rounded"></div>
        </div>
      </div>
    </form>
  );
}

// Componente principal que envuelve con Elements
export default function StripePaymentElement({ 
  clientSecret, 
  onSuccess, 
  onError, 
  amount, 
  currency = 'mxn' 
}) {
  const [stripeLoaded, setStripeLoaded] = useState(false);

  useEffect(() => {
    if (clientSecret) {
      setStripeLoaded(true);
    }
  }, [clientSecret]);

  if (!stripeLoaded || !clientSecret) {
    return (
      <div className="text-center py-8">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">Cargando formulario de pago...</p>
      </div>
    );
  }

  // Verificar si Stripe está configurado correctamente
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === 'pk_test_your_key_here') {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Configuración de Stripe Requerida
        </h3>
        <p className="text-gray-600 mb-4">
          Para procesar pagos, necesitas configurar las claves de Stripe en el archivo .env.local
        </p>
        <div className="bg-gray-50 rounded-lg p-4 text-left text-sm">
          <p className="font-medium mb-2">Agrega esto a tu archivo .env.local:</p>
          <code className="block bg-gray-100 p-2 rounded">
            NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_tu_key_real_aqui<br/>
            STRIPE_SECRET_KEY=sk_test_tu_key_real_aqui
          </code>
        </div>
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
            colorText: '#1f2937',
            colorDanger: '#dc2626',
            fontFamily: 'ui-sans-serif, system-ui, sans-serif',
            spacingUnit: '4px',
            borderRadius: '8px',
          },
        },
      }}
    >
      <CheckoutForm
        clientSecret={clientSecret}
        onSuccess={onSuccess}
        onError={onError}
        amount={amount}
        currency={currency}
      />
    </Elements>
  );
}
