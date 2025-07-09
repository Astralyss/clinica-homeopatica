import { CheckCircle, Calendar, Clock, Star, ArrowRight, Shield, Users } from "lucide-react";
import { useState } from "react";

export default function ConsultForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    // Simular envío
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-5xl bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl px-8 py-16 sm:px-16 text-center shadow-xl border border-green-100">
        <div className="animate-bounce mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">¡Perfecto! Te contactaremos pronto</h2>
        <p className="text-gray-600 text-lg">Revisa tu correo en las próximas 24 horas para coordinar tu consulta gratuita.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl bg-gradient-to-br from-green-50 via-white to-emerald-50 rounded-3xl px-8 py-16 sm:px-16 text-center shadow-xl border border-green-100 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-green-200 rounded-full opacity-20 -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-200 rounded-full opacity-20 translate-y-12 -translate-x-12"></div>
      
      <div className="relative z-10 space-y-8">
        {/* Badge de urgencia */}
        {/* <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium border border-green-200">
          <Star className="w-4 h-4 fill-current" />
          Oferta limitada - Solo este mes
        </div> */}

        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
            Agenda tu consulta{" "}
            <span className="text-green-600 relative">
              gratuita
              <div className="absolute -bottom-1 left-0 right-0 h-3 bg-green-200 opacity-50 rounded"></div>
            </span>
          </h1>
          
          <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
            Obtén orientación profesional personalizada en solo 30 minutos. 
            <span className="font-semibold text-gray-800"> Sin compromiso, sin tarjetas</span>, solo resultados.
          </p>
        </div>

        {/* Estadísticas sociales */}
        {/* <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600 bg-white/50 rounded-2xl py-4 px-6 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-green-500" />
            <span><strong className="text-gray-800">+2,400</strong> consultas exitosas</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-green-500" />
            <span><strong className="text-gray-800">30 min</strong> promedio por sesión</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span><strong className="text-gray-800">4.9/5</strong> satisfacción</span>
          </div>
        </div> */}

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <div className="relative w-full sm:w-96">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo o WhatsApp"
                className="w-full px-6 py-4 rounded-2xl bg-white text-gray-900 placeholder-gray-500 shadow-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-lg"
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !email}
              className="group px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-2xl hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Calendar className="w-5 h-5" />
                  Agendar Ahora
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Garantías mejoradas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-700 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 bg-white/70 rounded-xl py-3 px-4 backdrop-blur-sm">
            <Shield className="text-green-500 w-5 h-5" />
            <span className="font-medium">100% Seguro</span>
          </div>
          <div className="flex items-center justify-center gap-2 bg-white/70 rounded-xl py-3 px-4 backdrop-blur-sm">
            <CheckCircle className="text-green-500 w-5 h-5" />
            <span className="font-medium">Sin tarjeta</span>
          </div>
          <div className="flex items-center justify-center gap-2 bg-white/70 rounded-xl py-3 px-4 backdrop-blur-sm">
            <Clock className="text-green-500 w-5 h-5" />
            <span className="font-medium">Respuesta en 24h</span>
          </div>
        </div>

        {/* Testimonial rápido */}
        {/* <div className="bg-white/80 rounded-2xl p-6 max-w-md mx-auto backdrop-blur-sm border border-gray-100">
          <div className="flex items-center gap-1 mb-2 justify-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
          </div>
          <p className="text-gray-700 text-sm italic mb-2">
            "La consulta me ayudó a tomar la mejor decisión. ¡Totalmente recomendado!"
          </p>
          <p className="text-gray-500 text-xs">- María González, Cliente</p>
        </div> */}
      </div>
    </div>
  );
}