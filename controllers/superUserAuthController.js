import { loginSuperUser } from "../services/superUserAuthServices.js";

export async function loginSuperUserController(req, res) {
    try {
        const { userName, password } = req.body;
        
        // Validar que se hayan proporcionado los campos necesarios
        if (!userName || !password) {
            return res.status(400).json({
                message: "El nombre de usuario y la contraseña son obligatorios"
            });
        }
        
        // Intentar hacer login
        const loginResult = await loginSuperUser(userName, password);
        
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