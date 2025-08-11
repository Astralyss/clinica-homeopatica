"use client";
import { CheckCircle, MessageCircle, Phone } from "lucide-react";

export default function WhatsContact() {
  const handleWhatsAppContact = () => {
    const phoneNumber = "527717129797"; // Cambiar por el número real de WhatsApp
    const message = "Hola, me gustaría obtener más información sobre sus servicios de homeopatía.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handlePhoneCall = () => {
    const phoneNumber = "527717129797"; 
    window.open(`tel:${phoneNumber}`, '_self');
  };

  return (
    <div className="w-full max-w-5xl bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl px-8 py-12 sm:px-16 text-center shadow-xl space-y-8 border border-green-100">
      <div className="space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <MessageCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
          ¿Tienes dudas? ¡Contáctanos!
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Nuestro equipo de especialistas está listo para responder todas tus preguntas sobre homeopatía y bienestar integral.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
        <button
          onClick={handleWhatsAppContact}
          className="flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <MessageCircle className="w-5 h-5" />
          Contactar por WhatsApp
        </button>
        
        <button
          onClick={handlePhoneCall}
          className="flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 text-green-700 font-semibold rounded-full border-2 border-green-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Phone className="w-5 h-5" />
          Llamar ahora
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-700 mt-8 pt-6 border-t border-green-200">
        <div className="flex items-center gap-2">
          <CheckCircle className="text-green-500 w-5 h-5" />
          <span>Respuesta en minutos</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="text-green-500 w-5 h-5" />
          <span>Consulta gratuita</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="text-green-500 w-5 h-5" />
          <span>Sin compromiso</span>
        </div>
      </div>

      <div className="text-xs text-gray-500 mt-4">
        Horario de atención: Lunes a Viernes 11:00 AM - 7:00 PM
      </div>
    </div>
  );
}
