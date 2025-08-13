


// import React from "react";

// const infoSections = [
//   {
//     title: "¿Qué es la homeopatía?",
//     text: "La homeopatía es un sistema de medicina alternativa que se basa en la idea de tratar \"lo similar con lo similar\". Fue creada por el médico alemán Samuel Hahnemann a finales del siglo XVIII y principios del XIX. Ha tenido una presencia significativa en México desde 1850.",
//     image: "/img/que-es.jpg",
//   },
//   {
//     title: "Historia",
//     text: "Samuel Hahnemann (1755-1843), fundador de la homeopatía, descubrió que la quinina causaba síntomas similares a la malaria en personas sanas. A partir de esto desarrolló el principio de \"lo similar cura lo similar\". En 1855 se fundó la primera farmacia homeopática en México.",
//     image: "/img/historia.jpeg",
//   },
//   {
//     title: "¿Cómo funciona?",
//     text: "El principio fundamental es 'Similia similibus curentur'. Una sustancia que causa síntomas en una persona sana puede curar síntomas similares en una enferma. Este enfoque es usado tanto en humanos como en animales actualmente.",
//     image: "/img/funciona.webp",
//   },
//   {
//     title: "Generaciones de la homeopatía",
//     text: "Desde el siglo XIX, la homeopatía ha evolucionado en México y el mundo. Se han creado sociedades, publicaciones, y organizaciones que la han mantenido vigente hasta hoy.",
//     image: "/img/generaciones.jpg",
//   },
// ];

// const History = () => {
//   return (
//     <section className="max-w-6xl mx-auto px-4 py-12 space-y-16">
//       {infoSections.map((section, index) => (
//         <div
//           key={index}
//           className={`flex flex-col md:flex-row ${
//             index % 2 !== 0 ? "md:flex-row-reverse" : ""
//           } items-center gap-8`}
//         >
//           <div className="md:w-1/2">
//             <img
//               src={section.image}
//               alt={section.title}
//               className="rounded-xl shadow-md w-full object-cover"
//             />
//           </div>
//           <div className="md:w-1/2">
//             <h3 className="text-2xl font-bold text-green-700 mb-4">
//               {section.title}
//             </h3>
//             <p className="text-gray-700 text-lg">{section.text}</p>
//           </div>
//         </div>
//       ))}
//     </section>
//   );
// };

// export default History;



// import React from "react";

// const infoSections = [
//   {
//     title: "¿Qué es la homeopatía?",
//     text: "La homeopatía es un sistema de medicina alternativa que se basa en la idea de tratar \"lo similar con lo similar\". Fue creada por el médico alemán Samuel Hahnemann a finales del siglo XVIII y principios del XIX. Ha tenido una presencia significativa en México desde 1850.",
//     image: "/img/que-es.jpg",
//   },
//   {
//     title: "Historia",
//     text: "Samuel Hahnemann (1755-1843), fundador de la homeopatía, descubrió que la quinina causaba síntomas similares a la malaria en personas sanas. A partir de esto desarrolló el principio de \"lo similar cura lo similar\". En 1855 se fundó la primera farmacia homeopática en México.",
//     image: "/img/historia.jpeg",
//   },
//   {
//     title: "¿Cómo funciona?",
//     text: "El principio fundamental es 'Similia similibus curentur'. Una sustancia que causa síntomas en una persona sana puede curar síntomas similares en una enferma. Este enfoque es usado tanto en humanos como en animales actualmente.",
//     image: "/img/funciona.webp",
//   },
//   {
//     title: "Generaciones de la homeopatía",
//     text: "Desde el siglo XIX, la homeopatía ha evolucionado en México y el mundo. Se han creado sociedades, publicaciones, y organizaciones que la han mantenido vigente hasta hoy.",
//     image: "/img/generaciones.jpg",
//   },
// ];

