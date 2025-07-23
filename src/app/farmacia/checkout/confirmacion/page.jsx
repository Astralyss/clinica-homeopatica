"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  CheckCircle, 
  Package, 
  Truck, 
  Home,
  Mail,
  Phone,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function ConfirmacionPage() {
  const router = useRouter();

  // Generar número de orden aleatorio
  const numeroOrden = `ORD-${new Date().getFullYear()}-${Math.random().toString().slice(2, 8)}`;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          {/* Ícono de éxito */}
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-emerald-600" />
          </div>

          {/* Título */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            ¡Pago Exitoso!
          </h1>
          
          <p className="text-gray-600 mb-8">
            Tu pedido ha sido procesado correctamente. Te hemos enviado un email con los detalles.
          </p>

          {/* Número de orden */}
          <div className="bg-gray-50 rounded-lg p-4 mb-8">
            <p className="text-sm text-gray-600 mb-2">Número de Orden</p>
            <p className="text-xl font-bold text-emerald-600">{numeroOrden}</p>
          </div>

          {/* Información del pedido */}
          <div className="space-y-4 mb-8 text-left">
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
              <Package size={20} className="text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Estado del Pedido</p>
                <p className="text-sm text-blue-700">Confirmado - En preparación</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
              <Truck size={20} className="text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-900">Envío</p>
                <p className="text-sm text-green-700">Entrega estimada: 2-3 días hábiles</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
              <Mail size={20} className="text-purple-600 mt-0.5" />
              <div>
                <p className="font-medium text-purple-900">Confirmación por Email</p>
                <p className="text-sm text-purple-700">Recibirás actualizaciones por email</p>
              </div>
            </div>
          </div>

          {/* Próximos pasos */}
          <div className="bg-emerald-50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-emerald-900 mb-3">Próximos Pasos</h3>
            <div className="space-y-2 text-sm text-emerald-800">
              <p>1. Recibirás un email de confirmación en los próximos minutos</p>
              <p>2. Tu pedido será preparado y enviado en 24-48 horas</p>
              <p>3. Recibirás un email con el número de seguimiento</p>
              <p>4. Tu pedido llegará en 2-3 días hábiles</p>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="space-y-3">
            <Link href="/farmacia">
              <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2">
                <Home size={20} />
                Continuar Comprando
              </button>
            </Link>
            
            <button 
              onClick={() => router.push('/farmacia/mis-compras')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              Ver Mis Compras
              <ArrowRight size={20} />
            </button>
          </div>

          {/* Información de contacto */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">¿Tienes alguna pregunta?</p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Phone size={16} className="text-gray-500" />
                <span className="text-gray-600">(55) 1234-5678</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail size={16} className="text-gray-500" />
                <span className="text-gray-600">soporte@clinica.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 