import Stripe from 'stripe';

// Configuración de Stripe con keys reales
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
});

export default stripe;

// Configuraciones para diferentes métodos de pago
export const PAYMENT_METHODS = {
  CARD: 'card',
  OXXO: 'oxxo',
};

// Configuración de monedas soportadas
export const SUPPORTED_CURRENCIES = ['mxn', 'usd'];

// Configuración para pagos en OXXO
export const OXXO_CONFIG = {
  expires_after_days: 3,
  display_details: {
    name: 'Clínica Homeopática',
    email: 'pagos@clinica-homeopatica.com',
  },
};

// Configuración para pagos con tarjeta usando Payment Element
export const CARD_CONFIG = {
  automatic_payment_methods: {
    enabled: true,
  },
  capture_method: 'automatic',
  payment_method_types: ['card'],
  setup_future_usage: 'off_session', // Para futuras compras del usuario
};

// Configuración del Payment Element
export const PAYMENT_ELEMENT_OPTIONS = {
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
};