// const History = () => {
//   return (
//     <section className="max-w-6xl mx-auto px-4 py-12 space-y-16">
//       {infoSections.map((section, index) =>
//         section.title === "Historia" ? (
//           // Hero-style solo para "Historia"
//           <div
//             key={index}
//             className="relative min-h-[70vh] bg-gray-900 text-white rounded-3xl overflow-hidden shadow-lg"
//           >
//             <img
//               src={section.image}
//               alt={section.title}
//               className="absolute inset-0 w-full h-full object-cover opacity-50"
//             />
//             <div className="relative z-10 flex flex-col justify-center h-full p-8 md:p-16">
//               <h3 className="text-4xl md:text-5xl font-bold text-green-300 mb-6">
//                 {section.title}
//               </h3>
//               <p className="text-lg md:text-xl text-white max-w-3xl">
//                 {section.text}
//               </p>
//             </div>
//           </div>
//         ) : (
//           // Secciones normales
//           <div
//             key={index}
//             className={`flex flex-col md:flex-row ${
//               index % 2 !== 0 ? "md:flex-row-reverse" : ""
//             } items-center gap-8`}
//           >
//             <div className="md:w-1/2">
//               <img
//                 src={section.image}
//                 alt={section.title}
//                 className="rounded-xl shadow-md w-full object-cover"
//               />
//             </div>
//             <div className="md:w-1/2">
//               <h3 className="text-2xl font-bold text-green-700 mb-4">
//                 {section.title}
//               </h3>
//               <p className="text-gray-700 text-lg">{section.text}</p>
//             </div>
//           </div>
//         )
//       )}
//     </section>
//   );
// };

// export default History;






// import React from "react";

// const infoSections = [
//   {
//     title: "¿Qué es la homeopatía?",
//     text: "La homeopatía es un sistema de medicina alternativa que se basa en la idea de tratar \"lo similar con lo similar\". Fue creada por el médico alemán Samuel Hahnemann a finales del siglo XVIII y principios del XIX. Ha tenido una presencia significativa en México desde 1850.",
//     image: "/img/que-es.jpg",
//   },
//   {
//     title: "Historia",
//     text: "Samuel Hahnemann (1755-1843), fundador de la homeopatía, descubrió que la quinina causaba síntomas similares a la malaria en personas sanas. A partir de esto desarrolló el principio de \"lo similar cura lo similar\". En 1855 se fundó la primera farmacia homeopática en México.",
//     image: "/img/historia.jpeg",
//   },
//   {
//     title: "¿Cómo funciona?",
//     text: "El principio fundamental es 'Similia similibus curentur'. Una sustancia que causa síntomas en una persona sana puede curar síntomas similares en una enferma. Este enfoque es usado tanto en humanos como en animales actualmente.",
//     image: "/img/funciona.webp",
//   },
//   {
//     title: "Generaciones de la homeopatía",
//     text: "Desde el siglo XIX, la homeopatía ha evolucionado en México y el mundo. Se han creado sociedades, publicaciones, y organizaciones que la han mantenido vigente hasta hoy.",
//     image: "/img/generaciones.jpg",
//   },
// ];

// const History = () => {
//   return (
//     <section className="max-w-6xl mx-auto px-4 py-12 space-y-16">
//       {infoSections.map((section, index) => {
//         if (section.title === "Historia") {
//           return (
//             <div
//               key={index}
//               className="relative min-h-[70vh] bg-gray-900 text-white rounded-3xl overflow-hidden shadow-lg"
//             >
//               <img
//                 src={section.image}
//                 alt={section.title}
//                 className="absolute inset-0 w-full h-full object-cover opacity-50"
//               />
//               <div className="relative z-10 flex flex-col justify-center h-full p-8 md:p-16">
//                 <h3 className="text-4xl md:text-5xl font-bold text-green-300 mb-6">
//                   {section.title}
//                 </h3>
//                 <p className="text-lg md:text-xl max-w-3xl">
//                   {section.text}
//                 </p>
//               </div>
//             </div>
//           );
//         }

//         if (section.title === "¿Qué es la homeopatía?") {
//           return (
//             <div
//               key={index}
//               className="flex flex-col md:flex-row items-center gap-8 bg-gray-100 p-6 rounded-2xl shadow-md"
//             >
//               <div className="md:w-1/2">
//                 <img
//                   src={section.image}
//                   alt={section.title}
//                   className="rounded-xl shadow-md w-full object-cover"
//                 />
//               </div>
//               <div className="md:w-1/2 bg-white/70 backdrop-blur-md p-6 rounded-xl">
//                 <h3 className="text-3xl font-bold text-green-700 mb-4">
//                   {section.title}
//                 </h3>
//                 <p className="text-gray-800 text-lg">{section.text}</p>
//               </div>
//             </div>
//           );
//         }

