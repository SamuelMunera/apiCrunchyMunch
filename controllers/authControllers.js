import { login,validateTokenService  } from "../services/authService.js";


export async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        
        // Validar que se hayan proporcionado los campos necesarios
        if (!email || !password) {
            return res.status(400).json({ 
                message: "El email y la contraseña son obligatorios" 
            });
        }
        
        // Intentar hacer login
        const loginResult = await login(email, password);
        
        // Devolver resultado exitoso
        return res.status(200).json({
            message: "Login exitoso",
            ...loginResult
        });
        
    } catch (error) {
        console.error(error);
        
        // Si es un error de credenciales, devolver 401
        if (error.message.includes("Credenciales incorrectas") || 
            error.message.includes("cuenta ha sido desactivada")) {
            return res.status(401).json({ message: error.message });
        }
        
        // Otros errores
        return res.status(500).json({ message: error.message });
    }
}


// Otros métodos del controlador existentes...

// Método para validar el token
export const validateToken = async (req, res) => {
    try {
      // El middleware verifyToken ya validó el token y añadió req.user
      const user = await validateTokenService(req.user._id);
      
      return res.status(200).json({
        success: true,
        message: 'Token válido',
        user
      });
    } catch (error) {
      console.error('Error en controlador de validación de token:', error);
      
      if (error.message.includes('no encontrado')) {
        return res.status(401).json({
          success: false,
          message: error.message
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Error al validar el token'
      });
    }
  };
  