# Implementación de Stripe - Sistema de Pagos

## Descripción
Este documento describe la implementación completa del sistema de pagos con Stripe en la Clínica Homeopática, incluyendo tarjetas de crédito/débito y pagos en OXXO.

## Características Implementadas

### ✅ Métodos de Pago Soportados
- **Tarjetas de Crédito/Débito**: Visa, Mastercard, American Express
- **Pagos en OXXO**: Vouchers para pagos en efectivo en tiendas OXXO
- **Validaciones**: Verificación de datos de tarjeta en tiempo real
- **Seguridad**: Encriptación SSL y manejo seguro de datos

### ✅ APIs Implementadas
- `/api/pagos/create-payment-intent` - Crear PaymentIntent
- `/api/pagos/confirm-payment` - Confirmar pagos
- `/api/pagos/process-card` - Procesar pagos con tarjeta
- `/api/pagos/oxxo` - Manejar pagos OXXO

### ✅ Componentes Frontend
- `PaymentMethodSelector` - Selector de método de pago
- `CreditCardForm` - Formulario de tarjeta con validaciones
- `useStripePayment` - Hook personalizado para pagos
- `StripePaymentService` - Servicio de pagos

## Configuración Requerida

### 1. Variables de Entorno
Crear un archivo `.env.local` con las siguientes variables:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_... # Tu clave secreta de Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... # Tu clave pública de Stripe

# Base URL para la aplicación
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Otras configuraciones...
```

### 2. Instalación de Dependencias
Las dependencias ya están instaladas en `package.json`:
```json
{
  "stripe": "^18.3.0"
}
```

### 3. Configuración de Stripe
1. Crear cuenta en [Stripe](https://stripe.com)
2. Obtener claves de API desde el dashboard
3. Configurar webhooks para notificaciones de pago
4. Habilitar métodos de pago (tarjetas y OXXO)

## Uso del Sistema

### 1. Selección de Método de Pago
```jsx
import PaymentMethodSelector from '@/components/store/PaymentMethodSelector';

<PaymentMethodSelector
  selectedMethod={selectedMethod}
  onMethodChange={setSelectedMethod}
  amount={totalAmount}
  customerEmail={userEmail}
  customerName={userName}
  onOxxoGenerated={handleOxxoGenerated}
/>
```

### 2. Formulario de Tarjeta
```jsx
import CreditCardForm from '@/components/store/CreditCardForm';

<CreditCardForm
  onSubmit={handleCardPayment}
  loading={isProcessing}
  error={paymentError}
/>
```

### 3. Hook de Pagos
```jsx
import useStripePayment from '@/utils/hooks/useStripePayment';

const {
  processCardPayment,
  createOxxoPaymentIntent,
  loading,
  error,
  paymentStatus
} = useStripePayment();

// Procesar pago con tarjeta
await processCardPayment(amount, cardData, 'mxn', metadata);

// Crear pago OXXO
await createOxxoPaymentIntent(amount, email, name, 'mxn', metadata);
```

## Flujo de Pagos

### Tarjeta de Crédito/Débito
1. Usuario selecciona método "Tarjeta"
2. Completa formulario de tarjeta
3. Sistema valida datos en tiempo real
4. Se crea PaymentIntent en Stripe
5. Se procesa el pago
6. Se confirma el resultado

### Pago en OXXO
1. Usuario selecciona método "OXXO"
2. Completa información personal
3. Sistema genera voucher OXXO
4. Usuario recibe voucher por email
5. Paga en tienda OXXO
6. Sistema verifica estado del pago

## Manejo de Errores

### Errores de Tarjeta
- Número inválido
- Tarjeta expirada
- CVV incorrecto
- Fondos insuficientes
- Tarjeta rechazada

### Errores de OXXO
- Voucher expirado
- Información incompleta
- Error en generación

## Seguridad

### ✅ Implementado
- Validación de datos en frontend y backend
- Encriptación SSL para transmisión
- Manejo seguro de claves de Stripe
- Validación de montos y monedas
- Sanitización de inputs

### 🔒 Recomendaciones Adicionales
- Implementar rate limiting
- Agregar logging de transacciones
- Configurar alertas de fraude
- Implementar 3D Secure cuando sea requerido

## Testing

### Tarjetas de Prueba Stripe
```bash
# Tarjeta exitosa
4242 4242 4242 4242

# Tarjeta que requiere autenticación
4000 0025 0000 3155

# Tarjeta rechazada
4000 0000 0000 0002
```

### Comandos de Prueba
```bash
# Probar API de pagos
curl -X POST http://localhost:3000/api/pagos/create-payment-intent \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "currency": "mxn", "paymentMethod": "card"}'
```

## Monitoreo y Logs

### Logs Importantes
- Creación de PaymentIntent
- Confirmación de pagos
- Errores de procesamiento
- Cambios de estado de pagos

### Métricas a Monitorear
- Tasa de éxito de pagos
- Tiempo de procesamiento
- Errores por método de pago
- Volumen de transacciones

## Soporte y Mantenimiento

### Actualizaciones de Stripe
- Mantener SDK actualizado
- Revisar cambios en API
- Probar funcionalidad después de updates

### Monitoreo de Webhooks
- Verificar entregas exitosas
- Revisar logs de errores
- Mantener endpoints seguros

## Recursos Adicionales

### Documentación Oficial
- [Stripe API Reference](https://stripe.com/docs/api)
- [Stripe Elements](https://stripe.com/docs/stripe-js)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)

### Herramientas de Desarrollo
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
- [Stripe Dashboard](https://dashboard.stripe.com)
- [Stripe Test Mode](https://stripe.com/docs/testing)

---

**Nota**: Este sistema está configurado para funcionar en modo de prueba. Para producción, cambiar las claves de test por las de live y configurar webhooks apropiados.