//         if (section.title === "¿Cómo funciona?") {
//           return (
//             <div
//               key={index}
//               className="relative min-h-[60vh] bg-blue-950 text-white rounded-3xl overflow-hidden shadow-lg"
//             >
//               <img
//                 src={section.image}
//                 alt={section.title}
//                 className="absolute inset-0 w-full h-full object-cover opacity-40"
//               />
//               <div className="relative z-10 flex flex-col justify-center h-full p-8 md:p-16">
//                 <h3 className="text-4xl md:text-5xl font-bold text-blue-200 mb-6">
//                   {section.title}
//                 </h3>
//                 <p className="text-lg md:text-xl max-w-3xl">
//                   {section.text}
//                 </p>
//               </div>
//             </div>
//           );
//         }

//         if (section.title === "Generaciones de la homeopatía") {
//           return (
//             <div
//               key={index}
//               className="flex flex-col md:flex-row-reverse items-center gap-8 bg-green-100 p-6 rounded-2xl shadow-md"
//             >
//               <div className="md:w-1/2">
//                 <img
//                   src={section.image}
//                   alt={section.title}
//                   className="rounded-xl shadow-md w-full object-cover"
//                 />
//               </div>
//               <div className="md:w-1/2 p-6 bg-white/80 backdrop-blur-sm rounded-xl">
//                 <h3 className="text-3xl font-bold text-green-800 mb-4">
//                   {section.title}
//                 </h3>
//                 <p className="text-gray-800 text-lg">{section.text}</p>
//               </div>
//             </div>
//           );
//         }

//         return null; // por si acaso
//       })}
//     </section>
//   );
// };

// export default History;




// import React, { useState } from "react";

// const infoSections = [
//   {
//     title: "¿Qué es la homeopatía?",
//     text: "La homeopatía es un sistema de medicina alternativa que se basa en la idea de tratar 'lo similar con lo similar'. Fue creada por el médico alemán Samuel Hahnemann a finales del siglo XVIII y principios del XIX. Ha tenido una presencia significativa en México desde 1850.",
//     image: "/img/que-es.jpg",
//     style: "bg-gray-100 text-gray-800",
//     textColor: "text-green-700",
//     overlay: "",
//   },
//   {
//     title: "Historia",
//     text: "Samuel Hahnemann (1755-1843), fundador de la homeopatía, descubrió que la quinina causaba síntomas similares a la malaria en personas sanas. A partir de esto desarrolló el principio de 'lo similar cura lo similar'. En 1855 se fundó la primera farmacia homeopática en México.",
//     image: "/img/historia.jpeg",
//     style: "bg-gray-900 text-white",
//     textColor: "text-green-300",
//     overlay: "bg-black/50",
//   },
//   {
//     title: "¿Cómo funciona?",
//     text: "El principio fundamental es 'Similia similibus curentur'. Una sustancia que causa síntomas en una persona sana puede curar síntomas similares en una enferma. Este enfoque es usado tanto en humanos como en animales actualmente.",
//     image: "/img/funciona.webp",
//     style: "bg-blue-950 text-white",
//     textColor: "text-blue-200",
//     overlay: "bg-blue-900/40",
//   },
//   {
//     title: "Generaciones de la homeopatía",
//     text: "Desde el siglo XIX, la homeopatía ha evolucionado en México y el mundo. Se han creado sociedades, publicaciones, y organizaciones que la han mantenido vigente hasta hoy.",
//     image: "/img/generaciones.jpg",
//     style: "bg-green-100 text-gray-800",
//     textColor: "text-green-800",
//     overlay: "",
//   },
// ];

// const History = () => {
//   const [selected, setSelected] = useState(0);
//   const section = infoSections[selected];

