import multer from "multer";
import path, { dirname, join } from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Obtener __dirname en ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Verificar que la carpeta 'uploads' existe
const uploadDir = join(__dirname, "../public/uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de almacenamiento
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, uploadDir);
    },
    filename: (req, file, callback) => {
        callback(null, `${Date.now()}-${file.originalname}`);
    }
});

// Filtro de archivos (solo imágenes)
const fileFilter = (req, file, callback) => {
    console.log("Archivo recibido:", file); // Depuración
    if (!file.mimetype.startsWith("image/")) {
        return callback(new Error("No es un archivo de imagen"), false);
    }
    callback(null, true);
};

// Configuración de multer
const upload = multer({
    storage,
    fileFilter
});

export default upload;
