import { Heart, Scale, Droplets, Activity, Leaf, ArrowRight,Bubbles  } from "lucide-react";
import Link from 'next/link';

export default function SaludDigestiva() {
  const padecimientos = [
    {
      icon: <Leaf className="w-8 h-8 text-emerald-600" />,
      titulo: "Cuidado del estómago",
      descripcion: "Tratamiento para gastritis, acidez, úlceras y problemas digestivos"
    },
    {
      icon: <Scale className="w-8 h-8 text-teal-600" />,
      titulo: "Control de peso",
      descripcion: "Equilibra tu metabolismo de forma natural y saludable"
    },
    {
      icon: <Droplets className="w-8 h-8 text-teal-600" />,
      titulo: "Diabetes",
      descripcion: "Apoyo natural para el control de glucosa y metabolismo"
    },
    {
      icon: <Activity  className="w-8 h-8 text-teal-700" />,
      titulo: "Cuidado cardiaco",
      descripcion: "Fortalece tu corazón y mejora la circulación sanguínea"
    },
    {
      icon: <Bubbles className="w-8 h-8 text-emerald-700" />,
      titulo: "Estreñimiento y hemorroides",
      descripcion: "Mejora el tránsito intestinal y alivia las molestias"
    }
  ];

  const servicios = [
    "Evaluación completa del sistema digestivo",
    "Planes personalizados para control de peso",
    "Apoyo natural en el manejo de diabetes",
    "Fortalecimiento del sistema cardiovascular",
    "Tratamiento para problemas intestinales",
    "Orientación nutricional especializada"
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-teal-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <Leaf className="w-6 h-6 text-emerald-600 mr-2" />
            <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wide">
              Tu Sistema Digestivo
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Salud Digestiva y Nutrición
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Tratamientos homeopáticos especializados para el cuidado integral de tu sistema digestivo. 
            Desde problemas estomacales hasta el manejo de diabetes y control de peso.
          </p>
        </div>

        {/* Padecimientos Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
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
              Especialistas en Salud Digestiva
            </h3>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Nuestros tratamientos homeopáticos abordan de manera integral los problemas digestivos, 
              metabólicos y cardiovasculares. Cada consulta incluye evaluación nutricional y 
              plan personalizado según tus necesidades específicas.
            </p>
            
            <div className="space-y-4 mb-8">
              {servicios.map((servicio, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mr-4"></div>
                  <span className="text-gray-700 font-medium">{servicio}</span>
                </div>
              ))}
            </div>

            {/* <button className="group bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-8 py-4 rounded-full font-semibold hover:from-teal-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center">
              Inicia tu tratamiento digestivo
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button> */}
          </div>

          {/* Right Content - Visual */}
          <div className="relative">
            <div className="bg-gradient-to-br from-teal-100 via-emerald-50 to-teal-100 rounded-3xl p-8 shadow-2xl">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/80 p-6 rounded-2xl shadow-lg">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                    <Leaf className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h4 className="font-bold text-gray-800 mb-2">Salud Gástrica</h4>
                  <p className="text-sm text-gray-600">Cuidado integral del estómago</p>
                </div>
                
                <div className="bg-white/80 p-6 rounded-2xl shadow-lg">
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                    <Scale className="w-6 h-6 text-teal-600" />
                  </div>
                  <h4 className="font-bold text-gray-800 mb-2">Peso Ideal</h4>
                  <p className="text-sm text-gray-600">Control natural del peso</p>
                </div>
                
                <div className="bg-white/80 p-6 rounded-2xl shadow-lg">
                  <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mb-4">
                    <Droplets className="w-6 h-6 text-cyan-600" />
                  </div>
                  <h4 className="font-bold text-gray-800 mb-2">Control Glucosa</h4>
                  <p className="text-sm text-gray-600">Apoyo en diabetes</p>
                </div>
                
                <div className="bg-white/80 p-6 rounded-2xl shadow-lg">
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                    <Heart className="w-6 h-6 text-teal-700" />
                  </div>
                  <h4 className="font-bold text-gray-800 mb-2">Corazón Sano</h4>
                  <p className="text-sm text-gray-600">Fortalece tu sistema cardíaco</p>
                </div>
              </div>
              
              {/* Quinta tarjeta centrada */}
              {/* <div className="mt-6 flex justify-center">
                <div className="bg-white/80 p-6 rounded-2xl shadow-lg w-64">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <Activity className="w-6 h-6 text-emerald-700" />
                  </div>
                  <h4 className="font-bold text-gray-800 mb-2 text-center">Salud Intestinal</h4>
                  <p className="text-sm text-gray-600 text-center">Mejora el tránsito intestinal</p>
                </div>
              </div> */}
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-teal-200 rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-emerald-100 rounded-full opacity-40"></div>
          </div>
        </div>

        {/* Call to Action Final - Más profesional y limpio */}
        <div className="mt-20 text-center bg-teal-800 rounded-3xl p-12 text-white relative overflow-hidden">
          {/* Sutil efecto de fondo */}
          <div className="absolute inset-0  opacity-50 rounded-3xl"></div>
          
          <div className="relative z-10">
            <h3 className="text-3xl font-bold mb-4">
              ¿Problemas digestivos o metabólicos?
            </h3>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Agenda tu consulta especializada y descubre cómo mejorar tu salud digestiva y nutricional de forma natural
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