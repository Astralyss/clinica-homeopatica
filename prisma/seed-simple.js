const bcrypt = require('bcryptjs');

// Conexión directa a PostgreSQL
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  try {
    // Crear roles
    console.log('📝 Creando roles...');
    
    await pool.query(`
      INSERT INTO roles (nombre, descripcion, fecha_creacion) 
      VALUES ('admin', 'Administrador del sistema', NOW())
      ON CONFLICT (nombre) DO NOTHING;
    `);

    await pool.query(`
      INSERT INTO roles (nombre, descripcion, fecha_creacion) 
      VALUES ('cliente', 'Cliente regular', NOW())
      ON CONFLICT (nombre) DO NOTHING;
    `);

    await pool.query(`
      INSERT INTO roles (nombre, descripcion, fecha_creacion) 
      VALUES ('vendedor', 'Vendedor del sistema', NOW())
      ON CONFLICT (nombre) DO NOTHING;
    `);

    console.log('✅ Roles creados');

    // Obtener IDs de roles
    const adminRol = await pool.query('SELECT id FROM roles WHERE nombre = $1', ['admin']);
    const clienteRol = await pool.query('SELECT id FROM roles WHERE nombre = $1', ['cliente']);

    // Crear administrador por defecto
    console.log('👤 Creando administrador por defecto...');
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    await pool.query(`
      INSERT INTO usuarios (id_usuario, email, password, nombre, apellido_paterno, apellido_materno, telefono, activo, email_verificado, rol_id, fecha_creacion, fecha_actualizacion)
      VALUES ('ADM-001', 'admin@clinica.com', $1, 'Administrador', 'Sistema', '', '555-0000', true, true, $2, NOW(), NOW())
      ON CONFLICT (email) DO NOTHING;
    `, [hashedPassword, adminRol.rows[0].id]);

    console.log('✅ Administrador creado');

    // Crear cliente de prueba
    console.log('👤 Creando cliente de prueba...');
    const clientePassword = await bcrypt.hash('cliente123', 12);
    
    const clienteResult = await pool.query(`
      INSERT INTO usuarios (id_usuario, email, password, nombre, apellido_paterno, apellido_materno, telefono, activo, email_verificado, rol_id, fecha_creacion, fecha_actualizacion)
      VALUES ('CLI-001', 'cliente@test.com', $1, 'Juan', 'Pérez', 'García', '555-1234', true, true, $2, NOW(), NOW())
      ON CONFLICT (email) DO NOTHING
      RETURNING id;
    `, [clientePassword, clienteRol.rows[0].id]);

    console.log('✅ Cliente de prueba creado');

    // Crear dirección de prueba para el cliente
    if (clienteResult.rows.length > 0) {
      console.log('📍 Creando dirección de prueba...');
      await pool.query(`
        INSERT INTO direcciones (usuario_id, tipo, nombre, calle, numero_exterior, colonia, ciudad, estado, codigo_postal, es_principal, activo, fecha_creacion)
        VALUES ($1, 'casa', 'Casa Principal', 'Av. Reforma', '123', 'Centro', 'Ciudad de México', 'CDMX', '06000', true, true, NOW());
      `, [clienteResult.rows[0].id]);

      console.log('✅ Dirección creada');
    }

    console.log('🎉 Seed completado exitosamente!');

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  }); 