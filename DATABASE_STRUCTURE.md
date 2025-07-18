# Estructura de Base de Datos - Clínica Homeopática

## 📋 Resumen de Tablas

### 🔐 Autenticación y Usuarios
- **`roles`** - Roles del sistema (admin, cliente, vendedor)
- **`usuarios`** - Información de usuarios registrados
- **`direcciones`** - Direcciones de envío de los usuarios

### 🛒 Carrito y Compras
- **`carritos`** - Carritos de compra de usuarios
- **`items_carrito`** - Productos en el carrito
- **`compras`** - Órdenes de compra completadas
- **`items_compra`** - Snapshot de productos al momento de comprar

### 💳 Pagos
- **`pagos`** - Información de pagos con Stripe

### 📦 Envíos
- **`envios`** - Información de envíos y tracking

### 🏥 Consultas Médicas
- **`consultas`** - Citas médicas agendadas

### 🛍️ Productos (Existente)
- **`productos`** - Catálogo de productos
- **`imagenes_producto`** - Imágenes de productos

---

## 🔄 Flujo de Compra

### 1. Registro/Login de Usuario
```
Usuario se registra → Se crea registro en `usuarios`
→ Se asigna rol 'cliente' por defecto
→ Se puede agregar direcciones en `direcciones`
```

### 2. Agregar al Carrito
```
Usuario agrega producto → Se crea/actualiza `carritos`
→ Se agrega item en `items_carrito`
→ Se guarda precio unitario al momento de agregar
```

### 3. Proceso de Compra
```
Usuario procede a comprar → Se crea `compra`
→ Se copian items de carrito a `items_compra` (snapshot)
→ Se procesa pago → Se crea registro en `pagos`
→ Se crea envío en `envios`
→ Se actualiza inventario de productos
```

---

## 🎯 Características Principales

### ✅ Ventajas del Diseño

1. **Separación de Roles**: Sistema de roles para administradores y clientes
2. **Carrito Persistente**: Los carritos se mantienen en la base de datos
3. **Snapshot de Precios**: Los precios se guardan al momento de comprar
4. **Múltiples Direcciones**: Usuarios pueden tener varias direcciones
5. **Tracking de Envíos**: Sistema completo de seguimiento
6. **Integración Stripe**: Campos específicos para pasarela de pagos
7. **Estados de Compra**: Seguimiento completo del ciclo de vida

### 🔧 Campos Importantes

#### Usuarios
- `id_usuario`: Identificador único (UUID o código)
- `rolId`: Relación con tabla de roles
- `emailVerificado`: Para verificación de email
- `ultimoAcceso`: Para analytics

#### Compras
- `numeroOrden`: Formato ORD-2024-001
- `estado`: pendiente → confirmada → en_proceso → enviada → entregada
- `subtotal`, `descuento`, `impuestos`, `costoEnvio`, `total`

#### Pagos
- `stripePaymentIntentId`: ID de Stripe para tracking
- `stripeCustomerId`: Cliente de Stripe
- `estado`: pendiente → procesando → completado → fallido

#### Envíos
- `numeroGuia`: Número de guía de la empresa de envíos
- `empresaEnvio`: fedex, dhl, estafeta, etc.
- `estado`: pendiente → enviado → en_transito → entregado

---

## 🚀 Cómo Usar

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Configurar Base de Datos
```bash
# Generar cliente Prisma
npm run db:generate

# Ejecutar migraciones
npm run db:migrate

# Insertar datos iniciales
npm run db:seed
```

### 3. Datos de Acceso Inicial

#### Administrador
- **Email**: admin@clinica.com
- **Password**: admin123
- **Rol**: admin

#### Cliente de Prueba
- **Email**: cliente@test.com
- **Password**: cliente123
- **Rol**: cliente

---

## 🔐 Gestión de Administradores

### Crear Nuevo Administrador

1. **Directamente en la Base de Datos**:
```sql
INSERT INTO usuarios (
  id_usuario, email, password, nombre, 
  apellido_paterno, rol_id, activo, email_verificado
) VALUES (
  'ADM-002', 'nuevo@admin.com', 
  '$2a$12$hashedPassword', 'Nuevo', 'Admin', 1, true, true
);
```

2. **Usando el Script de Seed**:
```javascript
// Agregar en prisma/seed.js
const nuevoAdmin = await prisma.usuario.upsert({
  where: { email: 'nuevo@admin.com' },
  update: {},
  create: {
    id_usuario: 'ADM-002',
    email: 'nuevo@admin.com',
    password: await bcrypt.hash('password123', 12),
    nombre: 'Nuevo',
    apellidoPaterno: 'Admin',
    rolId: adminRol.id
  }
});
```

### Panel de Administración de Admins

Recomendación: Crear una sección en `/admin/usuarios` para:
- Ver todos los usuarios
- Cambiar roles
- Activar/desactivar usuarios
- Resetear contraseñas

---

## 💳 Integración con Stripe

### Campos de Stripe en la Tabla `pagos`:

1. **`stripePaymentIntentId`**: ID único del intento de pago
2. **`stripeCustomerId`**: ID del cliente en Stripe
3. **`metodoPago`**: 'tarjeta', 'paypal', etc.
4. **`estado`**: Sincronizado con el estado de Stripe

### Flujo de Pago:
```
1. Cliente inicia compra → Crear PaymentIntent en Stripe
2. Guardar stripePaymentIntentId en `pagos`
3. Cliente completa pago → Stripe webhook
4. Actualizar estado en `pagos` y `compras`
```

---

## 📊 Estados y Flujos

### Estados de Compra:
- **pendiente**: Compra creada, esperando pago
- **confirmada**: Pago confirmado
- **en_proceso**: Preparando envío
- **enviada**: Enviada con guía
- **entregada**: Entregada al cliente
- **cancelada**: Compra cancelada

### Estados de Pago:
- **pendiente**: Esperando confirmación
- **procesando**: Procesando pago
- **completado**: Pago exitoso
- **fallido**: Pago fallido
- **reembolsado**: Pago reembolsado

---

## 🔧 Mantenimiento

### Comandos Útiles:
```bash
# Ver estado de migraciones
npx prisma migrate status

# Resetear base de datos
npm run db:reset

# Generar cliente Prisma
npm run db:generate

# Ver datos en Prisma Studio
npx prisma studio
```

### Backup y Restore:
```bash
# Backup
pg_dump DATABASE_URL > backup.sql

# Restore
psql DATABASE_URL < backup.sql
```

---

## 🎯 Próximos Pasos

1. **Implementar autenticación JWT**
2. **Crear APIs para usuarios y carrito**
3. **Integrar Stripe para pagos**
4. **Crear panel de administración de usuarios**
5. **Implementar sistema de notificaciones**
6. **Agregar analytics y reportes**

---

## 📝 Notas Importantes

- **Seguridad**: Las contraseñas se hashean con bcrypt
- **Escalabilidad**: Diseño preparado para crecimiento
- **Auditoría**: Todas las tablas tienen timestamps
- **Flexibilidad**: Sistema de roles extensible
- **Compliance**: Campos para cumplimiento legal 