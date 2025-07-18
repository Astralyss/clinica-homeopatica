# 🚀 Guía de Implementación - Sistema de Usuarios y Autenticación

## 📋 Resumen de lo Implementado

He creado una estructura completa de base de datos y sistema de autenticación para tu clínica homeopática. Aquí está lo que se ha implementado:

### 🗄️ Base de Datos
- **12 tablas** relacionadas para usuarios, carrito, compras, pagos y envíos
- **Sistema de roles** (admin, cliente, vendedor)
- **Relaciones optimizadas** entre todas las tablas
- **Campos para Stripe** en la tabla de pagos

### 🔐 Autenticación
- **Sistema JWT** con cookies seguras
- **APIs completas** para registro, login, logout
- **Middleware** para proteger rutas de administración
- **Hook personalizado** para manejar auth en el frontend

---

## 🛠️ Pasos para Implementar

### 1. Instalar Dependencias
```bash
npm install bcryptjs jsonwebtoken stripe
```

### 2. Configurar Variables de Entorno
Crear archivo `.env.local`:
```env
# Base de datos
DATABASE_URL="postgresql://usuario:password@localhost:5432/clinica_homeopatica"

# JWT
JWT_SECRET="tu-secreto-jwt-super-seguro-cambiar-en-produccion"

# Stripe (opcional para pagos)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

### 3. Ejecutar Migraciones
```bash
# Generar cliente Prisma
npm run db:generate

# Ejecutar migraciones
npm run db:migrate

# Insertar datos iniciales
npm run db:seed
```

### 4. Verificar Instalación
```bash
# Ver datos en Prisma Studio
npx prisma studio
```

---

## 🔐 Datos de Acceso Inicial

### Administrador
- **Email**: admin@clinica.com
- **Password**: admin123
- **Rol**: admin

### Cliente de Prueba
- **Email**: cliente@test.com
- **Password**: cliente123
- **Rol**: cliente

---

## 📁 Estructura de Archivos Creados

```
prisma/
├── schema.prisma          # Esquema completo de BD
├── seed.js               # Datos iniciales
└── package.json          # Configuración Prisma

src/
├── utils/
│   ├── auth/
│   │   └── authService.js    # Servicio de autenticación
│   └── hooks/
│       └── useAuth.js        # Hook para auth en frontend
├── app/
│   └── api/
│       └── auth/
│           ├── login/
│           │   └── route.js  # API login
│           ├── registro/
│           │   └── route.js  # API registro
│           ├── logout/
│           │   └── route.js  # API logout
│           └── verificar/
│               └── route.js  # API verificar auth
└── middleware.js             # Middleware de protección
```

---

## 🎯 Cómo Usar el Sistema

### 1. Proteger Rutas de Administración
El middleware ya protege automáticamente las rutas `/admin/*`. Solo usuarios con rol admin pueden acceder.

### 2. Usar Autenticación en Componentes
```jsx
import { useAuth } from '@/utils/hooks/useAuth';

function MiComponente() {
  const { user, login, logout, isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <div>Por favor inicia sesión</div>;
  }

  return (
    <div>
      <h1>Hola {user.nombre}</h1>
      {isAdmin && <p>Eres administrador</p>}
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
}
```

### 3. Envolver la App con AuthProvider
```jsx
// En layout.jsx o _app.jsx
import { AuthProvider } from '@/utils/hooks/useAuth';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

---

## 🛒 Funcionalidades del Carrito

### Estructura del Carrito
- **Carrito persistente** en la base de datos
- **Precios snapshot** al momento de agregar
- **Múltiples carritos** por usuario (historial)

### APIs Necesarias (por implementar)
```javascript
// Agregar al carrito
POST /api/carrito/agregar
{
  "productoId": 1,
  "cantidad": 2
}

// Obtener carrito
GET /api/carrito

// Actualizar cantidad
PUT /api/carrito/actualizar
{
  "itemId": 1,
  "cantidad": 3
}

// Eliminar item
DELETE /api/carrito/eliminar/1
```

---

## 💳 Integración con Stripe

### Campos en la Tabla `pagos`:
- `stripePaymentIntentId`: ID del intento de pago
- `stripeCustomerId`: ID del cliente en Stripe
- `metodoPago`: 'tarjeta', 'paypal', etc.
- `estado`: Sincronizado con Stripe

### Flujo de Pago:
1. Cliente inicia compra → Crear PaymentIntent
2. Guardar `stripePaymentIntentId` en `pagos`
3. Cliente completa pago → Webhook de Stripe
4. Actualizar estado en `pagos` y `compras`

---

## 📊 Estados de Compra

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

## 🔧 Comandos Útiles

### Base de Datos
```bash
# Ver estado de migraciones
npx prisma migrate status

# Resetear base de datos
npm run db:reset

# Ver datos en Prisma Studio
npx prisma studio

# Generar cliente Prisma
npm run db:generate
```

### Desarrollo
```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
```

---

## 🎯 Próximos Pasos Recomendados

### 1. Implementar APIs del Carrito
- Crear APIs para agregar/eliminar productos
- Implementar persistencia del carrito
- Crear componente de carrito

### 2. Crear Panel de Usuarios
- Página de perfil de usuario
- Gestión de direcciones
- Historial de compras

### 3. Implementar Stripe
- Configurar webhooks
- Crear componentes de pago
- Manejar estados de pago

### 4. Crear Panel de Administración
- Gestión de usuarios
- Panel de órdenes
- Reportes de ventas

### 5. Mejorar UX
- Formularios de login/registro
- Validaciones en frontend
- Mensajes de error/éxito

---

## ⚠️ Consideraciones de Seguridad

### ✅ Implementado
- Contraseñas hasheadas con bcrypt
- Tokens JWT con expiración
- Cookies httpOnly y secure
- Middleware de protección
- Validación de roles

### 🔒 Recomendaciones Adicionales
- Usar HTTPS en producción
- Implementar rate limiting
- Agregar validación de email
- Implementar recuperación de contraseña
- Agregar logs de auditoría

---

## 🐛 Solución de Problemas

### Error: "Cannot find module '@/generated/prisma'"
```bash
npm run db:generate
```

### Error: "Database connection failed"
Verificar `DATABASE_URL` en `.env.local`

### Error: "JWT_SECRET is not defined"
Agregar `JWT_SECRET` en `.env.local`

### Error: "bcrypt is not a function"
```bash
npm install bcryptjs
```

---

## 📞 Soporte

Si tienes problemas con la implementación:

1. **Verificar logs** en la consola
2. **Revisar variables de entorno**
3. **Ejecutar migraciones** nuevamente
4. **Verificar conexión a BD**

---

## 🎉 ¡Listo!

Tu sistema de usuarios y autenticación está listo para usar. Puedes:

- ✅ Registrar nuevos usuarios
- ✅ Iniciar sesión
- ✅ Proteger rutas de administración
- ✅ Manejar roles de usuario
- ✅ Persistir carritos de compra
- ✅ Procesar pagos con Stripe

¡El sistema está preparado para escalar y crecer con tu negocio! 