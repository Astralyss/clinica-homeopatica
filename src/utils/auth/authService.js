import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'tu-secreto-jwt-super-seguro';

export class AuthService {
  /**
   * Registrar un nuevo usuario
   */
  static async registrarUsuario(userData) {
    try {
      const { email, password, nombre, apellidoPaterno, apellidoMaterno, telefono } = userData;

      // Verificar si el email ya existe
      const usuarioExistente = await prisma.usuario.findUnique({
        where: { email }
      });

      if (usuarioExistente) {
        throw new Error('El email ya está registrado');
      }

      // Hashear la contraseña
      const hashedPassword = await bcrypt.hash(password, 12);

      // Generar ID único de usuario
      const idUsuario = `CLI-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Crear usuario (rol cliente por defecto)
      const nuevoUsuario = await prisma.usuario.create({
        data: {
          id_usuario: idUsuario,
          email,
          password: hashedPassword,
          nombre,
          apellidoPaterno,
          apellidoMaterno,
          telefono,
          rolId: 2, // Cliente por defecto
          activo: true,
          emailVerificado: false
        },
        include: {
          rol: true
        }
      });

      // Generar token JWT
      const token = jwt.sign(
        { 
          userId: nuevoUsuario.id, 
          email: nuevoUsuario.email,
          rol: nuevoUsuario.rol.nombre 
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return {
        success: true,
        usuario: {
          id: nuevoUsuario.id,
          id_usuario: nuevoUsuario.id_usuario,
          email: nuevoUsuario.email,
          nombre: nuevoUsuario.nombre,
          apellidoPaterno: nuevoUsuario.apellidoPaterno,
          apellidoMaterno: nuevoUsuario.apellidoMaterno,
          rol: nuevoUsuario.rol.nombre
        },
        token
      };

    } catch (error) {
      console.error('Error en registro:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Iniciar sesión
   */
  static async iniciarSesion(email, password) {
    try {
      // Buscar usuario por email
      const usuario = await prisma.usuario.findUnique({
        where: { email },
        include: {
          rol: true
        }
      });

      if (!usuario) {
        throw new Error('Credenciales inválidas');
      }

      if (!usuario.activo) {
        throw new Error('Cuenta desactivada');
      }

      // Verificar contraseña
      const passwordValida = await bcrypt.compare(password, usuario.password);
      if (!passwordValida) {
        throw new Error('Credenciales inválidas');
      }

      // Actualizar último acceso
      await prisma.usuario.update({
        where: { id: usuario.id },
        data: { ultimoAcceso: new Date() }
      });

      // Generar token JWT
      const token = jwt.sign(
        { 
          userId: usuario.id, 
          email: usuario.email,
          rol: usuario.rol.nombre 
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return {
        success: true,
        usuario: {
          id: usuario.id,
          id_usuario: usuario.id_usuario,
          email: usuario.email,
          nombre: usuario.nombre,
          apellidoPaterno: usuario.apellidoPaterno,
          apellidoMaterno: usuario.apellidoMaterno,
          rol: usuario.rol.nombre
        },
        token
      };

    } catch (error) {
      console.error('Error en login:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Verificar token JWT
   */
  static async verificarToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Buscar usuario en la base de datos
      const usuario = await prisma.usuario.findUnique({
        where: { id: decoded.userId },
        include: {
          rol: true
        }
      });

      if (!usuario || !usuario.activo) {
        throw new Error('Usuario no encontrado o inactivo');
      }

      return {
        success: true,
        usuario: {
          id: usuario.id,
          id_usuario: usuario.id_usuario,
          email: usuario.email,
          nombre: usuario.nombre,
          apellidoPaterno: usuario.apellidoPaterno,
          apellidoMaterno: usuario.apellidoMaterno,
          rol: usuario.rol.nombre
        }
      };

    } catch (error) {
      console.error('Error verificando token:', error);
      return {
        success: false,
        error: 'Token inválido'
      };
    }
  }

  /**
   * Obtener usuario por ID
   */
  static async obtenerUsuarioPorId(userId) {
    try {
      const usuario = await prisma.usuario.findUnique({
        where: { id: userId },
        include: {
          rol: true,
          direcciones: {
            where: { activo: true }
          }
        }
      });

      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      return {
        success: true,
        usuario: {
          id: usuario.id,
          id_usuario: usuario.id_usuario,
          email: usuario.email,
          nombre: usuario.nombre,
          apellidoPaterno: usuario.apellidoPaterno,
          apellidoMaterno: usuario.apellidoMaterno,
          telefono: usuario.telefono,
          rol: usuario.rol.nombre,
          direcciones: usuario.direcciones
        }
      };

    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Verificar si es administrador
   */
  static async esAdmin(userId) {
    try {
      const usuario = await prisma.usuario.findUnique({
        where: { id: userId },
        include: { rol: true }
      });

      return usuario?.rol?.nombre === 'admin';
    } catch (error) {
      console.error('Error verificando rol admin:', error);
      return false;
    }
  }

  /**
   * Cambiar contraseña
   */
  static async cambiarPassword(userId, passwordActual, passwordNuevo) {
    try {
      const usuario = await prisma.usuario.findUnique({
        where: { id: userId }
      });

      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      // Verificar contraseña actual
      const passwordValida = await bcrypt.compare(passwordActual, usuario.password);
      if (!passwordValida) {
        throw new Error('Contraseña actual incorrecta');
      }

      // Hashear nueva contraseña
      const hashedPassword = await bcrypt.hash(passwordNuevo, 12);

      // Actualizar contraseña
      await prisma.usuario.update({
        where: { id: userId },
        data: { password: hashedPassword }
      });

      return { success: true };

    } catch (error) {
      console.error('Error cambiando password:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
} 