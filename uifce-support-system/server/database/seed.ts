import pool from '../src/config/database';
import bcrypt from 'bcryptjs';

async function seedDatabase() {
  console.log('Iniciando migración de datos...');

  try {
    // Limpiar datos existentes (excepto el usuario admin protegido)
    console.log('Limpiando datos existentes...');
    await pool.query('DELETE FROM comentarios');
    await pool.query('DELETE FROM tickets');
    await pool.query('DELETE FROM subcategorias');
    await pool.query('DELETE FROM ubicaciones');
    await pool.query('DELETE FROM usuarios WHERE email != $1', ['uniic_bog@unal.edu.co']);
    console.log('Datos limpiados correctamente');

    // Insertar usuario admin bloqueado (no se puede eliminar)
    console.log('Insertando usuario admin bloqueado...');
    const adminPassword = await bcrypt.hash('Admin123!', 10);
    
    await pool.query(
      `INSERT INTO usuarios (email, password, nombre, rol, activo) 
       VALUES ($1, $2, $3, $4, $5) 
       ON CONFLICT (email) DO UPDATE SET 
         password = EXCLUDED.password,
         nombre = EXCLUDED.nombre,
         rol = EXCLUDED.rol,
         activo = EXCLUDED.activo`,
      ['uniic_bog@unal.edu.co', adminPassword, 'Administrador UIFCE', 'admin', false]
    );
    console.log('Usuario admin bloqueado insertado correctamente');

    console.log('Migración completada exitosamente');
    console.log('Usuario admin: uniic_bog@unal.edu.co / Admin123! (bloqueado)');
  } catch (error) {
    console.error('Error durante la migración:', error);
    process.exit(1);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

seedDatabase();
