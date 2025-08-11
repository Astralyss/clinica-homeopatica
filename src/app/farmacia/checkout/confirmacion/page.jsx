"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CheckCircle, 
  Package, 
  Truck, 
  Home,
  Mail,
  Phone,
  ArrowRight,
  Clock,
  Shield,
  Star,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

export default function ConfirmacionPage() {
  const router = useRouter();
  const [numeroOrden, setNumeroOrden] = useState('');

  useEffect(() => {
    try {
      const n = sessionStorage.getItem('ultimaCompraNumero');
      if (n) setNumeroOrden(n);
      else setNumeroOrden(`ORD-${new Date().getFullYear()}-${Math.random().toString().slice(2, 8)}`);
    } catch {
      setNumeroOrden(`ORD-${new Date().getFullYear()}-${Math.random().toString().slice(2, 8)}`);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center py-10 px-4">
      <div className="max-w-3xl mx-auto w-full">
        {/* Header mejorado con elementos visuales */}
        <div className="text-center mb-12">
          {/* Icono principal con efectos */}
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
            <div className="relative inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-xl border-2 border-emerald-100">
              <CheckCircle size={32} className="text-emerald-600" />
            </div>
            {/* Elementos decorativos */}
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
              <Star size={10} className="text-white fill-current" />
            </div>
            <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-blue-400 rounded-full flex items-center justify-center">
              <Sparkles size={8} className="text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl font-light text-gray-800 mb-4 tracking-wide bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Compra Confirmada
          </h1>
          
          <div className="max-w-2xl mx-auto">
            <p className="text-gray-600 text-lg leading-relaxed mb-2">
              Tu pedido ha sido procesado exitosamente
            </p>
            <p className="text-gray-500 text-base">
              Gracias por confiar en nuestra clínica homeopática
            </p>
          </div>
        </div>

        {/* Tarjeta principal mejorada */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden relative">
          {/* Elementos decorativos de fondo */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-full -mr-12 -mt-12 opacity-60"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-blue-50 to-purple-50 rounded-full -ml-10 -mb-10 opacity-60"></div>
          
          {/* Header elegante mejorado */}
          <div className="relative bg-gradient-to-r from-gray-50 to-white px-8 py-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  <h2 className="text-2xl font-semibold text-gray-800">Orden #{numeroOrden || '—'}</h2>
                </div>
                <p className="text-gray-500 text-sm">Fecha: {new Date().toLocaleDateString('es-ES', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
              </div>
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                  Confirmado
                </div>
              </div>
            </div>
          </div>

          {/* Contenido de la tarjeta */}
          <div className="p-8 relative">
            {/* Estado del pedido - diseño mejorado */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="group text-center p-6 border border-gray-100 rounded-xl hover:border-emerald-200 transition-all duration-500 hover:shadow-lg hover:-translate-y-1 bg-gradient-to-b from-white to-gray-50/50">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Package size={22} className="text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2 text-lg">Estado</h3>
                <p className="text-blue-600 text-sm font-medium">En Preparación</p>
                <div className="mt-2 w-6 h-0.5 bg-blue-200 rounded-full mx-auto"></div>
              </div>

              <div className="group text-center p-6 border border-gray-100 rounded-xl hover:border-emerald-200 transition-all duration-500 hover:shadow-lg hover:-translate-y-1 bg-gradient-to-b from-white to-gray-50/50">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Truck size={22} className="text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2 text-lg">Envío</h3>
                <p className="text-emerald-600 text-sm font-medium">2-3 días hábiles</p>
                <div className="mt-2 w-6 h-0.5 bg-emerald-200 rounded-full mx-auto"></div>
              </div>

              <div className="group text-center p-6 border border-gray-100 rounded-xl hover:border-emerald-200 transition-all duration-500 hover:shadow-lg hover:-translate-y-1 bg-gradient-to-b from-white to-gray-50/50">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Shield size={22} className="text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2 text-lg">Garantía</h3>
                <p className="text-purple-600 text-sm font-medium">100% Seguro</p>
                <div className="mt-2 w-6 h-0.5 bg-purple-200 rounded-full mx-auto"></div>
              </div>
            </div>

            {/* Próximos pasos - diseño mejorado */}
            <div className="bg-gradient-to-r from-gray-50 to-emerald-50/30 rounded-xl p-8 mb-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Clock size={20} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Próximos Pasos</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-4 group">
                  {/* <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white text-xs font-bold">1</span>
                  </div> */}
                  <p className="text-gray-700 text-sm leading-relaxed pt-1">Tu pedido será preparado y empaquetado en las próximas 24-48 horas</p>
                </div>
                
                <div className="flex items-start gap-4 group">
                  {/* <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white text-xs font-bold">3</span>
                  </div> */}
                  <p className="text-gray-700 text-sm leading-relaxed pt-1">Tu pedido llegará en 2-3 días hábiles</p>
                </div>
              </div>
            </div>

            {/* Botones de acción mejorados */}
            <div className="space-y-4">
              <Link href="/farmacia">
                <button className="w-full mb-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 text-base shadow-md hover:shadow-lg hover:scale-[1.01] transform">
                  <Home size={18} />
                  Continuar Comprando
                </button>
              </Link>
              
              <button 
                onClick={() => router.push('/farmacia/mis-compras')}
                className="w-full bg-white border-2 border-emerald-600 hover:bg-emerald-50 text-emerald-600 font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 text-base hover:border-emerald-700 hover:scale-[1.01] transform shadow-sm hover:shadow-md"
              >
                Ver Mis Compras
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Información de contacto mejorada */}
        <div className="mt-10 text-center">
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-full -mr-8 -mt-8 opacity-60"></div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">¿Necesitas ayuda?</h3>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors cursor-pointer group">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                  <Phone size={16} className="text-gray-500 group-hover:text-emerald-600" />
                </div>
                <span className="font-medium">771 712 9797</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors cursor-pointer group">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                  <Mail size={16} className="text-gray-500 group-hover:text-emerald-600" />
                </div>
                <span className="font-medium">centrohomeopatico@yahoo.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mensaje de agradecimiento mejorado */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-gray-500 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200">
            <Star size={14} className="text-emerald-400 fill-current" />
            <p className="text-xs font-medium">
              Gracias por elegir nuestra clínica homeopática
            </p>
            <Star size={14} className="text-emerald-400 fill-current" />
          </div>
        </div>
      </div>
    </div>
  );
} 