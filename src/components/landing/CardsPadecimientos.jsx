// "use client";

// import { useRef, useEffect, useState } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// const padecimientos = [
//   { titulo: "Cuidado de la piel", imagen: "/images/piel.jpg" },
//   { titulo: "Cuidado de la mente", imagen: "/images/mente.jpg" },
//   { titulo: "Cuidado del estómago", imagen: "/images/estomago.jpg" },
//   { titulo: "Cuidado de la mujer", imagen: "/images/mujer.jpg" },
//   { titulo: "Sistema respiratorio", imagen: "/images/respiratorio.jpg" },
//   { titulo: "Diabetes", imagen: "/images/diabetes.jpg" },
//   { titulo: "Kidney y liver care", imagen: "/images/riñon-higado.jpg" },
//   { titulo: "Tos y resfriado", imagen: "/images/tos.jpg" },
//   { titulo: "Infecciones virales", imagen: "/images/virales.jpg" },
//   { titulo: "Cuidado de ojos y oídos", imagen: "/images/ojos.jpg" },
//   { titulo: "Malestares generales", imagen: "/images/malestares.jpg" },
//   { titulo: "Sexual wellness", imagen: "/images/sexual.jpg" },
//   { titulo: "Cuidado cardíaco", imagen: "/images/cardiaco.jpg" },
//   { titulo: "Peso", imagen: "/images/peso.jpg" },
// ];

// export default function PadecimientosCarousel() {
//   const scrollRef = useRef(null);
//   const [isHovered, setIsHovered] = useState(false);

//   // Scroll automático si no está pausado por hover
//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (!isHovered && scrollRef.current) {
//         scrollRef.current.scrollLeft += 1;
//       }
//     }, 20);
//     return () => clearInterval(interval);
//   }, [isHovered]);

//   // Flechas
//   const scroll = (direction) => {
//     const container = scrollRef.current;
//     if (!container) return;
//     const scrollAmount = direction === "left" ? -300 : 300;
//     container.scrollBy({
//       left: scrollAmount,
//       behavior: "smooth",
//     });
//   };

//   return (
//     <div className="relative my-10">
//       {/* Botón izquierdo */}
//       <button
//         onClick={() => scroll("left")}
//         className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
//       >
//         <ChevronLeft />
//       </button>

//       {/* Carrusel */}
//       <div
//         ref={scrollRef}
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//         className="flex overflow-x-auto space-x-4 px-8 py-4 scroll-smooth no-scrollbar"
//         style={{
//           scrollBehavior: "smooth",
//           scrollbarWidth: "none",
//         }}
//       >
//         {padecimientos.map((item, index) => (
//           <div
//             key={index}
//             className="min-w-[220px] flex-shrink-0 bg-white rounded-xl shadow-md hover:shadow-xl transition"
//           >
//             <img
//               src={item.imagen}
//               alt={item.titulo}
//               className="w-full h-40 object-cover rounded-t-xl"
//             />
//             <div className="p-3 text-center font-medium text-green-700">
//               {item.titulo}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Botón derecho */}
//       <button
//         onClick={() => scroll("right")}
//         className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
//       >
//         <ChevronRight />
//       </button>

//       {/* Ocultar scrollbar para navegadores WebKit */}
//       <style jsx>{`
//         .no-scrollbar::-webkit-scrollbar {
//           display: none;
//         }
//       `}</style>
//     </div>
//   );
// }


//  Bienestar Integral y Preventivo
// - Cuidado de la mente
// - Debilidad general
// - Bienestar sexual
// 🏵 Cuidado Personal y Equilibrio Corporal
//  Cuidado de la piel
//  Cuidado del cabello
// Higiene
//  Cuidado de ojos y oídos
// 🍃 Salud Digestiva y Nutrición
// - Cuidado del estómago
// - Control de peso
// 🩺 Cuidado Terapéutico y Especializado
// - Cuidado de la mujer
// - 
// - Salud metabólica (antes "Diabetes")
// - Salud circulatoria (antes "Cuidado cardiaco")
// - Salud inmunológica (antes "Infecciones virales")
// - Salud respiratoria (antes "Tos y resfriado")
// - Cuidado de huesos, articulaciones y músculos

import Link from "next/link";
import Image from "next/image";

const categorias = [
  {
    titulo: "Bienestar General",
    descripcion: "Cuidado de la mente, Debilidad general, Bienestar sexual, Cuidado respiratorio",
    imagen: "/images/salud.jpg", 
    ruta: "/padecimientos/bienestarGeneral",
  },
  {
    titulo: "Salud Digestiva y Nutrición",
    descripcion: "Cuidado del estómago, Control de peso, Diabetes, Cuidado cardiaco, Estreñimiento y hemorroides ",
    imagen: "/images/digestiva.jpg",
    ruta: "/padecimientos/saludDigestiva",
  },
  {
    titulo: "Cuidado Personal y Equilibrio Corporal",
    descripcion: "Cuidado de la piel, Cuidado del cabello, Higiene, Cuidado de ojos y oídos",
    imagen: "/images/dos.jpg",
    ruta: "/padecimientos/cuidadoPersonal",
  },
  {
    titulo: "Cuidado Terapéutico y Especializado",
    descripcion: "Infecciones virales Tos y resfriado, Cuidado de huesos, articulaciones y músculos",
    imagen: "/images/terapeutico.jpg",
    ruta: "/padecimientos/cuidadoTerapeutico",
  },
];

export default function CardsPadecimientos() {
  return (
    // <div className="py-12 px-4 mt-16 max-w-7xl mx-auto ">
    <div className=" px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* <h2 className="text-3xl font-bold text-blue-800 mb-10 text-center">
        Categorías de Padecimientos
      </h2> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {categorias.map((cat) => (
          <Link
            key={cat.titulo}
            href={cat.ruta}
            className="block bg-white shadow-md hover:shadow-lg rounded-2xl overflow-hidden transition-shadow duration-300"
          >
            <Image
              src={cat.imagen}
              alt={cat.titulo}
              width={400}
              height={250}
              className="w-full h-48 object-cover"
            />
            <div className="p-5">
              <h3 className="text-xl font-semibold text-green-900 mb-2">
                {cat.titulo}
              </h3>
              <p className="text-gray-600 text-sm">{cat.descripcion}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

