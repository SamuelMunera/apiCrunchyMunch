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
                id: user._id,
                email: user.email,
                name: user.name
            },
            JWT_SECRET,
            { expiresIn: '24h' } // El token expira en 24 horas
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

// Middleware para verificar el token JWT
export function verifyToken(req, res, next) {
    try {
        // Obtener el token del header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Acceso denegado. Token no proporcionado" });
        }
        
        // Extraer el token
        const token = authHeader.split(' ')[1];
        
        // Verificar el token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Añadir el usuario al request
        req.user = decoded;
        
        // Continuar
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: "Token inválido o expirado" });
    }
}