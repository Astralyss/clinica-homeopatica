import { Heart, Leaf, Sun, Shield, Sparkles, ArrowRight,Brain } from "lucide-react";
import Link from 'next/link';


export default function BienestarGeneral() {
  const padecimientos = [
    {
      icon: <Brain  className="w-8 h-8 text-emerald-600" />,
      titulo: "Cuidado de la mente",
      descripcion: "Tratamiento para ansiedad, estrés, depresión y equilibrio emocional"
    },
    {
      icon: <Sun className="w-8 h-8 text-teal-600" />,
      titulo: "Debilidad general",
      descripcion: "Recupera tu energía y vitalidad con tratamientos naturales"
    },
    {
      icon: <Heart className="w-8 h-8 text-teal-600" />,
      titulo: "Bienestar sexual",
      descripcion: "Mejora tu salud íntima y bienestar sexual de forma natural"
    },
    {
      icon: <Shield className="w-8 h-8 text-teal-700" />,
      titulo: "Cuidado respiratorio",
      descripcion: "Fortalece tu sistema respiratorio y mejora tu capacidad pulmonar"
    }
  ];

  const servicios = [
    "Evaluación del estado mental y emocional",
    "Tratamiento para debilidad y fatiga crónica",
    "Terapias para mejorar la función sexual",
    "Tratamiento para el asma y alergias respiratorias",
    "Consultas personalizadas por especialistas",
    "Seguimiento continuo del progreso"
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-teal-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 text-teal-600 mr-2" />
            <span className="text-teal-600 font-semibold text-sm uppercase tracking-wide">
              Tu Salud Natural
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Bienestar General
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Tratamientos homeopáticos especializados para el cuidado integral de tu salud.
            Abordamos desde el bienestar mental hasta el cuidado respiratorio con medicina natural.
          </p>
        </div>

        {/* Padecimientos Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {padecimientos.map((padecimiento, index) => (
            <div
              key={index}
              className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-white/50"
            >
              <div className="mb-6 p-3 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-xl w-fit">
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
              Especialistas en Bienestar Integral
            </h3>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Nuestros tratamientos homeopáticos abordan de manera integral el cuidado de la mente,
              la recuperación de energía vital, el bienestar sexual y la salud respiratoria.
              Cada consulta es personalizada según tus necesidades específicas.
            </p>

            <div className="space-y-4 mb-8">
              {servicios.map((servicio, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mr-4"></div>
                  <span className="text-gray-700 font-medium">{servicio}</span>
                </div>
              ))}
            </div>

            {/* <button className="group bg-gradient-to-r from-teal-600 to-emerald-800 text-white px-8 py-4 rounded-full font-semibold hover:from-teal-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center">
              Comienza tu tratamiento
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button> */}
          </div>

          {/* Right Content - Visual */}
          <div className="relative">
            <div className="bg-gradient-to-br from-teal-100 via-emerald-50 to-teal-100 rounded-3xl p-8 shadow-2xl">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/80 p-6 rounded-2xl shadow-lg">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                    <Brain className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h4 className="font-bold text-gray-800 mb-2">Cuidado Mental</h4>
                  <p className="text-sm text-gray-600">Equilibrio emocional natural</p>
                </div>

                <div className="bg-white/80 p-6 rounded-2xl shadow-lg">
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                    <Sun className="w-6 h-6 text-teal-600" />
                  </div>
                  <h4 className="font-bold text-gray-800 mb-2">Energía Vital</h4>
                  <p className="text-sm text-gray-600">Contra la debilidad general</p>
                </div>

                <div className="bg-white/80 p-6 rounded-2xl shadow-lg">
                  <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mb-4">
                    <Heart className="w-6 h-6 text-cyan-600" />
                    
                  </div>
                  <h4 className="font-bold text-gray-800 mb-2">Bienestar Sexual</h4>
                  <p className="text-sm text-gray-600">Salud íntima natural</p>
                </div>

                <div className="bg-white/80 p-6 rounded-2xl shadow-lg">
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-teal-700" />
                  </div>
                  <h4 className="font-bold text-gray-800 mb-2">Infecciones Respiratorias</h4>
                  <p className="text-sm text-gray-600">Infecciones de las vías respiratorias</p>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-teal-200 rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-emerald-100 rounded-full opacity-40"></div>
          </div>
        </div>

        {/* Call to Action Final - Más profesional y limpio */}
        <div className="mt-20 text-center bg-teal-800 rounded-3xl p-12 text-white relative overflow-hidden">
          {/* Sutil efecto de fondo */}
          <div className="absolute inset-0 bg-gradient-to-r from-teal-700  to-emerald-800 opacity-50 rounded-3xl"></div>

          <div className="relative z-10">
            <h3 className="text-3xl font-bold mb-4">
              ¿Listo para transformar tu salud?
            </h3>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Agenda tu consulta personalizada y descubre cómo la homeopatía puede mejorar tu calidad de vida
            </p>

            <Link href="/agendarConsulta">
              <button className="bg-white text-teal-900 px-8 py-4 rounded-full font-bold hover:bg-gray-50 transition-colors duration-300 shadow-lg hover:shadow-xl">
                Agendar Consulta Gratuita
              </button>
            </Link>

          </div>
        </div>

      </div>
    </section>
  );
}