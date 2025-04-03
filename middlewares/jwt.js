import jwt from "jsonwebtoken";

// La clave secreta para verificar los JWT - en producción debería estar en variables de entorno
const JWT_SECRET = process.env.JWT_SECRET || "tu_clave_secreta_muy_segura";

/**
 * Middleware para verificar la autenticación mediante JWT
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 * @param {Function} next - Función para continuar con el siguiente middleware
 */
export function verifyToken(req, res, next) {
    try {
        // Obtener el token del header de autorización
        const authHeader = req.headers.authorization;
        
        // Verificar si el header existe y tiene el formato correcto
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                message: "Acceso denegado. Token no proporcionado o formato inválido" 
            });
        }
        
        // Extraer el token (eliminar 'Bearer ' del string)
        const token = authHeader.split(' ')[1];
        
        // Verificar y decodificar el token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Añadir la información del usuario decodificada al objeto request
        req.user = decoded;
        
        // Continuar con el siguiente middleware o controlador
        next();
    } catch (error) {
        console.error("Error de autenticación:", error.message);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expirado. Por favor, inicie sesión nuevamente" });
        }
        
        return res.status(401).json({ message: "Token inválido" });
    }
}

/**
 * Middleware para verificar roles de usuario (opcional)
 * @param {Array} allowedRoles - Roles permitidos para acceder a la ruta
 */
export function checkRole(allowedRoles) {
    return (req, res, next) => {
        try {
            // Verificar que el usuario esté autenticado
            if (!req.user) {
                return res.status(401).json({ message: "Usuario no autenticado" });
            }
            
            // Verificar si el usuario tiene alguno de los roles permitidos
            const userRole = req.user.role; // Asegúrate de incluir el rol en el token JWT
            
            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json({ 
                    message: "Acceso denegado. No tiene permisos suficientes" 
                });
            }
            
            // Si tiene los permisos necesarios, continuar
            next();
        } catch (error) {
            console.error("Error al verificar rol:", error.message);
            return res.status(500).json({ message: "Error al verificar permisos" });
        }
    };
}