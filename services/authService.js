import User from "../models/Users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// La clave secreta para firmar los JWT - en producción debería estar en variables de entorno
const JWT_SECRET = process.env.JWT_SECRET || "tu_clave_secreta_muy_segura";

export async function login(email, password) {
    try {
        // Buscar el usuario por email
        const user = await User.findOne({ email });
        
        // Si no existe el usuario, lanzar error
        if (!user) {
            throw new Error("Credenciales incorrectas");
        }
        
        // Si el usuario ha sido eliminado (soft delete)
        if (user.deletedAt) {
            throw new Error("La cuenta ha sido desactivada");
        }
        
        // Verificar la contraseña
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        
        if (!isPasswordCorrect) {
            throw new Error("Credenciales incorrectas");
        }
        
        // Crear el token JWT
        const token = jwt.sign(
            { 
                _id: user._id,
                email: user.email,
                name: user.name
            },
            JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION || '2h' }

        );
        
        // Retornar el token y los datos del usuario (sin la contraseña)
        const userWithoutPassword = {
            id: user._id,
            email: user.email,
            name: user.name,
            lastName: user.lastName,
            phone: user.phone
        };
        
        return {
            user: userWithoutPassword,
            token
        };
        
    } catch (error) {
        console.error(error);
        throw new Error(`Error en el login: ${error.message}`);
    }
}



// Servicio para validar token y obtener información del usuario
export const validateTokenService = async (userId) => {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    
    // Devolver información del usuario sin datos sensibles
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      // Otros campos relevantes
    };
  } catch (error) {
    throw new Error(`Error al validar token: ${error.message}`);
  }
};

// Aquí irían otros servicios relacionados con autenticación...