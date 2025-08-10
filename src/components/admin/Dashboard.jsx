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
    <div className="space-y-8">
      {/* Header mejorado */}
      {/* <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-8 border border-slate-200">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Dashboard Administrativo</h1>
        <p className="text-lg text-slate-600">Resumen general de la clínica homeopática</p>
        <div className="mt-4 flex items-center space-x-4 text-sm text-slate-500">
          <span>📊 Última actualización: {new Date().toLocaleDateString('es-ES')}</span>
          <span>🏥 Total de áreas monitoreadas: 6</span>
        </div>
      </div> */}

      {/* Primera fila - Tarjetas principales mejoradas con información integrada */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* TARJETA DE PEDIDOS - Mejorada con detalles integrados */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
          <div className="bg-gradient-to-br from-slate-100 to-slate-200 p-6 text-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">Estado de Pedidos</h3>
                <p className="text-slate-600 text-sm mt-1">Gestión de órdenes del sistema</p>
              </div>
              <div className="bg-slate-300 bg-opacity-50 p-3 rounded-full">
                {Icons.pedidos}
              </div>
            </div>
            <div className="mt-4">
              <div className="text-4xl font-bold text-slate-800">{stats.pedidos.total}</div>
              <div className="text-slate-600 text-sm">Total de pedidos</div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">Pendientes</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-slate-200 rounded-full h-2">
                    <div className="bg-amber-300 h-2 rounded-full" style={{width: `${(stats.pedidos.pendientes / stats.pedidos.total) * 100}%`}}></div>
                  </div>
                  <span className="font-semibold text-amber-600">{stats.pedidos.pendientes}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">Enviados</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-slate-200 rounded-full h-2">
                    <div className="bg-slate-400 h-2 rounded-full" style={{width: `${(stats.pedidos.enviados / stats.pedidos.total) * 100}%`}}></div>
                  </div>
                  <span className="font-semibold text-slate-600">{stats.pedidos.enviados}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">Entregados</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-slate-200 rounded-full h-2">
                    <div className="bg-emerald-300 h-2 rounded-full" style={{width: `${(stats.pedidos.entregados / stats.pedidos.total) * 100}%`}}></div>
                  </div>
                  <span className="font-semibold text-emerald-600">{stats.pedidos.entregados}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-600">Cancelados</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-slate-200 rounded-full h-2">
                    <div className="bg-rose-300 h-2 rounded-full" style={{width: `${(stats.pedidos.cancelados / stats.pedidos.total) * 100}%`}}></div>
                  </div>
                  <span className="font-semibold text-rose-600">{stats.pedidos.cancelados}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TARJETA DE STOCK - Mejorada con detalles integrados */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 text-emerald-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">Estado del Stock</h3>
                <p className="text-emerald-600 text-sm mt-1">Control de inventario</p>
              </div>
              <div className="bg-emerald-200 bg-opacity-50 p-3 rounded-full">
                {Icons.stock}
              </div>
            </div>
            <div className="mt-4">
              <div className="text-4xl font-bold text-emerald-800">{stats.productos.activos}</div>
              <div className="text-emerald-600 text-sm">Productos activos</div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">Productos Activos</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-slate-200 rounded-full h-2">
                    <div className="bg-emerald-300 h-2 rounded-full" style={{width: `${(stats.productos.activos / stats.productos.total) * 100}%`}}></div>
                  </div>
                  <span className="font-semibold text-emerald-600">{stats.productos.activos}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">Stock Bajo</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-slate-200 rounded-full h-2">
                    <div className="bg-amber-300 h-2 rounded-full" style={{width: `${(stats.productos.stockBajo / stats.productos.total) * 100}%`}}></div>
                  </div>
                  <span className="font-semibold text-amber-600">{stats.productos.stockBajo}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-600">Sin Stock</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-slate-200 rounded-full h-2">
                    <div className="bg-rose-300 h-2 rounded-full" style={{width: `${(stats.productos.sinStock / stats.productos.total) * 100}%`}}></div>
                  </div>
                  <span className="font-semibold text-rose-600">{stats.productos.sinStock}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Total Productos</span>
                  <span className="font-bold text-slate-900">{stats.productos.total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TARJETA DE CONSULTAS - Mejorada con detalles integrados */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 text-amber-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">Consultas Médicas</h3>
                <p className="text-amber-600 text-sm mt-1">Estado de citas médicas</p>
              </div>
              <div className="bg-amber-200 bg-opacity-50 p-3 rounded-full">
                {Icons.consultas}
              </div>
            </div>
            <div className="mt-4">
              <div className="text-4xl font-bold text-amber-800">{stats.consultas.total}</div>
              <div className="text-amber-600 text-sm">Total de consultas</div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">Pendientes</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-slate-200 rounded-full h-2">
                    <div className="bg-amber-300 h-2 rounded-full" style={{width: `${(stats.consultas.pendientes / stats.consultas.total) * 100}%`}}></div>
                  </div>
                  <span className="font-semibold text-amber-600">{stats.consultas.pendientes}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">Confirmadas</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-slate-200 rounded-full h-2">
                    <div className="bg-slate-400 h-2 rounded-full" style={{width: `${(stats.consultas.confirmadas / stats.consultas.total) * 100}%`}}></div>
                  </div>
                  <span className="font-semibold text-slate-600">{stats.consultas.confirmadas}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-600">Completadas</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-slate-200 rounded-full h-2">
                    <div className="bg-emerald-300 h-2 rounded-full" style={{width: `${(stats.consultas.completadas / stats.consultas.total) * 100}%`}}></div>
                  </div>
                  <span className="font-semibold text-emerald-600">{stats.consultas.completadas}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Segunda fila - Tarjetas financieras y de usuarios */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <DashboardCard
          title="Ventas del Mes"
          value={`$${stats.ventas.mesActual.toLocaleString()}`}
          subtitle={`Promedio: $${stats.ventas.promedioPedido.toLocaleString()}`}
          icon={Icons.ventas}
          color="slate"
          trend={tendenciaVentas}
        />
        
        <DashboardCard
          title="Usuarios Registrados"
          value={stats.usuarios.total}
          subtitle={`${stats.usuarios.nuevosMes} nuevos este mes • ${stats.usuarios.activos} activos`}
          icon={Icons.usuarios}
          color="slate"
        />
        
        <DashboardCard
          title="Ingresos Totales"
          value={`$${stats.financiero.ingresosTotales.toLocaleString()}`}
          subtitle={`Mes actual: $${stats.financiero.ingresosMes.toLocaleString()}`}
          icon={Icons.financiero}
          color="slate"
          trend={tendenciaIngresos}
        />
      </div>

      {/* Tercera fila - Gráficos mejorados */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl border border-slate-200 shadow-lg p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <span className="mr-2 text-slate-600">{Icons.pedidos}</span>
            Distribución de Pedidos
          </h3>
          <DashboardChart 
            data={datosPedidos} 
            title="" 
            type="doughnut" 
          />
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200 shadow-lg p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <span className="mr-2 text-emerald-600">{Icons.stock}</span>
            Estado del Inventario
          </h3>
          <DashboardChart 
            data={datosProductos} 
            title="" 
            type="doughnut" 
          />
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200 shadow-lg p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <span className="mr-2 text-amber-600">{Icons.consultas}</span>
            Estado de Consultas
          </h3>
          <DashboardChart 
            data={datosConsultas} 
            title="" 
            type="doughnut" 
          />
        </div>
      </div>

      {/* Cuarta fila - Comparación de ventas */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-lg p-6">
        <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
          <span className="mr-3 text-slate-600">{Icons.ventas}</span>
          Análisis de Ventas Mensuales
        </h3>
        <DashboardChart 
          data={datosVentas} 
          title="" 
          type="bar" 
        />
      </div>
    </div>
  );
};

export default Dashboard; 