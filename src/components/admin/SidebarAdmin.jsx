"use client";

import React from 'react';
import Link from 'next/link';
import { Home, ShoppingBag, Package, Users, BarChart2, Settings, User, CalendarClock } from 'lucide-react';

const menu = [
  { icon: <Home size={22} />, label: 'Dashboard', href: '/admin' },
  { icon: <ShoppingBag size={22} />, label: 'Pedidos', href: '/admin/pedidos' },
  { icon: <Package size={22} />, label: 'Productos', href: '/admin/productos' },
  { icon: <CalendarClock size={22} />, label: 'Consultas', href: '/admin/consultas' },
  { icon: <Users size={22} />, label: 'Clientes', href: '/admin/clientes' },
  { icon: <BarChart2 size={22} />, label: 'Reportes', href: '/admin/reportes' },
  { icon: <Settings size={22} />, label: 'Configuración', href: '/admin/configuracion' },
];

const SidebarAdmin = ({ onMenuClick, activeIndex, onUserMenu }) => (
  <aside className="fixed top-0 left-0 z-30 h-screen w-16 md:w-20 bg-white border-r border-gray-200 shadow-lg flex flex-col justify-between transition-all duration-300">
    {/* Logo */}
    <div className="flex flex-col items-center py-4">
      <span className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-xl shadow-sm select-none">EC</span>
    </div>
    {/* Menú navegación */}
    <nav className="flex-1 flex flex-col items-center gap-2">
      {menu.map((item, idx) => (
        <Link 
          href={item.href} 
          key={item.label}
          className={`group flex items-center justify-center w-12 h-12 rounded-lg mb-1 transition-all relative ${activeIndex === idx ? 'bg-gray-100 shadow text-gray-900' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-700'}`}
          title={item.label}
          onClick={() => onMenuClick && onMenuClick(idx)}
        >
          {item.icon}
          <span className="absolute left-16 opacity-0 group-hover:opacity-100 bg-gray-900 text-white text-xs rounded px-2 py-1 ml-2 pointer-events-none transition-opacity duration-200 whitespace-nowrap shadow-lg z-50">{item.label}</span>
        </Link>
      ))}
    </nav>
    {/* Usuario */}
    <div className="flex flex-col items-center py-4">
      <button
        className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-lg font-bold shadow hover:bg-gray-300 transition-colors"
        onClick={onUserMenu}
        title="Menú de usuario"
      >
        <User size={22} />
      </button>
    </div>
  </aside>
);

export default SidebarAdmin; 