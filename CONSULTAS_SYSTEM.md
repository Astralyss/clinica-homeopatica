# Sistema de Consultas Médicas

## Descripción General

El sistema de consultas médicas permite a los pacientes agendar citas con la clínica homeopática y a los administradores gestionar estas consultas desde el panel administrativo.

## Estructura de la Base de Datos

### Tabla `consultas`

```sql
CREATE TABLE consultas (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id),
  nombre VARCHAR(255) NOT NULL,
  apellido VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefono VARCHAR(50) NOT NULL,
  fecha_consulta DATE NOT NULL,
  hora_consulta VARCHAR(10) NOT NULL,
  estado VARCHAR(50) DEFAULT 'pendiente',
  notas TEXT,
  fecha_creacion TIMESTAMP DEFAULT NOW()
);
```

### Estados de Consulta

- `pendiente`: Consulta recién creada, esperando confirmación
- `confirmada`: Consulta confirmada por el administrador
- `completada`: Consulta realizada exitosamente
- `cancelada`: Consulta cancelada

## API Endpoints

### Consultas

#### GET `/api/consultas`
Obtiene todas las consultas con filtros opcionales.

**Parámetros de consulta:**
- `estado`: Filtrar por estado (pendiente, confirmada, completada, cancelada)
- `fechaDesde`: Filtrar desde una fecha específica
- `fechaHasta`: Filtrar hasta una fecha específica

**Respuesta:**
```json
[
  {
    "id": 1,
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan@email.com",
    "telefono": "1234567890",
    "fechaConsulta": "2024-01-15T00:00:00.000Z",
    "horaConsulta": "09:00",
    "estado": "pendiente",
    "notas": null,
    "fechaCreacion": "2024-01-10T10:30:00.000Z"
  }
]
```

#### POST `/api/consultas`
Crea una nueva consulta.

**Body:**
```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "correo": "juan@email.com",
  "telefono": "1234567890",
  "fechaSeleccionada": "2024-01-15",
  "horaSeleccionada": "09:00"
}
```

**Respuesta:**
```json
{
  "message": "Consulta creada exitosamente",
  "data": {
    "id": 1,
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan@email.com",
    "telefono": "1234567890",
    "fechaConsulta": "2024-01-15T00:00:00.000Z",
    "horaConsulta": "09:00",
    "estado": "pendiente",
    "fechaCreacion": "2024-01-10T10:30:00.000Z"
  }
}
```

#### GET `/api/consultas/[id]`
Obtiene una consulta específica por ID.

#### PUT `/api/consultas/[id]`
Actualiza una consulta existente.

**Body:**
```json
{
  "estado": "confirmada",
  "notas": "Paciente confirmado por teléfono"
}
```

#### DELETE `/api/consultas/[id]`
Cancela una consulta (marca como cancelada).

### Estadísticas

#### GET `/api/consultas/estadisticas`
Obtiene estadísticas de consultas.

**Respuesta:**
```json
{
  "total": 25,
  "pendientes": 8,
  "confirmadas": 12,
  "completadas": 3,
  "canceladas": 2,
  "porMes": [...]
}
```

### Disponibilidad

#### GET `/api/consultas/disponibilidad`
Verifica la disponibilidad de un horario específico.

**Parámetros:**
- `fecha`: Fecha en formato YYYY-MM-DD
- `hora`: Hora en formato HH:MM

**Respuesta:**
```json
{
  "disponible": true,
  "fecha": "2024-01-15",
  "hora": "09:00"
}
```

## Componentes

### ConsultasAdminPanel
Panel de administración para gestionar consultas.

**Funcionalidades:**
- Ver todas las consultas en una tabla
- Filtrar por estado, fecha y búsqueda de texto
- Ver estadísticas en tiempo real
- Editar estado y notas de consultas
- Cancelar consultas
- Modal para ver detalles completos

### Formulario de Agendar Consulta
Formulario para que los pacientes agenden consultas.

**Campos:**
- Nombre y apellido
- Email y teléfono
- Fecha y hora de la consulta
- Validación de disponibilidad automática

## Servicios

### consultasService
Servicio principal para manejar operaciones de consultas.

**Métodos:**
- `crearConsulta(datos)`: Crea una nueva consulta
- `obtenerConsultas(filtros)`: Obtiene consultas con filtros
- `obtenerConsultaPorId(id)`: Obtiene una consulta específica
- `actualizarEstadoConsulta(id, estado, notas)`: Actualiza estado y notas
- `obtenerEstadisticasConsultas()`: Obtiene estadísticas
- `verificarDisponibilidad(fecha, hora)`: Verifica disponibilidad

## Hooks

### useConsultas
Hook personalizado para manejar consultas en componentes React.

**Funcionalidades:**
- Estado de carga y errores
- Funciones para todas las operaciones CRUD
- Filtrado local de consultas
- Manejo automático de recarga de datos

## Flujo de Trabajo

1. **Paciente agenda consulta:**
   - Completa formulario en `/agendarConsulta`
   - Sistema valida disponibilidad
   - Se crea consulta con estado "pendiente"

2. **Administrador gestiona consultas:**
   - Accede al panel en `/admin/consultas`
   - Ve todas las consultas y estadísticas
   - Puede confirmar, completar o cancelar consultas
   - Agrega notas y comentarios

3. **Seguimiento:**
   - Sistema mantiene historial completo
   - Estadísticas actualizadas en tiempo real
   - Filtros para búsqueda eficiente

## Validaciones

- **Campos requeridos:** nombre, apellido, email, teléfono, fecha, hora
- **Formato de email:** Validación de formato válido
- **Disponibilidad:** Verificación automática de horarios disponibles
- **Fechas:** Solo fechas futuras, excluyendo fines de semana
- **Horarios:** Solo horarios permitidos (09:00-18:00)

## Configuración

### Variables de Entorno
```env
DATABASE_URL=postgresql://usuario:password@localhost:5432/clinica_homeopatica
```

### Migraciones
```bash
npx prisma migrate dev --name add_consultas_table
npx prisma generate
```

## Próximas Mejoras

- [ ] Notificaciones por email al paciente
- [ ] Calendario visual para selección de fechas
- [ ] Sistema de recordatorios automáticos
- [ ] Integración con calendario externo
- [ ] Reportes y análisis avanzados
- [ ] Sistema de pagos para consultas
- [ ] Historial médico del paciente
- [ ] Consultas virtuales/videollamadas 