import SuperUser from "../models/superUser.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// La clave secreta para firmar los JWT - usando la misma que para usuarios normales
const JWT_SECRET = process.env.JWT_SECRET || "tu_clave_secreta_muy_segura123";

export async function loginSuperUser(userName, password) {
    try {
        // Buscar el super usuario por userName
        const superUser = await SuperUser.findOne({ userName });
        
        // Si no existe el super usuario, lanzar error
        if (!superUser) {
            throw new Error("Credenciales incorrectas");
        }
        
        // Si el usuario ha sido eliminado (soft delete)
        if (superUser.deletedAt) {
            throw new Error("La cuenta ha sido desactivada");
        }
        
        // Verificar la contraseña
        const isPasswordCorrect = await bcrypt.compare(password, superUser.password);
        
        if (!isPasswordCorrect) {
            throw new Error("Credenciales incorrectas");
        }
        
        // Crear el token JWT
        const token = jwt.sign(
            {
                id: superUser._id,
                userName: superUser.userName,
                role: 'superadmin' // Agregamos un rol para identificar que es un superusuario
            },
            JWT_SECRET,
            { expiresIn: '24h' } // El token expira en 24 horas
        );
        
        // Retornar el token y los datos del super usuario (sin la contraseña)
        const superUserWithoutPassword = {
            id: superUser._id,
            userName: superUser.userName,
            role: 'superadmin'
        };
        
        return {
            user: superUserWithoutPassword,
            token
        };
        
    } catch (error) {
        console.error(error);
        throw new Error(`Error en el login de super usuario: ${error.message}`);
    }
}