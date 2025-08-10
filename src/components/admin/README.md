# Dashboard Administrativo

## Descripción
El dashboard administrativo proporciona una vista general completa de la clínica homeopática, mostrando estadísticas clave en tiempo real sobre pedidos, productos, ventas, consultas, usuarios y finanzas.

## Componentes

### DashboardCard
Tarjeta reutilizable que muestra una métrica específica con:
- Título descriptivo
- Valor principal
- Subtítulo con información adicional
- Icono representativo
- Color temático
- Indicador de tendencia (opcional)

### DashboardChart
Componente de gráficos que visualiza datos en:
- Gráficos de barras
- Gráficos circulares (en desarrollo)
- Colores automáticos por categoría
- Animaciones suaves

### Dashboard
Componente principal que integra:
- 6 tarjetas principales con métricas clave
- 4 gráficos de barras para visualización
- 2 paneles de resumen detallado
- Carga asíncrona de datos
- Manejo de errores y estados de carga

## APIs del Dashboard

### `/api/admin/dashboard`
Endpoint principal que consolida todas las estadísticas en una sola llamada:
- **Pedidos**: total, pendientes, enviados, entregados, cancelados
- **Productos**: total, activos, stock bajo, sin stock
- **Ventas**: total, mes actual, promedio por pedido, mes anterior
- **Consultas**: total, pendientes, confirmadas, completadas
- **Usuarios**: total, nuevos este mes, activos
- **Financiero**: ingresos totales, mes actual, mes anterior

### Endpoints individuales
- `/api/admin/dashboard/pedidos`
- `/api/admin/dashboard/productos`
- `/api/admin/dashboard/ventas`
- `/api/admin/dashboard/consultas`
- `/api/admin/dashboard/usuarios`
- `/api/admin/dashboard/financiero`

## Características

### Métricas en Tiempo Real
- Conteo de pedidos por estado
- Inventario de productos
- Ventas mensuales y totales
- Estado de consultas médicas
- Registro de usuarios
- Análisis financiero

### Visualización
- Tarjetas coloridas con iconos
- Gráficos de barras interactivos
- Indicadores de tendencia
- Diseño responsive
- Colores temáticos por categoría

### Rendimiento
- Consultas paralelas a la base de datos
- Caché de datos en el cliente
- Lazy loading de componentes
- Optimización de consultas Prisma

## Uso

```jsx
import Dashboard from './components/admin/Dashboard';

function AdminPanel() {
  return (
    <div className="p-4">
      <Dashboard />
    </div>
  );
}
```

## Personalización

### Colores de Tarjetas
- `blue`: Pedidos
- `green`: Productos
- `purple`: Ventas
- `yellow`: Consultas
- `indigo`: Usuarios
- `red`: Financiero

### Tipos de Gráficos
- `bar`: Gráfico de barras horizontal
- `pie`: Gráfico circular (en desarrollo)

## Dependencias
- React Hooks para estado
- Prisma para consultas a la base de datos
- Tailwind CSS para estilos
- SVG para iconos y gráficos

## Mantenimiento
- Las estadísticas se actualizan automáticamente al cargar la página
- Los errores se muestran de forma amigable
- El estado de carga se indica claramente
- Las consultas a la base de datos se optimizan para rendimiento 