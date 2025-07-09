// // components/TarjetaProducto.jsx
// 'use client';
// import { ShoppingCart, Plus, Minus, Shield } from 'lucide-react';

// const TarjetaProducto = ({ producto, cantidad, actualizarCantidad, agregarAlCarrito }) => {
//   return (
//     <div className="group bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-emerald-200 transition-all duration-300">
//       <div className="relative overflow-hidden bg-gray-50">
//         <img
//           src={producto.imagen}
//           alt={producto.nombre}
//           className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
//         />
//         <div className="absolute top-4 left-4">
//           <span className="bg-emerald-100 text-emerald-700 text-xs font-medium px-3 py-1 rounded-full">
//             {producto.categoria}
//           </span>
//         </div>
//         <div className="absolute top-4 right-4">
//           <div className="bg-white/90 backdrop-blur-sm text-emerald-700 text-xs font-medium px-2 py-1 rounded-full border border-emerald-200">
//             <Shield size={12} className="inline mr-1" />
//             Reg. Sanitario
//           </div>
//         </div>
//       </div>

//       <div className="p-6">
//         <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
//           {producto.nombre}
//         </h3>
//         <p className="text-gray-600 text-sm mb-4 leading-relaxed">{producto.descripcion}</p>

//         <div className="text-sm text-gray-500 mb-4 bg-gray-50 p-3 rounded-xl">
//           <strong>Presentación:</strong> {producto.presentacion}
//         </div>

//         <div className="flex flex-wrap gap-1 mb-6">
//           {producto.beneficios.map((beneficio, index) => (
//             <span key={index} className="bg-teal-50 text-teal-700 text-xs px-2 py-1 rounded-md">
//               {beneficio}
//             </span>
//           ))}
//         </div>

//         <div className="flex items-center justify-between mb-4">
//           <div className="text-2xl font-bold text-emerald-600">${producto.precio}</div>
//           <div className="text-sm text-gray-500">MXN</div>
//         </div>

//         <div className="flex items-center gap-3 mb-4">
//           <button
//             onClick={() => actualizarCantidad(producto.id, (cantidad || 1) - 1)}
//             className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
//           >
//             <Minus size={14} className="text-gray-600" />
//           </button>

//           <span className="w-8 text-center font-medium text-gray-900">
//             {cantidad || 1}
//           </span>

//           <button
//             onClick={() => actualizarCantidad(producto.id, (cantidad || 1) + 1)}
//             className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
//           >
//             <Plus size={14} className="text-gray-600" />
//           </button>
//         </div>

//         <button
//           onClick={() => agregarAlCarrito(producto)}
//           className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-colors duration-200 shadow-sm hover:shadow-md"
//         >
//           <ShoppingCart size={18} />
//           Agregar al carrito
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TarjetaProducto;