//   return (
//     <section className="max-w-6xl mx-auto px-4 py-12">
//       {/* Navegación de títulos */}
//       <div className="flex flex-wrap gap-4 justify-center mb-10">
//         {infoSections.map((item, index) => (
//           <button
//             key={index}
//             onClick={() => setSelected(index)}
//             className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
//               selected === index
//                 ? "bg-green-700 text-white shadow-md"
//                 : "bg-gray-200 text-gray-800 hover:bg-green-100"
//             }`}
//           >
//             {item.title}
//           </button>
//         ))}
//       </div>

//       {/* Contenido dinámico */}
//       <div
//         className={`relative min-h-[65vh] rounded-3xl overflow-hidden shadow-xl transition-all duration-700 ${section.style}`}
//       >
//         {section.image && (
//           <>
//             <img
//               src={section.image}
//               alt={section.title}
//               className="absolute inset-0 w-full h-full object-cover opacity-40"
//             />
//             {section.overlay && (
//               <div className={`absolute inset-0 ${section.overlay}`} />
//             )}
//           </>
//         )}
//         <div className="relative z-10 flex flex-col justify-center h-full p-8 md:p-16">
//           <h3
//             className={`text-4xl md:text-5xl font-bold mb-6 ${section.textColor}`}
//           >
//             {section.title}
//           </h3>
//           <p className="text-lg md:text-xl max-w-3xl">{section.text}</p>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default History;





// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// const infoSections = [
//   {
//     title: "¿Qué es la homeopatía?",
//     text: "La homeopatía es un sistema de medicina alternativa que se basa en la idea de tratar 'lo similar con lo similar'. Fue creada por el médico alemán Samuel Hahnemann a finales del siglo XVIII y principios del XIX. Ha tenido una presencia significativa en México desde 1850.",
//     image: "/img/que-es.jpg",
//   },
//   {
//     title: "Historia",
//     text: "Samuel Hahnemann (1755-1843), fundador de la homeopatía, descubrió que la quinina causaba síntomas similares a la malaria en personas sanas. A partir de esto desarrolló el principio de 'lo similar cura lo similar'. En 1855 se fundó la primera farmacia homeopática en México.",
//     image: "/img/historia.png",
//   },
//   {
//     title: "¿Cómo funciona?",
//     text: "El principio fundamental es 'Similia similibus curentur'. Una sustancia que causa síntomas en una persona sana puede curar síntomas similares en una enferma. Este enfoque es usado tanto en humanos como en animales actualmente.",
//     image: "/img/funciona.jpg",
//   },
//   {
//     title: "Generaciones de la homeopatía",
//     text: "Desde el siglo XIX, la homeopatía ha evolucionado en México y el mundo. Se han creado sociedades, publicaciones, y organizaciones que la han mantenido vigente hasta hoy.",
//     image: "/img/generaciones.jpg",
//   },
// ];

// export default function HistoryInteractive() {
//   const [selected, setSelected] = useState(0);

//   return (
//     <section className="bg-gradient-to-br from-gray-100 to-gray-200 py-20 px-4 md:px-8 lg:px-16">
//       <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
        
//         <div className="w-full">
//           <AnimatePresence mode="wait">
//             <motion.img
//               key={infoSections[selected].image}
//               src={infoSections[selected].image}
//               alt={infoSections[selected].title}
//               initial={{ opacity: 0, x: -30 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: -30 }}
//               transition={{ duration: 0.5 }}
//               className="w-full h-[400px] rounded-3xl shadow-2xl object-cover"
//             />
//           </AnimatePresence>
//         </div>

        
//         <div className="space-y-6">
//           <div className="mb-6">
//             <h2 className="text-4xl font-extrabold text-gray-900 mb-3">
//               {infoSections[selected].title}
//             </h2>
//             <p className="text-gray-700 text-lg leading-relaxed">
//               {infoSections[selected].text}
//             </p>
//           </div>

//           <div className="space-y-2">
//             {infoSections.map((sec, idx) => (
//               <button
//                 key={idx}
//                 onClick={() => setSelected(idx)}
//                 className={`w-full text-left py-3 px-5 rounded-lg transition duration-200 ease-in-out font-semibold text-base border shadow-sm hover:border-green-800 hover:bg-green-800/80 backdrop-blur-md ${
//                   idx === selected
//                     ? "bg-green-800 border-none text-white"
//                     : "bg-white border-none text-gray-900"
//                 }`}
//               >
//                 {sec.title}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }




