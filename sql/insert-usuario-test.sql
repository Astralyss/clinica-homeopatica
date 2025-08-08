-- Script para insertar usuario de prueba
-- Ejecutar este script en tu base de datos PostgreSQL

-- 1. Insertar rol de cliente si no existe
INSERT INTO roles (nombre, descripcion) 
VALUES ('cliente', 'Usuario cliente de la farmacia')
ON CONFLICT (nombre) DO NOTHING;

-- 2. Obtener el ID del rol cliente
DO $$
DECLARE
    rol_cliente_id INTEGER;
BEGIN
    SELECT id INTO rol_cliente_id FROM roles WHERE nombre = 'cliente';
    
    -- 3. Insertar usuario de prueba
    INSERT INTO usuarios (
        id_usuario, 
        email, 
        password, 
        nombre, 
        apellido_paterno, 
        apellido_materno, 
        telefono, 
        fecha_nacimiento, 
        genero, 
        activo, 
        email_verificado, 
        rol_id
    ) VALUES (
        'CLI-123456789',
        'jaime.garcia@email.com',
        '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8HqKqG', -- password123
        'Jaime',
        'García',
        'López',
        '5512345678',
        '1990-05-15',
        'M',
        true,
        true,
        rol_cliente_id
    ) ON CONFLICT (email) DO NOTHING;
    
    -- 4. Obtener el ID del usuario insertado
    DECLARE
        usuario_id INTEGER;
    BEGIN
        SELECT id INTO usuario_id FROM usuarios WHERE email = 'jaime.garcia@email.com';
        
        -- 5. Insertar dirección de prueba
        INSERT INTO direcciones (
            usuario_id,
            tipo,
            nombre,
            calle,
            numero_exterior,
            colonia,
            ciudad,
            estado,
            codigo_postal,
            referencias
        ) VALUES (
            usuario_id,
            'casa',
            'Dirección principal',
            'Av. Insurgentes Sur',
            '123',
            'Del Valle',
            'Ciudad de México',
            'CDMX',
            '03100',
            'Frente al parque'
        ) ON CONFLICT DO NOTHING;
        
        RAISE NOTICE 'Usuario de prueba creado con ID: %', usuario_id;
    END;
END $$;

-- 6. Verificar que se insertó correctamente
SELECT 
    u.id,
    u.nombre,
    u.apellido_paterno,
    u.email,
    d.calle,
    d.colonia,
    d.ciudad
FROM usuarios u
LEFT JOIN direcciones d ON u.id = d.usuario_id
WHERE u.email = 'jaime.garcia@email.com'; 