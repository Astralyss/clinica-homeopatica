"use client";
import { CheckCircle, ShoppingBag, CalendarClock } from "lucide-react";
import CardsPadecimientos from "@/components/landing/CardsPadecimientos";
import PharmaSecction from "@/components/landing/PharmaSecction";
import History from "@/components/landing/History";
import AboutUs from "@/components/landing/AboutUs";
import HeroSection from "@/components/landing/HeroSection";
import WhatsContact from "@/components/landing/WhatsContact";
import RegistroForm from '../components/auth/RegistroForm';
// import ConsultForm from "@/components/forms/ConsultForm";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] mt-1">

      {/* <section className="py-24">
        <div className="max-w-2xl mx-auto text-center px-4">


          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            Bienestar físico y emocional en armonía
          </h1>


          <p className="text-gray-600 text-lg mb-10">
            Acompañamos cada paso con ética, empatía y un enfoque natural e integral.
          </p>


          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="#"
              className="inline-flex items-center justify-center px-6 py-3 text-white bg-green-800 hover:bg-green-700 rounded-full shadow-md transition"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Ir a la farmacia
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center px-6 py-3 border border-green-800 text-green-700 hover:bg-green-50 rounded-full shadow-sm transition"
            >
              <CalendarClock className="w-4 h-4 mr-2" />

              Reservar consulta
            </a>
          </div>

        </div>
      </section> */}

      


      <HeroSection />




      <CardsPadecimientos />

      {/* <div className="w-full max-w-5xl bg-green-50 rounded-3xl px-8 py-12 sm:px-16 text-center shadow-lg space-y-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Agenda una consulta gratuita
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Agenda tu consulta sin compromiso y recibe orientación profesional en pocos pasos. ¡Es rápido, gratuito y sin tarjetas!
        </p>

        <form className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
          <input
            type="email"
            placeholder="Ingresa tu correo electrónico"
            className="w-full sm:w-96 px-6 py-3 rounded-full bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="px-8 py-3 bg-green-800 text-white font-semibold rounded-full hover:bg-green-800 transition text-sm shadow-md"
          >
            Agendar Gratis
          </button>
        </form>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-700 mt-4">
          <div className="flex items-center gap-1">
            <CheckCircle className="text-green-500 w-4 h-4" />
            Sin tarjeta requerida
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="text-green-500 w-4 h-4" />
            Cancela en cualquier momento
          </div>
        </div>
      </div> */}


      <PharmaSecction />
      <WhatsContact />
      <History />
      <AboutUs />
      {/* Eliminar <RegistroForm /> de la página principal */}




    </div>
  );
}