import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const infoSections = [
  {
    title: "¿Qué es la homeopatía?",
    text: "La homeopatía es un sistema de medicina alternativa que se basa en la idea de tratar 'lo similar con lo similar'. Fue creada por el médico alemán Samuel Hahnemann a finales del siglo XVIII y principios del XIX. Nuestro consultorio homeopático utiliza estos principios para tratar diversos padecimientos de manera natural y efectiva.",
    subtitle: "Diseñado para optimizar el proceso de reclutamiento, esta solución ofrece funciones como seguimiento de candidatos, análisis de currículum y herramientas de evaluación de candidatos.",
    image: "/img/que-es.jpg",
  },
  {
    title: "Historia de la Homeopatía",
    text: "Samuel Hahnemann (1755-1843), fundador de la homeopatía, descubrió que la quinina causaba síntomas similares a la malaria en personas sanas. Este descubrimiento revolucionario sentó las bases de la medicina homeopática que practicamos en nuestra clínica homeopática.",
    subtitle: "Sistema integral para gestionar el cumplimiento normativo y evaluar riesgos organizacionales de manera proactiva.",
    image: "/img/historia.png",
  },
  {
    title: "¿Cómo funciona la homeopatía?",
    text: "El principio fundamental es 'Similia similibus curentur'. Una sustancia que causa síntomas en una persona sana puede curar síntomas similares en una enferma. En nuestro consultorio homeopático aplicamos este principio para crear tratamientos personalizados y efectivos.",
    subtitle: "Herramientas especializadas para mejorar la participación, satisfacción y retención de empleados en toda la organización.",
    image: "/img/funciona.jpg",
  },
  {
    title: "Generaciones de la homeopatía",
    text: "Desde el siglo XIX, la homeopatía ha evolucionado en México y el mundo. Se han creado sociedades, publicaciones, y organizaciones que han mantenido vigente esta medicina natural hasta hoy. Nuestra clínica homeopática continúa esta tradición de excelencia.",
    subtitle: "Plataforma avanzada para identificar, atraer y contratar el mejor talento de manera eficiente y estratégica.",
    image: "/img/generaciones.jpg",
  },
];

export default function HistoryInteractive() {
  const [selected, setSelected] = useState(0);

  return (
    <section className=" py-16 px-4 md:px-6 lg:px-12" aria-label="Información sobre homeopatía y medicina natural">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Imagen del lado izquierdo */}
          <div className="  w-full overflow-hidden">
            <div className="  p-4 md:p-8 shadow-lg">
              <AnimatePresence mode="wait">
                <motion.img
                  key={infoSections[selected].image}
                  src={infoSections[selected].image}
                  alt={`${infoSections[selected].title} - Clínica Homeopática`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-[250px] md:h-[350px] rounded-2xl shadow-xl object-cover object-center"
                />
              </AnimatePresence>
            </div>
          </div>

          {/* Contenido del lado derecho */}
          <div className="space-y-6 md:space-y-8">
            {/* Header */}
           

            {/* Lista de características */}
            <div className="space-y-6 md:space-y-8 pt-4 md:pt-6">
              {infoSections.map((section, idx) => (
                <motion.div
                  key={idx}
                  className="relative cursor-pointer transition-all duration-300"
                  onClick={() => setSelected(idx)}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start gap-4">
                   
                    
                    {/* Contenido */}
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-bold text-xl md:text-2xl mb-3 transition-colors duration-300 ${
                        idx === selected ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                        {section.title}
                      </h3>
                      
                      <AnimatePresence>
                        {idx === selected && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="text-gray-600 text-base md:text-lg leading-relaxed pr-4"
                          >
                            {section.text}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  
                  {/* Línea divisoria sutil */}
                  {idx < infoSections.length - 1 && (
                    <div className="mt-6 md:mt-8 ml-12 md:ml-16">
                      <div className="h-px bg-gray-200"></div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}




