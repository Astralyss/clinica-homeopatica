"use client"
import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Shield, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';

export default function PaymentForm({ clientSecret, onPaymentSuccess, onPaymentError }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message || 'Error al enviar el formulario');
        setLoading(false);
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
          setError(confirmError.message || 'Error en el pago');
        } else {
          setError('Ocurrió un error inesperado. Por favor, inténtalo de nuevo.');
        }
        setLoading(false);
        return;
      }

      // Verificar el estado del pago
      const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
      
      if (paymentIntent.status === 'succeeded') {
        setSuccess(true);
        onPaymentSuccess?.(paymentIntent);
      } else if (paymentIntent.status === 'requires_action') {
        // El pago requiere autenticación adicional (3D Secure, etc.)
        const { error: actionError } = await stripe.confirmPayment({
          elements,
          clientSecret,
          confirmParams: {
            return_url: `${window.location.origin}/farmacia/checkout/confirmacion`,
          },
        });
        
        if (actionError) {
          setError('Error en la autenticación del pago');
        }
      } else {
        setError('El pago no se pudo completar');
      }
    } catch (err) {
      console.error('Error en el pago:', err);
      setError('Error inesperado en el proceso de pago');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
          <CheckCircle size={32} className="text-emerald-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">¡Pago Exitoso!</h3>
        <p className="text-emerald-600 mb-4">Tu pago ha sido procesado correctamente</p>
        <button
          onClick={() => onPaymentSuccess?.()}
          className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Continuar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Información de seguridad */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield size={20} className="text-emerald-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-emerald-800">
            <p className="font-medium">Pago seguro con Stripe</p>
            <p>Tus datos están protegidos con encriptación SSL de nivel bancario</p>
          </div>
        </div>
      </div>

      {/* Formulario de pago */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard size={20} className="text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Información de Pago</h3>
          </div>
          
          <PaymentElement
            options={{
              layout: {
                type: 'tabs',
                defaultCollapsed: false,
              },
              business: {
                name: 'Clínica Homeopática',
              },
              fields: {
                billingDetails: {
                  name: 'auto',
                  email: 'auto',
                  phone: 'auto',
                  address: 'auto',
                },
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
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-800">
                <p className="font-medium">Error en el pago</p>
                <p>{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Botón de pago */}
        <button
          type="submit"
          disabled={!stripe || loading}
          className="w-full px-6 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Procesando pago...
            </>
          ) : (
            <>
              <CreditCard size={20} />
              Pagar ahora
            </>
          )}
        </button>
      </form>

      {/* Información adicional */}
      <div className="text-center text-sm text-gray-500">
        <p>Al completar tu compra, aceptas nuestros términos y condiciones</p>
        <p className="mt-1">Los pagos son procesados por Stripe de forma segura</p>
      </div>
    </div>
  );
}
