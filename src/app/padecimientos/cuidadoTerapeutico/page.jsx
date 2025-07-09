import { Leaf, Shield, Bone, Heart, Stethoscope, ArrowRight,BicepsFlexed,Bike  } from "lucide-react";
import Link from 'next/link';

export default function CuidadoTerapeutico() {
  const padecimientos = [
    {
      icon: <Shield className="w-8 h-8 text-teal-600" />,
      titulo: "Infecciones virales",
      descripcion: "Tratamiento natural para fortalecer el sistema inmunológico y combatir virus"
    },
    {
      icon: <Stethoscope className="w-8 h-8 text-teal-600" />,
      titulo: "Tos y resfriado",
      descripcion: "Alivio efectivo de síntomas respiratorios con medicina homeopática"
    },
    {
      icon: <Bike className="w-8 h-8 text-teal-600" />,
      titulo: "Huesos y articulaciones",
      descripcion: "Fortalecimiento y cuidado integral del sistema músculo-esquelético"
    },
    {
      icon: <BicepsFlexed  className="w-8 h-8 text-teal-600" />,
      titulo: "Cuidado muscular",
      descripcion: "Recuperación y mantenimiento de la salud muscular y articular"
    }
  ];

  const servicios = [
    "Evaluación integral del sistema inmunológico",
    "Tratamientos para infecciones respiratorias",
    "Terapia homeopática para artritis y dolores articulares",
    "Fortalecimiento de huesos y músculos",
    "Consultas especializadas en medicina natural",
    "Seguimiento personalizado de tratamientos"
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <Leaf className="w-6 h-6 text-emerald-600 mr-2" />
            <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wide">
              Medicina Natural Especializada
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Cuidado Terapéutico y Especializado
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Tratamientos homeopáticos especializados para infecciones virales, problemas respiratorios 
            y el cuidado integral de huesos, articulaciones y músculos con medicina natural.
          </p>
        </div>

        {/* Padecimientos Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {padecimientos.map((padecimiento, index) => (
            <div 
              key={index} 
              className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-white/50"
            >
              <div className="mb-6 p-3 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl w-fit">
                {padecimiento.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {padecimiento.titulo}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {padecimiento.descripcion}
              </p>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              Especialistas en Medicina Natural
            </h3>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Nuestros tratamientos homeopáticos abordan de manera integral el cuidado terapéutico 
              especializado. Cada consulta incluye evaluación personalizada para fortalecer tu 
              sistema inmunológico y mejorar tu salud general de forma natural.
            </p>
            
            <div className="space-y-4 mb-8">
              {servicios.map((servicio, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-4"></div>
                  <span className="text-gray-700 font-medium">{servicio}</span>
                </div>
              ))}
            </div>

            {/* <button className="group bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-full font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center">
              Inicia tu tratamiento especializado
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button> */}
          </div>

          {/* Right Content - Visual */}
          <div className="relative">
            <div className="bg-gradient-to-br from-emerald-100 via-teal-50 to-emerald-100 rounded-3xl p-8 shadow-2xl">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/80 p-6 rounded-2xl shadow-lg">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h4 className="font-bold text-gray-800 mb-2">Inmunidad</h4>
                  <p className="text-sm text-gray-600">Fortalece defensas naturales</p>
                </div>
                
                <div className="bg-white/80 p-6 rounded-2xl shadow-lg">
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                    <Stethoscope className="w-6 h-6 text-teal-600" />
                  </div>
                  <h4 className="font-bold text-gray-800 mb-2">Respiratorio</h4>
                  <p className="text-sm text-gray-600">Alivio de tos y resfriados</p>
                </div>
                
                <div className="bg-white/80 p-6 rounded-2xl shadow-lg">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                    <Bike  className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-bold text-gray-800 mb-2">Articulaciones</h4>
                  <p className="text-sm text-gray-600">Cuidado músculo-esquelético</p>
                </div>
                
                <div className="bg-white/80 p-6 rounded-2xl shadow-lg">
                  <div className="w-12 h-12 bg-emerald-200 rounded-xl flex items-center justify-center mb-4">
                    <Heart className="w-6 h-6 text-emerald-700" />
                  </div>
                  <h4 className="font-bold text-gray-800 mb-2">Bienestar</h4>
                  <p className="text-sm text-gray-600">Salud integral natural</p>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-emerald-200 rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-teal-100 rounded-full opacity-40"></div>
          </div>
        </div>

        {/* Call to Action Final */}
        <div className="mt-20 text-center bg-teal-800 rounded-3xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-4">
            ¿Necesitas cuidado terapéutico especializado?
          </h3>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Agenda tu consulta especializada y descubre cómo mejorar tu salud con tratamientos homeopáticos naturales
          </p>
          <Link href="/agendarConsulta">
              <button className="bg-white text-teal-900 px-8 py-4 rounded-full font-bold hover:bg-gray-50 transition-colors duration-300 shadow-lg hover:shadow-xl">
                Agendar Consulta Gratuita
              </button>
            </Link>
        </div>

      </div>
    </section>
  );
}