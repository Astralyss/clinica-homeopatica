# Configuración de Stripe Real

## Pasos para implementar Stripe en producción

### 1. Crear cuenta en Stripe
- Ve a [stripe.com](https://stripe.com) y crea una cuenta
- Completa la verificación de identidad
- Activa tu cuenta para recibir pagos

### 2. Obtener las API Keys
- En el Dashboard de Stripe, ve a **Developers > API keys**
- Copia la **Publishable key** (pk_test_... o pk_live_...)
- Copia la **Secret key** (sk_test_... o sk_live_...)

### 3. Configurar variables de entorno
Crea un archivo `.env.local` en la raíz del proyecto con:

```bash
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here

# Base URL for the application
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. Configurar webhooks (opcional pero recomendado)
- En el Dashboard de Stripe, ve a **Developers > Webhooks**
- Crea un nuevo endpoint con la URL: `https://tu-dominio.com/api/webhooks/stripe`
- Selecciona los eventos: `payment_intent.succeeded`, `payment_intent.payment_failed`

### 5. Configurar métodos de pago
- En el Dashboard de Stripe, ve a **Settings > Payment methods**
- Activa los métodos de pago que quieras aceptar:
  - Tarjetas de crédito/débito
  - Apple Pay
  - Google Pay
  - OXXO (para México)

### 6. Configurar monedas
- En el Dashboard de Stripe, ve a **Settings > Business settings**
- Configura las monedas que quieres aceptar (MXN, USD, etc.)

### 7. Probar la integración
- Usa las tarjetas de prueba de Stripe:
  - **Visa**: 4242 4242 4242 4242
  - **Mastercard**: 5555 5555 5555 4444
  - **Declinada**: 4000 0000 0000 0002

### 8. Cambiar a modo producción
Cuando estés listo para producción:
- Cambia las keys de test a live
- Actualiza la URL base en las variables de entorno
- Configura los webhooks con la URL de producción

## Características implementadas

### ✅ Payment Element
- Formulario de pago moderno y seguro
- Validación automática de tarjetas
- Soporte para Apple Pay y Google Pay
- Diseño responsive y accesible

### ✅ Manejo de errores
- Validación de datos de pago
- Manejo de errores de Stripe
- Mensajes de error en español

### ✅ Seguridad
- Encriptación SSL
- No se almacenan datos de tarjeta
- Cumple con PCI DSS

### ✅ Integración con la base de datos
- Registro de compras
- Almacenamiento de PaymentIntent ID
- Historial de transacciones

## Archivos modificados

- `src/utils/stripe.js` - Configuración de Stripe
- `src/utils/services/stripeService.js` - Servicio de pagos
- `src/components/store/StripePaymentElement.jsx` - Componente de pago
- `src/app/api/pagos/create-payment-intent/route.js` - API para crear PaymentIntent
- `src/app/api/pagos/confirm-payment/route.js` - API para confirmar pagos
- `src/app/farmacia/checkout/page.jsx` - Página de checkout actualizada

## Dependencias instaladas

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

## Notas importantes

1. **Nunca expongas tu STRIPE_SECRET_KEY** en el frontend
2. **Siempre usa HTTPS** en producción
3. **Maneja los errores** de forma apropiada
4. **Prueba exhaustivamente** antes de ir a producción
5. **Mantén actualizadas** las dependencias de Stripe

## Soporte

- [Documentación oficial de Stripe](https://stripe.com/docs)
- [Stripe Elements](https://stripe.com/docs/stripe-js)
- [Payment Element](https://stripe.com/docs/payments/payment-element)
- [Webhooks](https://stripe.com/docs/webhooks)
