import React, { useState, useEffect } from 'react';
import { CreditCard, Store, CheckCircle, Shield, Clock, Info } from 'lucide-react';

const PaymentMethodSelector = ({ 
  metodoPago, 
  onMetodoPagoChange, 
  amount,
  customerEmail,
  customerName,
  onOxxoGenerated,
  onOxxoDataChange,
  onOxxoVoucherGenerated
}) => {
  const [showOxxoForm, setShowOxxoForm] = useState(false);
  const [oxxoFormData, setOxxoFormData] = useState({
    email: customerEmail || '',
    name: customerName || '',
  });

  const paymentMethods = [
    {
      id: 'card',
      name: 'Tarjeta de Crédito/Débito',
      description: 'Visa, Mastercard, American Express',
      icon: <CreditCard className="w-5 h-5" />,
      color: 'bg-slate-50 border-slate-200 hover:border-slate-300',
      selectedColor: 'bg-blue-50 border-blue-300 ring-2 ring-blue-100',
      iconColor: 'text-slate-600',
      selectedIconColor: 'text-blue-600',
    },
    {
      id: 'oxxo',
      name: 'Pago en OXXO',
      description: 'Paga en efectivo en cualquier tienda OXXO',
      icon: <Store className="w-5 h-5" />,
      color: 'bg-slate-50 border-slate-200 hover:border-slate-300',
      selectedColor: 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-100',
      iconColor: 'text-slate-600',
      selectedIconColor: 'text-emerald-600',
    },
  ];

  const handleMethodSelect = (methodId) => {
    onMetodoPagoChange(methodId);
    if (methodId === 'oxxo') {
      setShowOxxoForm(true);
    } else {
      setShowOxxoForm(false);
    }
  };

  const handleOxxoFormSubmit = (e) => {
    e.preventDefault();
    
    // Validar que los campos estén llenos
    if (!oxxoFormData.email || !oxxoFormData.name) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }
    
    // Sincronizar con el checkout
    if (onOxxoDataChange) {
      onOxxoDataChange(oxxoFormData);
    }
    
    // Notificar que el voucher OXXO está listo para generar
    if (onOxxoVoucherGenerated) {
      onOxxoVoucherGenerated(oxxoFormData);
    }
    
    // También llamar a la función original si existe
    if (onOxxoGenerated) {
      onOxxoGenerated(oxxoFormData);
    }
    
    // Mostrar mensaje de éxito
    alert('¡Voucher OXXO generado exitosamente! Avanzando al siguiente paso...');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newData = {
      ...oxxoFormData,
      [name]: value
    };
    
    setOxxoFormData(newData);
    
    // Sincronizar con el estado del checkout
    if (onOxxoDataChange) {
      onOxxoDataChange(newData);
    }
  };

  // Sincronizar datos cuando cambien las props
  useEffect(() => {
    if (customerEmail || customerName) {
      const newData = {
        email: customerEmail || '',
        name: customerName || '',
      };
      setOxxoFormData(newData);
      
      // Sincronizar con el checkout
      if (onOxxoDataChange) {
        onOxxoDataChange(newData);
      }
    }
  }, [customerEmail, customerName, onOxxoDataChange]);

  return (
    <div className="space-y-8">
      {/* Título mejorado */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl mb-4">
          <Shield className="w-6 h-6 text-slate-600" />
        </div>
        <h3 className="text-xl font-semibold text-slate-800 mb-2">
          Selecciona tu método de pago
        </h3>
        <p className="text-slate-600 text-sm">
          Total a pagar: <span className="font-semibold text-lg text-slate-800">${amount?.toFixed(2)} MXN</span>
        </p>
      </div>

      {/* Métodos de pago mejorados */}
      <div className="grid gap-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`relative p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
              metodoPago === method.id
                ? method.selectedColor
                : method.color
            } hover:shadow-md group`}
            onClick={() => handleMethodSelect(method.id)}
          >
            {/* Checkmark para método seleccionado */}
            {metodoPago === method.id && (
              <div className="absolute top-4 right-4">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                </div>
              </div>
            )}

            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg transition-colors duration-200 ${
                metodoPago === method.id 
                  ? 'bg-white shadow-sm' 
                  : 'bg-slate-100 group-hover:bg-slate-200'
              }`}>
                <div className={`transition-colors duration-200 ${
                  metodoPago === method.id ? method.selectedIconColor : method.iconColor
                }`}>
                  {method.icon}
                </div>
              </div>
              
              <div className="flex-1">
                <h4 className="font-semibold text-slate-800 mb-1 text-base">
                  {method.name}
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {method.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Formulario OXXO mejorado */}
      {showOxxoForm && metodoPago === 'oxxo' && (
        <div className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center">
              <Store className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-slate-800">
                Información para pago OXXO
              </h4>
              <p className="text-sm text-slate-600">Completa los datos para generar tu voucher</p>
            </div>
          </div>
          
          <form onSubmit={handleOxxoFormSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="oxxo-name" className="block text-sm font-medium text-slate-700 mb-2">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  id="oxxo-name"
                  name="name"
                  value={oxxoFormData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white"
                  placeholder="Tu nombre completo"
                />
              </div>
              
              <div>
                <label htmlFor="oxxo-email" className="block text-sm font-medium text-slate-700 mb-2">
                  Correo electrónico *
                </label>
                <input
                  type="email"
                  id="oxxo-email"
                  name="email"
                  value={oxxoFormData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            {/* Información importante mejorada */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Info className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-3">Información importante:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>El voucher OXXO expirará en 3 días</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Deberás pagar en cualquier tienda OXXO</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Recibirás confirmación por email cuando se procese el pago</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 shadow-md hover:shadow-lg transform hover:scale-[1.01]"
            >
              Generar Voucher OXXO
            </button>
          </form>
        </div>
      )}

      {/* Información adicional mejorada */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 text-slate-500 bg-slate-100 px-4 py-2 rounded-full">
          <Shield className="w-4 h-4 text-slate-400" />
          <p className="text-sm font-medium">
            Todos los pagos son procesados de forma segura por Stripe
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
