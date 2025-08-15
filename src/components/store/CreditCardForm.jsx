import React, { useState, useEffect } from 'react';
import { CreditCard, Lock, AlertCircle } from 'lucide-react';

const CreditCardForm = ({ onSubmit, loading = false, error = null }) => {
  const [formData, setFormData] = useState({
    numero: '',
    nombre: '',
    expiracion: '',
    cvv: '',
  });

  const [errors, setErrors] = useState({});
  const [cardType, setCardType] = useState('');

  // Detectar tipo de tarjeta basado en el número
  useEffect(() => {
    const number = formData.numero.replace(/\s/g, '');
    if (number.startsWith('4')) {
      setCardType('visa');
    } else if (number.startsWith('5')) {
      setCardType('mastercard');
    } else if (number.startsWith('3')) {
      setCardType('amex');
    } else {
      setCardType('');
    }
  }, [formData.numero]);

  // Formatear número de tarjeta
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Formatear fecha de expiración
  const formatExpiration = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};

    // Validar número de tarjeta
    if (!formData.numero || formData.numero.replace(/\s/g, '').length < 13) {
      newErrors.numero = 'Número de tarjeta inválido';
    }

    // Validar nombre
    if (!formData.nombre || formData.nombre.trim().length < 2) {
      newErrors.nombre = 'Nombre requerido';
    }

    // Validar fecha de expiración
    if (!formData.expiracion || !/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(formData.expiracion)) {
      newErrors.expiracion = 'Fecha de expiración inválida';
    } else {
      const [month, year] = formData.expiracion.split('/');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;

      if (parseInt(year) < currentYear || 
          (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        newErrors.expiracion = 'Tarjeta expirada';
      }
    }

    // Validar CVV
    if (!formData.cvv || formData.cvv.length < 3 || formData.cvv.length > 4) {
      newErrors.cvv = 'CVV inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Aplicar formateo según el campo
    if (name === 'numero') {
      formattedValue = formatCardNumber(value);
    } else if (name === 'expiracion') {
      formattedValue = formatExpiration(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const getCardIcon = () => {
    switch (cardType) {
      case 'visa':
        return '💳'; // En producción usarías el logo real de Visa
      case 'mastercard':
        return '💳'; // En producción usarías el logo real de Mastercard
      case 'amex':
        return '💳'; // En producción usarías el logo real de Amex
      default:
        return <CreditCard className="w-6 h-6" />;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center space-x-3 mb-6">
        <CreditCard className="w-6 h-6 text-blue-600" />
        <h4 className="text-lg font-semibold text-gray-900">
          Información de tarjeta
        </h4>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Número de tarjeta */}
        <div>
          <label htmlFor="card-number" className="block text-sm font-medium text-gray-700 mb-2">
            Número de tarjeta *
          </label>
          <div className="relative">
            <input
              type="text"
              id="card-number"
              name="numero"
              value={formData.numero}
              onChange={handleInputChange}
              maxLength="19"
              className={`w-full pl-12 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.numero ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="1234 5678 9012 3456"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {getCardIcon()}
            </div>
          </div>
          {errors.numero && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.numero}
            </p>
          )}
        </div>

        {/* Nombre del titular */}
        <div>
          <label htmlFor="card-name" className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del titular *
          </label>
          <input
            type="text"
            id="card-name"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.nombre ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Como aparece en la tarjeta"
          />
          {errors.nombre && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.nombre}
            </p>
          )}
        </div>

        {/* Fecha de expiración y CVV */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="card-expiry" className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de expiración *
            </label>
            <input
              type="text"
              id="card-expiry"
              name="expiracion"
              value={formData.expiracion}
              onChange={handleInputChange}
              maxLength="5"
              className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.expiracion ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="MM/YY"
            />
            {errors.expiracion && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.expiracion}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="card-cvv" className="block text-sm font-medium text-gray-700 mb-2">
              CVV *
            </label>
            <input
              type="text"
              id="card-cvv"
              name="cvv"
              value={formData.cvv}
              onChange={handleInputChange}
              maxLength="4"
              className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.cvv ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="123"
            />
            {errors.cvv && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.cvv}
              </p>
            )}
          </div>
        </div>

        {/* Error general */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Información de seguridad */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Lock className="w-5 h-5 text-blue-400 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="font-medium">Pago seguro</p>
              <p>Tus datos están protegidos con encriptación SSL de 256 bits</p>
            </div>
          </div>
        </div>

        {/* Botón de envío */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {loading ? 'Procesando...' : 'Pagar ahora'}
        </button>
      </form>
    </div>
  );
};

export default CreditCardForm;
