"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  ArrowLeft, 
  CreditCard, 
  MapPin, 
  User, 
  Phone, 
  Mail,
  Package,
  Truck,
  Shield,
  CheckCircle,
  AlertCircle,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import { useAuth } from '@/utils/hooks/useAuth';
import { useCarrito } from '@/utils/context/CarritoContext';
import { stripeService } from '@/utils/services/stripeService';

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { carrito, obtenerTotal, limpiarCarrito, loading: carritoLoading } = useCarrito();
  
  // Estados del formulario
  const [step, setStep] = useState(1); // 1: Dirección, 2: Pago, 3: Confirmación
  const [loading, setLoading] = useState(false);
  const [showEmptyMessage, setShowEmptyMessage] = useState(false);
  const [tieneDireccionGuardada, setTieneDireccionGuardada] = useState(false);
  const [modoEditarDireccion, setModoEditarDireccion] = useState(false);
  
  // Estados de dirección
  const [direccion, setDireccion] = useState({
    nombre: user?.nombre || '',
    apellido: user?.apellido || '',
    telefono: user?.telefono || '',
    email: user?.email || '',
    calle: '',
    numeroExterior: '',
    numeroInterior: '',
    colonia: '',
    ciudad: '',
    estado: '',
    codigoPostal: '',
    referencias: ''
  });

  // Estados de pago
  const [metodoPago, setMetodoPago] = useState('tarjeta');
  const [datosTarjeta, setDatosTarjeta] = useState({
    numero: '',
    nombre: '',
    expiracion: '',
    cvv: ''
  });

  // Verificar si el carrito está vacío
  useEffect(() => {
    if (!carritoLoading && carrito.length === 0) {
      setShowEmptyMessage(true);
    }
  }, [carrito, carritoLoading]);

  // Cargar dirección guardada del perfil
  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        if (!user?.id) return;
        const resp = await fetch(`/api/perfil?usuarioId=${user.id}`);
        if (!resp.ok) return;
        const data = await resp.json();
        const personal = data?.perfil?.personal;
        const d = data?.perfil?.direccion;
        setDireccion((prev) => ({
          ...prev,
          nombre: personal?.nombre || prev.nombre,
          apellido: personal?.apellidos || prev.apellido,
          telefono: personal?.telefono || prev.telefono,
          email: personal?.email || prev.email,
          calle: d?.calle || prev.calle,
          numeroExterior: d?.numero || prev.numeroExterior,
          colonia: d?.colonia || prev.colonia,
          ciudad: d?.ciudad || prev.ciudad,
          estado: d?.estado || prev.estado,
          codigoPostal: d?.codigoPostal || prev.codigoPostal,
          referencias: d?.referencias || prev.referencias,
        }));
        const hay = !!(d && (d.calle || d.colonia || d.ciudad || d.estado || d.codigoPostal));
        setTieneDireccionGuardada(hay);
        setModoEditarDireccion(!hay);
      } catch (e) {
        setTieneDireccionGuardada(false);
        setModoEditarDireccion(true);
      }
    };
    cargarPerfil();
  }, [user?.id]);

  // Formatear precio
  const formatPrice = (price) =>
    new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(price);

  // Calcular totales
  const subtotal = obtenerTotal();
  const envio = subtotal > 500 ? 0 : 150; // Envío gratuito sobre $500
  const total = subtotal + envio;

  // Validar dirección
  const validarDireccion = () => {
    const camposRequeridos = ['nombre', 'apellido', 'telefono', 'calle', 'colonia', 'ciudad', 'estado', 'codigoPostal'];
    return camposRequeridos.every(campo => direccion[campo]?.trim());
  };

  // Validar datos de pago
  const validarPago = () => {
    if (metodoPago === 'tarjeta') {
      return datosTarjeta.numero && datosTarjeta.nombre && datosTarjeta.expiracion && datosTarjeta.cvv;
    }
    return true;
  };

  // Siguiente paso
  const siguientePaso = () => {
    if (step === 1 && validarDireccion()) {
      setStep(2);
    } else if (step === 2 && validarPago()) {
      setStep(3);
    }
  };

  // Paso anterior
  const pasoAnterior = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Procesar pago
  const procesarPago = async () => {
    setLoading(true);
    
    try {
      if (!user?.id) {
        alert('Debes iniciar sesión para completar la compra.');
        router.push('/loginUsuario');
        return;
      }
      let paymentResult;

      if (metodoPago === 'tarjeta') {
        // Validar datos de tarjeta
        const validation = stripeService.validateCardData(datosTarjeta);
        if (!validation.isValid) {
          alert(`Error en datos de tarjeta: ${Object.values(validation.errors).join(', ')}`);
          return;
        }

        // Procesar pago con tarjeta
        paymentResult = await stripeService.processCardPayment(total, datosTarjeta);
      } else {
        // Para PayPal, crear PaymentIntent
        const clientSecret = await stripeService.createPaymentIntent(total);
        paymentResult = await stripeService.confirmPayment(clientSecret, {
          id: 'paypal_mock',
          amount: total
        });
      }

      if (paymentResult.success) {
        // Guardar/actualizar dirección en el perfil para futuras compras
        try {
          await fetch('/api/perfil', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              tipo: 'direccion',
              datos: {
                usuarioId: user.id,
                calle: direccion.calle,
                numero: direccion.numeroExterior,
                colonia: direccion.colonia,
                ciudad: direccion.ciudad,
                estado: direccion.estado,
                codigoPostal: direccion.codigoPostal,
                referencias: direccion.referencias,
              },
            }),
          });
        } catch {}
        // Construir payload de compra
        const payload = {
          usuarioId: user.id,
          direccion: {
            nombre: `${direccion.nombre} ${direccion.apellido}`.trim(),
            calle: direccion.calle,
            numeroExterior: direccion.numeroExterior,
            numeroInterior: direccion.numeroInterior,
            colonia: direccion.colonia,
            ciudad: direccion.ciudad,
            estado: direccion.estado,
            codigoPostal: direccion.codigoPostal,
            referencias: direccion.referencias,
          },
          items: carrito.map((item) => ({
            productoId: item.id,
            cantidad: item.cantidad,
          })),
          pago: {
            metodoPago: metodoPago === 'tarjeta' ? 'tarjeta' : 'paypal',
            estado: 'completado',
            moneda: 'MXN',
            paymentIntentId: paymentResult.paymentIntent?.id || null,
            success: true,
          },
        };

        const resp = await fetch('/api/compras', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!resp.ok) {
          throw new Error('No se pudo registrar la compra');
        }

        const data = await resp.json();
        // Guardar número de orden para pantalla de confirmación
        if (data?.compra?.numeroOrden) {
          try {
            sessionStorage.setItem('ultimaCompraNumero', data.compra.numeroOrden);
          } catch {}
        }

        // Limpiar carrito y redirigir a confirmación
        limpiarCarrito();
        router.push('/farmacia/checkout/confirmacion');
      } else {
        throw new Error('Error en el procesamiento del pago');
      }
      
    } catch (error) {
      console.error('Error al procesar pago:', error);
      alert('Error al procesar el pago. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambios en dirección
  const handleDireccionChange = (campo, valor) => {
    setDireccion(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  // Manejar cambios en datos de tarjeta
  const handleTarjetaChange = (campo, valor) => {
    let valorFormateado = valor;
    
    // Formatear número de tarjeta
    if (campo === 'numero') {
      const cleaned = valor.replace(/\s/g, '');
      const match = cleaned.match(/^(\d{4})(\d{4})(\d{4})(\d{4})$/);
      if (match) {
        valorFormateado = `${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
      } else {
        valorFormateado = cleaned.replace(/(\d{4})/g, '$1 ').trim();
      }
    }
    
    // Formatear fecha de expiración
    if (campo === 'expiracion') {
      const cleaned = valor.replace(/\D/g, '');
      if (cleaned.length >= 2) {
        valorFormateado = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
      } else {
        valorFormateado = cleaned;
      }
    }
    
    // Limitar CVV a 4 dígitos
    if (campo === 'cvv') {
      valorFormateado = valor.replace(/\D/g, '').slice(0, 4);
    }
    
    setDatosTarjeta(prev => ({
      ...prev,
      [campo]: valorFormateado
    }));
  };

  // Mostrar loading mientras se carga el carrito
  if (carritoLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando carrito...</p>
        </div>
      </div>
    );
  }

  if (showEmptyMessage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package size={64} className="mx-auto mb-6 text-gray-300" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tu carrito está vacío</h2>
          <p className="text-gray-600 mb-8">No tienes productos para procesar el checkout.</p>
          <button
            onClick={() => router.push('/farmacia')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Continuar comprando
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-white shadow-sm"
          >
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
            <p className="text-gray-600">Paso {step} de 3</p>
          </div>
        </div>

        {/* Indicador de progreso */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step >= 1 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <div className={`w-16 h-1 ${step >= 2 ? 'bg-emerald-600' : 'bg-gray-200'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step >= 2 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
              <div className={`w-16 h-1 ${step >= 3 ? 'bg-emerald-600' : 'bg-gray-200'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step >= 3 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                3
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-2 text-sm text-gray-600">
            <span className={step >= 1 ? 'text-emerald-600 font-medium' : ''}>Dirección</span>
            <span className="mx-4">•</span>
            <span className={step >= 2 ? 'text-emerald-600 font-medium' : ''}>Pago</span>
            <span className="mx-4">•</span>
            <span className={step >= 3 ? 'text-emerald-600 font-medium' : ''}>Confirmación</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario principal */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {step === 1 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <MapPin size={24} className="text-emerald-600" />
                    Dirección de Envío
                  </h2>

                  {tieneDireccionGuardada && !modoEditarDireccion ? (
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="font-semibold text-gray-900">{direccion.nombre} {direccion.apellido}</p>
                        <p className="text-gray-700">{direccion.calle} {direccion.numeroExterior}{direccion.numeroInterior ? `, Int. ${direccion.numeroInterior}` : ''}</p>
                        <p className="text-gray-700">{direccion.colonia}, {direccion.ciudad}, {direccion.estado} {direccion.codigoPostal}</p>
                        {direccion.referencias ? (
                          <p className="text-sm text-gray-500 mt-1">{direccion.referencias}</p>
                        ) : null}
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={() => setModoEditarDireccion(true)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Editar dirección
                        </button>
                      </div>
                    </div>
                  ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
                      <input
                        type="text"
                        value={direccion.nombre}
                        onChange={(e) => handleDireccionChange('nombre', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="Tu nombre"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Apellido *</label>
                      <input
                        type="text"
                        value={direccion.apellido}
                        onChange={(e) => handleDireccionChange('apellido', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="Tu apellido"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono *</label>
                      <input
                        type="tel"
                        value={direccion.telefono}
                        onChange={(e) => handleDireccionChange('telefono', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="(55) 1234-5678"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={direccion.email}
                        onChange={(e) => handleDireccionChange('email', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="tu@email.com"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Calle *</label>
                      <input
                        type="text"
                        value={direccion.calle}
                        onChange={(e) => handleDireccionChange('calle', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="Av. Insurgentes Sur"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Número Exterior *</label>
                      <input
                        type="text"
                        value={direccion.numeroExterior}
                        onChange={(e) => handleDireccionChange('numeroExterior', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="123"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Número Interior</label>
                      <input
                        type="text"
                        value={direccion.numeroInterior}
                        onChange={(e) => handleDireccionChange('numeroInterior', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="A"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Colonia *</label>
                      <input
                        type="text"
                        value={direccion.colonia}
                        onChange={(e) => handleDireccionChange('colonia', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="Del Valle"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad *</label>
                      <input
                        type="text"
                        value={direccion.ciudad}
                        onChange={(e) => handleDireccionChange('ciudad', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="Ciudad de México"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Estado *</label>
                      <input
                        type="text"
                        value={direccion.estado}
                        onChange={(e) => handleDireccionChange('estado', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="CDMX"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Código Postal *</label>
                      <input
                        type="text"
                        value={direccion.codigoPostal}
                        onChange={(e) => handleDireccionChange('codigoPostal', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="03100"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Referencias</label>
                      <textarea
                        value={direccion.referencias}
                        onChange={(e) => handleDireccionChange('referencias', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="Entre calles, puntos de referencia, etc."
                        rows={3}
                      />
                    </div>
                    {tieneDireccionGuardada && (
                      <div className="md:col-span-2">
                        <button
                          type="button"
                          onClick={() => setModoEditarDireccion(false)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Usar dirección guardada
                        </button>
                      </div>
                    )}
                  </div>
                  )}
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <CreditCard size={24} className="text-emerald-600" />
                    Método de Pago
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="metodoPago"
                          value="tarjeta"
                          checked={metodoPago === 'tarjeta'}
                          onChange={(e) => setMetodoPago(e.target.value)}
                          className="w-4 h-4 text-emerald-600"
                        />
                        <CreditCard size={20} className="text-emerald-600" />
                        <span className="font-medium">Tarjeta de Crédito/Débito</span>
                      </label>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="metodoPago"
                          value="paypal"
                          checked={metodoPago === 'paypal'}
                          onChange={(e) => setMetodoPago(e.target.value)}
                          className="w-4 h-4 text-emerald-600"
                        />
                        <span className="font-medium">PayPal</span>
                      </label>
                    </div>
                  </div>

                  {metodoPago === 'tarjeta' && (
                    <div className="mt-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Número de Tarjeta *</label>
                        <input
                          type="text"
                          value={datosTarjeta.numero}
                          onChange={(e) => handleTarjetaChange('numero', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Nombre en la Tarjeta *</label>
                          <input
                            type="text"
                            value={datosTarjeta.nombre}
                            onChange={(e) => handleTarjetaChange('nombre', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            placeholder="Juan Pérez"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Expiración *</label>
                            <input
                              type="text"
                              value={datosTarjeta.expiracion}
                              onChange={(e) => handleTarjetaChange('expiracion', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                              placeholder="MM/AA"
                              maxLength={5}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">CVV *</label>
                            <input
                              type="text"
                              value={datosTarjeta.cvv}
                              onChange={(e) => handleTarjetaChange('cvv', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                              placeholder="123"
                              maxLength={4}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Shield size={24} className="text-emerald-600" />
                    Confirmar Pedido
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Dirección de Envío</h3>
                      <p className="text-gray-700">
                        {direccion.nombre} {direccion.apellido}<br />
                        {direccion.calle} {direccion.numeroExterior}{direccion.numeroInterior ? ` Int. ${direccion.numeroInterior}` : ''}<br />
                        {direccion.colonia}, {direccion.ciudad}, {direccion.estado} {direccion.codigoPostal}<br />
                        Tel: {direccion.telefono}
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Método de Pago</h3>
                      <p className="text-gray-700">
                        {metodoPago === 'tarjeta' ? 'Tarjeta de Crédito/Débito' : 'PayPal'}
                        {metodoPago === 'tarjeta' && datosTarjeta.numero && (
                          <span className="block text-sm text-gray-500 mt-1">
                            Terminada en {datosTarjeta.numero.slice(-4)}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Botones de navegación */}
              <div className="flex justify-between mt-8">
                {step > 1 && (
                  <button
                    onClick={pasoAnterior}
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Anterior
                  </button>
                )}
                
                <div className="ml-auto">
                  {step < 3 ? (
                    <button
                      onClick={siguientePaso}
                      disabled={step === 1 ? !validarDireccion() : !validarPago()}
                      className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                    >
                      Continuar
                    </button>
                  ) : (
                    <button
                      onClick={procesarPago}
                      disabled={loading}
                      className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Procesando...
                        </>
                      ) : (
                        <>
                          <CreditCard size={20} />
                          Confirmar Compra
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Resumen del Pedido</h2>
              
              {/* Productos */}
              <div className="space-y-4 mb-6">
                {carrito.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative w-12 h-12 bg-gray-50 rounded-lg border border-gray-100 overflow-hidden flex-shrink-0">
                      <Image
                        src={item.imagenes && item.imagenes.length > 0 ? item.imagenes[0].url : '/productos/placeholder.png'}
                        alt={item.nombre}
                        fill
                        className="object-contain"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm truncate">{item.nombre}</h3>
                      <p className="text-xs text-gray-500">Cantidad: {item.cantidad}</p>
                    </div>
                    <div className="text-sm font-semibold text-emerald-700">
                      {formatPrice(item.precio * item.cantidad)}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Totales */}
              <div className="space-y-3 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Envío:</span>
                  <span className={envio === 0 ? 'text-emerald-600' : ''}>
                    {envio === 0 ? 'Gratis' : formatPrice(envio)}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total:</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {/* Información adicional */}
              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg">
                  <Truck size={20} className="text-emerald-600 mt-0.5" />
                  <div className="text-sm text-emerald-800">
                    <p className="font-medium">Envío seguro</p>
                    <p>Entrega en 2-3 días hábiles</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <Shield size={20} className="text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Pago seguro</p>
                    <p>Datos encriptados con SSL</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 