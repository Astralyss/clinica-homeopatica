import { useState, useCallback } from 'react';
import StripePaymentService from '@/utils/services/stripeService';

export const useStripePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);

  // Procesar pago con tarjeta
  const processCardPayment = useCallback(async (amount, cardData, currency = 'mxn', metadata = {}) => {
    setLoading(true);
    setError(null);
    setPaymentStatus(null);

    try {
      // Validar datos de tarjeta
      const validation = StripePaymentService.validateCardData(cardData);
      if (!validation.isValid) {
        throw new Error(`Datos de tarjeta inválidos: ${validation.errors.join(', ')}`);
      }

      const result = await StripePaymentService.processCardPayment(amount, cardData, currency, metadata);
      
      if (result.success) {
        setPaymentStatus('succeeded');
        return result;
      } else if (result.requiresAction) {
        setPaymentStatus('requires_action');
        return result;
      } else {
        throw new Error(result.error || 'Error al procesar el pago');
      }
    } catch (err) {
      setError(err.message);
      setPaymentStatus('failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear PaymentIntent para tarjeta
  const createCardPaymentIntent = useCallback(async (amount, currency = 'mxn', metadata = {}) => {
    setLoading(true);
    setError(null);
    setPaymentStatus(null);

    try {
      const result = await StripePaymentService.createCardPaymentIntent(amount, currency, metadata);
      setPaymentStatus('intent_created');
      return result;
    } catch (err) {
      setError(err.message);
      setPaymentStatus('failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear PaymentIntent para OXXO
  const createOxxoPaymentIntent = useCallback(async (amount, customerEmail, customerName, currency = 'mxn', metadata = {}) => {
    setLoading(true);
    setError(null);
    setPaymentStatus(null);

    try {
      const result = await StripePaymentService.createOxxoPaymentIntent(amount, customerEmail, customerName, currency, metadata);
      setPaymentStatus('oxxo_created');
      return result;
    } catch (err) {
      setError(err.message);
      setPaymentStatus('failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Confirmar pago
  const confirmPayment = useCallback(async (clientSecret, paymentMethod) => {
    setLoading(true);
    setError(null);

    try {
      const result = await StripePaymentService.confirmPayment(clientSecret, paymentMethod);
      
      if (result.success) {
        setPaymentStatus('succeeded');
      } else if (result.requiresAction) {
        setPaymentStatus('requires_action');
      } else {
        setPaymentStatus('failed');
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      setPaymentStatus('failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Verificar estado de pago OXXO
  const checkOxxoPaymentStatus = useCallback(async (paymentIntentId) => {
    setLoading(true);
    setError(null);

    try {
      const result = await StripePaymentService.checkOxxoPaymentStatus(paymentIntentId);
      setPaymentStatus(result.paymentIntent.status);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Limpiar estado
  const clearPaymentState = useCallback(() => {
    setLoading(false);
    setError(null);
    setPaymentStatus(null);
  }, []);

  // Obtener métodos de pago disponibles
  const getAvailablePaymentMethods = useCallback(() => {
    return StripePaymentService.getAvailablePaymentMethods();
  }, []);

  // Formatear monto para Stripe
  const formatAmount = useCallback((amount) => {
    return StripePaymentService.formatAmount(amount);
  }, []);

  // Formatear monto para mostrar
  const formatDisplayAmount = useCallback((amountInCents) => {
    return StripePaymentService.formatDisplayAmount(amountInCents);
  }, []);

  return {
    // Estado
    loading,
    error,
    paymentStatus,
    
    // Métodos de pago
    processCardPayment,
    createCardPaymentIntent,
    createOxxoPaymentIntent,
    confirmPayment,
    checkOxxoPaymentStatus,
    
    // Utilidades
    clearPaymentState,
    getAvailablePaymentMethods,
    formatAmount,
    formatDisplayAmount,
    
    // Estados de pago
    isProcessing: loading,
    isSuccess: paymentStatus === 'succeeded',
    isFailed: paymentStatus === 'failed',
    requiresAction: paymentStatus === 'requires_action',
    isOxxoCreated: paymentStatus === 'oxxo_created',
  };
};

export default useStripePayment;
