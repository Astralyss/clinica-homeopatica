-- Crear la base de datos
CREATE DATABASE clinicahomeopatica;

-- Conectar a la base de datos
\c clinicahomeopatica;

-- Crear tabla de productos
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    presentacion VARCHAR(100) NOT NULL,
    descripcion TEXT,
    beneficios TEXT[], -- Array de texto para múltiples beneficios
    imagen_url VARCHAR(500),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_productos_categoria ON productos(categoria);
CREATE INDEX idx_productos_nombre ON productos(nombre);
CREATE INDEX idx_productos_activo ON productos(activo);

-- Función para actualizar la fecha de modificación automáticamente
CREATE OR REPLACE FUNCTION actualizar_fecha_modificacion()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar automáticamente la fecha de modificación
CREATE TRIGGER trigger_actualizar_fecha_productos
    BEFORE UPDATE ON productos
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_fecha_modificacion();

-- Insertar algunos datos de ejemplo
INSERT INTO productos (nombre, categoria, precio, presentacion, descripcion, beneficios, imagen_url) VALUES
('Arnica Montana 30CH', 'Traumatología', 85.50, 'Frasco gotero 30ml', 'Medicamento homeopático para traumatismos y golpes', 
 ARRAY['Reduce inflamación', 'Alivia dolores musculares', 'Acelera recuperación de hematomas'], 
 'https://ejemplo.com/arnica.jpg'),

('Calendula 6CH', 'Dermatología', 72.00, 'Tubo granulos 4g', 'Tratamiento homeopático para heridas y problemas de piel', 
 ARRAY['Cicatrización', 'Antiséptico natural', 'Regeneración tisular'], 
 'https://ejemplo.com/calendula.jpg'),

('Nux Vomica 200CH', 'Digestivo', 95.75, 'Frasco gotero 30ml', 'Para trastornos digestivos y del sistema nervioso', 
 ARRAY['Mejora digestión', 'Reduce estrés', 'Regula el sueño'], 
 'https://ejemplo.com/nux-vomica.jpg');

-- Consultas útiles para verificar la estructura y datos

-- Ver la estructura de la tabla
\d productos;

-- Mostrar todos los productos
SELECT * FROM productos;

-- Buscar productos por categoría
SELECT nombre, categoria, precio FROM productos WHERE categoria = 'Traumatología';

-- Buscar productos que contengan un beneficio específico
SELECT nombre, beneficios FROM productos WHERE 'Reduce inflamación' = ANY(beneficios);

-- Contar productos por categoría
SELECT categoria, COUNT(*) as total_productos FROM productos GROUP BY categoria;