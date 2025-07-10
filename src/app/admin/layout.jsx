"use client";

import React from 'react';
import SidebarAdmin from '@/components/admin/SidebarAdmin';

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarAdmin />
      
      {/* Contenido principal con margen izquierdo para el sidebar */}
      <div className="flex-1 ml-16 md:ml-20 transition-all duration-300">
        {children}
      </div>
    </div>
  );
} 