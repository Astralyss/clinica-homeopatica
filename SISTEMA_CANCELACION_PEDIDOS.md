# Sistema de Cancelación de Pedidos

## Descripción General

Se ha implementado un sistema completo de cancelación de pedidos que permite a los administradores cancelar pedidos por diversas circunstancias y que también maneja cancelaciones automáticas del sistema cuando hay errores de pago.

## Características Principales

### 1. Cancelación Manual por Administrador
- **Botón de Cancelación**: Aparece en la tabla de órdenes para pedidos que no estén cancelados o entregados
- **Modal de Confirmación**: Solicita motivo obligatorio de la cancelación
- **Validaciones**: Previene cancelación de pedidos ya entregados
- **Restauración de Inventario**: Automáticamente restaura las cantidades de productos

### 2. Cancelación Automática del Sistema
- **API Dedicada**: `/api/admin/ordenes/cancelar-automatico`
- **Manejo de Errores de Pago**: Para casos donde falla el procesamiento de pagos
- **Marcado de Pagos**: Los pagos pendientes se marcan como fallidos

### 3. Información de Cancelación
- **Motivo**: Campo obligatorio que explica por qué se canceló
- **Responsable**: Quién canceló (admin, sistema, cliente)
- **Fecha y Hora**: Cuándo se realizó la cancelación

## Campos de Base de Datos Agregados

```sql
ALTER TABLE compras 
ADD COLUMN motivo_cancelacion TEXT,
ADD COLUMN fecha_cancelacion TIMESTAMP,
ADD COLUMN cancelado_por VARCHAR(20);
```

## APIs Implementadas

### 1. Cancelación Manual
**Endpoint**: `POST /api/admin/ordenes/cancelar`

**Body**:
```json
{
  "compraId": 123,
  "motivoCancelacion": "Producto agotado en inventario"
}
```

**Respuesta**:
```json
{
  "success": true,
  "message": "Pedido cancelado exitosamente",
  "orden": { ... }
}
```

### 2. Cancelación Automática
**Endpoint**: `POST /api/admin/ordenes/cancelar-automatico`

**Body**:
```json
{
  "compraId": 123,
  "motivoCancelacion": "Error en procesamiento de pago",
  "errorPago": "Tarjeta rechazada"
}
```

## Flujo de Cancelación

### Cancelación Manual
1. Admin hace clic en "Cancelar" en la tabla de órdenes
2. Se abre modal solicitando motivo de cancelación
3. Al confirmar:
   - Se actualiza estado de la compra a "cancelada"
   - Se registra motivo, fecha y responsable
   - Se restauran cantidades de inventario
   - Se marcan pagos como reembolsados si es necesario

### Cancelación Automática
1. Sistema detecta error en pago
2. Llama a API de cancelación automática
3. Se ejecuta el mismo flujo pero marcando "canceladoPor" como "sistema"

## Interfaz de Usuario

### Panel Administrativo
- **Botón de Cancelación**: Aparece solo para pedidos cancelables
- **Modal de Confirmación**: Con validaciones y explicación de consecuencias
- **Información de Cancelación**: Se muestra en el modal de detalles

### Panel del Cliente
- **Estado Cancelado**: Se muestra claramente con icono y color
- **Motivo de Cancelación**: Visible en los detalles de la compra
- **Información Completa**: Fecha, responsable y motivo

## Validaciones y Seguridad

### Validaciones de Negocio
- No se puede cancelar pedidos ya entregados
- No se puede cancelar pedidos ya cancelados
- Motivo de cancelación es obligatorio
- Solo administradores pueden cancelar manualmente

### Seguridad
- Verificación de permisos de administrador
- Transacciones de base de datos para consistencia
- Logs de todas las cancelaciones

## Casos de Uso

### 1. Producto Agotado
- Admin cancela pedido por falta de inventario
- Se restaura inventario automáticamente
- Cliente ve motivo claro de la cancelación

### 2. Error de Pago
- Sistema detecta fallo en procesamiento
- Cancela automáticamente el pedido
- Marca pago como fallido
- Cliente puede reintentar la compra

### 3. Problemas de Envío
- Admin cancela por problemas logísticos
- Se procesa reembolso si es necesario
- Cliente recibe explicación detallada

## Mantenimiento y Monitoreo

### Logs Recomendados
- Todas las cancelaciones (manuales y automáticas)
- Errores en el proceso de cancelación
- Cambios de estado de pedidos

### Métricas Útiles
- Tasa de cancelación por motivo
- Tiempo promedio desde compra hasta cancelación
- Pedidos cancelados por administrador vs sistema

## Próximas Mejoras Sugeridas

1. **Notificaciones por Email**: Avisar al cliente cuando se cancela su pedido
2. **Historial de Cancelaciones**: Mantener registro de todas las cancelaciones
3. **Reactivación de Pedidos**: Permitir reactivar pedidos cancelados en casos especiales
4. **Reportes**: Generar reportes de cancelaciones para análisis
5. **Integración con Stripe**: Cancelación automática de intenciones de pago

## Archivos Modificados

- `prisma/schema.prisma` - Esquema de base de datos
- `src/app/admin/pedidos/page.jsx` - Panel administrativo
- `src/app/farmacia/mis-compras/page.jsx` - Vista del cliente
- `src/app/api/admin/ordenes/route.js` - API principal de órdenes
- `src/app/api/admin/ordenes/cancelar/route.js` - API de cancelación manual
- `src/app/api/admin/ordenes/cancelar-automatico/route.js` - API de cancelación automática

## Instalación

1. Ejecutar migración de base de datos:
```bash
npx prisma migrate dev --name add_cancelacion_fields
```

2. Reiniciar el servidor de desarrollo
3. Verificar que las nuevas funcionalidades estén disponibles

## Soporte

Para problemas o preguntas sobre el sistema de cancelación, revisar:
- Logs del servidor
- Estado de la base de datos
- Permisos de administrador
- Validaciones de negocio 