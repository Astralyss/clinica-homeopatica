"use client"
import React from 'react';
import DashboardCard from './DashboardCard';
import DashboardChart from './DashboardChart';
import useDashboardStats from '../../utils/hooks/useDashboardStats';

// Iconos SVG para las tarjetas
const Icons = {
  pedidos: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  ),
  productos: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  ventas: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
    </svg>
  ),
  consultas: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  usuarios: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  ),
  financiero: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  stock: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
    </svg>
  )
};

const Dashboard = () => {
  const { stats, loading, error } = useDashboardStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-700">Error al cargar las estadísticas: {error}</p>
      </div>
    );
  }

  // Calcular tendencias
  const calcularTendencia = (actual, anterior) => {
    if (anterior === 0) return actual > 0 ? 100 : 0;
    return Math.round(((actual - anterior) / anterior) * 100);
  };

  const tendenciaVentas = calcularTendencia(stats.ventas.mesActual, stats.ventas.mesAnterior);
  const tendenciaIngresos = calcularTendencia(stats.financiero.ingresosMes, stats.financiero.ingresosMesAnterior);

  // Preparar datos para los gráficos
  const datosPedidos = {
    Pendientes: stats.pedidos.pendientes,
    Enviados: stats.pedidos.enviados,
    Entregados: stats.pedidos.entregados,
    Cancelados: stats.pedidos.cancelados
  };

  const datosProductos = {
    Activos: stats.productos.activos,
    'Stock Bajo': stats.productos.stockBajo,
    'Sin Stock': stats.productos.sinStock
  };

  const datosConsultas = {
    Pendientes: stats.consultas.pendientes,
    Confirmadas: stats.consultas.confirmadas,
    Completadas: stats.consultas.completadas
  };

  const datosVentas = {
    'Mes Actual': stats.ventas.mesActual,
    'Mes Anterior': stats.ventas.mesAnterior
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Administrativo</h1>
        <p className="text-gray-600 mt-2">Resumen general de la clínica homeopática</p>
      </div>

      {/* Primera fila - Tarjetas principales de información */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* PRIMERA TARJETA - INFORMACIÓN DE PEDIDOS */}
        <DashboardCard
          title="Estado de Pedidos"
          value={stats.pedidos.total}
          subtitle={`${stats.pedidos.pendientes} pendientes • ${stats.pedidos.enviados} enviados • ${stats.pedidos.entregados} entregados`}
          icon={Icons.pedidos}
          color="blue"
        />
        
        {/* SEGUNDA TARJETA - ESTADO DEL STOCK */}
        <DashboardCard
          title="Stock de Productos"
          value={stats.productos.activos}
          subtitle={`${stats.productos.stockBajo} stock bajo • ${stats.productos.sinStock} sin stock`}
          icon={Icons.stock}
          color="green"
        />
        
        {/* TERCERA TARJETA - CONSULTAS MÉDICAS */}
        <DashboardCard
          title="Consultas Médicas"
          value={stats.consultas.total}
          subtitle={`${stats.consultas.pendientes} pendientes • ${stats.consultas.confirmadas} confirmadas • ${stats.consultas.completadas} completadas`}
          icon={Icons.consultas}
          color="yellow"
        />
      </div>

      {/* Segunda fila - Tarjetas adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Ventas del Mes"
          value={`$${stats.ventas.mesActual.toLocaleString()}`}
          subtitle={`Promedio: $${stats.ventas.promedioPedido.toLocaleString()}`}
          icon={Icons.ventas}
          color="purple"
          trend={tendenciaVentas}
        />
        
        <DashboardCard
          title="Usuarios Registrados"
          value={stats.usuarios.total}
          subtitle={`${stats.usuarios.nuevosMes} nuevos este mes • ${stats.usuarios.activos} activos`}
          icon={Icons.usuarios}
          color="indigo"
        />
        
        <DashboardCard
          title="Ingresos Totales"
          value={`$${stats.financiero.ingresosTotales.toLocaleString()}`}
          subtitle={`Mes actual: $${stats.financiero.ingresosMes.toLocaleString()}`}
          icon={Icons.financiero}
          color="red"
          trend={tendenciaIngresos}
        />
      </div>

      {/* Tercera fila - Gráficos de las tres áreas principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardChart 
          data={datosPedidos} 
          title="Estado de Pedidos" 
          type="bar" 
        />
        <DashboardChart 
          data={datosProductos} 
          title="Estado de Stock" 
          type="bar" 
        />
        <DashboardChart 
          data={datosConsultas} 
          title="Estado de Consultas" 
          type="bar" 
        />
      </div>

      {/* Cuarta fila - Comparación de ventas */}
      <div className="grid grid-cols-1 gap-6">
        <DashboardChart 
          data={datosVentas} 
          title="Comparación de Ventas Mensuales" 
          type="bar" 
        />
      </div>

      {/* Quinta fila - Detalles adicionales organizados por área */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Detalles de Pedidos */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">{Icons.pedidos}</span>
            Detalles de Pedidos
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Pedidos</span>
              <span className="font-semibold text-blue-600">{stats.pedidos.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pendientes</span>
              <span className="font-semibold text-yellow-600">{stats.pedidos.pendientes}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Enviados</span>
              <span className="font-semibold text-blue-600">{stats.pedidos.enviados}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Entregados</span>
              <span className="font-semibold text-green-600">{stats.pedidos.entregados}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Cancelados</span>
              <span className="font-semibold text-red-600">{stats.pedidos.cancelados}</span>
            </div>
          </div>
        </div>

        {/* Detalles de Stock */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">{Icons.stock}</span>
            Estado del Stock
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Productos Activos</span>
              <span className="font-semibold text-green-600">{stats.productos.activos}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Stock Bajo</span>
              <span className="font-semibold text-yellow-600">{stats.productos.stockBajo}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Sin Stock</span>
              <span className="font-semibold text-red-600">{stats.productos.sinStock}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Productos</span>
              <span className="font-semibold text-gray-900">{stats.productos.total}</span>
            </div>
          </div>
        </div>

        {/* Detalles de Consultas */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">{Icons.consultas}</span>
            Estado de Consultas
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Consultas</span>
              <span className="font-semibold text-gray-900">{stats.consultas.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pendientes</span>
              <span className="font-semibold text-yellow-600">{stats.consultas.pendientes}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Confirmadas</span>
              <span className="font-semibold text-blue-600">{stats.consultas.confirmadas}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Completadas</span>
              <span className="font-semibold text-green-600">{stats.consultas.completadas}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sexta fila - Resumen financiero y usuarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">{Icons.financiero}</span>
            Resumen Financiero
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Ingresos Totales</span>
              <span className="font-semibold text-green-600">${stats.financiero.ingresosTotales.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Ingresos del Mes</span>
              <span className="font-semibold text-blue-600">${stats.financiero.ingresosMes.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Promedio por Pedido</span>
              <span className="font-semibold text-purple-600">${stats.ventas.promedioPedido.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total de Pedidos</span>
              <span className="font-semibold text-gray-900">{stats.pedidos.total}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">{Icons.usuarios}</span>
            Resumen de Usuarios
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Usuarios</span>
              <span className="font-semibold text-gray-900">{stats.usuarios.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Usuarios Activos</span>
              <span className="font-semibold text-green-600">{stats.usuarios.activos}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Nuevos este Mes</span>
              <span className="font-semibold text-blue-600">{stats.usuarios.nuevosMes}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Consultas</span>
              <span className="font-semibold text-yellow-600">{stats.consultas.total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 