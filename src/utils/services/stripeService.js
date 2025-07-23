// Servicio para manejar pagos con Stripe
// Nota: Este es un ejemplo básico. En producción necesitarías configurar Stripe correctamente

export class StripeService {
  constructor() {
    // En producción, esto vendría de variables de entorno
    this.stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  }

  // Crear un PaymentIntent
  async createPaymentIntent(amount, currency = 'mxn') {
    try {
      const response = await fetch('/api/pagos/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Stripe usa centavos
          currency: currency,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al crear el PaymentIntent');
      }

      const data = await response.json();
      return data.clientSecret;
    } catch (error) {
      console.error('Error en createPaymentIntent:', error);
      throw error;
    }
  }

  // Confirmar el pago
  async confirmPayment(clientSecret, paymentMethod) {
    try {
      const response = await fetch('/api/pagos/confirm-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientSecret,
          paymentMethod,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al confirmar el pago');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en confirmPayment:', error);
      throw error;
    }
  }

  // Procesar pago con tarjeta
  async processCardPayment(amount, cardData) {
    try {
      const response = await fetch('/api/pagos/process-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          cardData,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al procesar el pago con tarjeta');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en processCardPayment:', error);
      throw error;
    }
  }

  // Validar datos de tarjeta
  validateCardData(cardData) {
    const errors = {};

    // Validar número de tarjeta (Luhn algorithm básico)
    if (!cardData.numero || cardData.numero.replace(/\s/g, '').length < 13) {
      errors.numero = 'Número de tarjeta inválido';
    }

    // Validar nombre
    if (!cardData.nombre || cardData.nombre.trim().length < 2) {
      errors.nombre = 'Nombre requerido';
    }

    // Validar fecha de expiración
    const expRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!expRegex.test(cardData.expiracion)) {
      errors.expiracion = 'Formato inválido (MM/AA)';
    } else {
      const [month, year] = cardData.expiracion.split('/');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;

      if (parseInt(year) < currentYear || 
          (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        errors.expiracion = 'Tarjeta expirada';
      }
    }

    // Validar CVV
    if (!cardData.cvv || cardData.cvv.length < 3 || cardData.cvv.length > 4) {
      errors.cvv = 'CVV inválido';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  // Formatear número de tarjeta para mostrar
  formatCardNumber(number) {
    const cleaned = number.replace(/\s/g, '');
    const match = cleaned.match(/^(\d{4})(\d{4})(\d{4})(\d{4})$/);
    if (match) {
      return `${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
    }
    return number;
  }

  // Obtener tipo de tarjeta basado en el número
  getCardType(number) {
    const cleaned = number.replace(/\s/g, '');
    
    if (/^4/.test(cleaned)) return 'visa';
    if (/^5[1-5]/.test(cleaned)) return 'mastercard';
    if (/^3[47]/.test(cleaned)) return 'amex';
    if (/^6/.test(cleaned)) return 'discover';
    
    return 'unknown';
  }
}

// Instancia singleton
export const stripeService = new StripeService(); 