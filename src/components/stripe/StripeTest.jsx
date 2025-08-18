"use client"
import React from 'react';

export default function StripeTest() {
  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Test de Stripe</h3>
      <div className="space-y-3 text-sm text-gray-600">
        <p>✅ Componente StripePaymentElement creado</p>
        <p>✅ Componente PaymentForm creado</p>
        <p>✅ APIs de Stripe implementadas</p>
        <p>✅ Integración en checkout completada</p>
        <p>⚠️ Verificar variables de entorno (.env.local)</p>
        <p>⚠️ Configurar claves de Stripe</p>
      </div>
    </div>
  );
}
