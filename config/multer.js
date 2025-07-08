import multer from "multer";
import { S3Client } from "@aws-sdk/client-s3";
import multerS3 from "multer-s3";

// Configurar S3 Client
const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION
});



// Configuración de almacenamiento en S3
const storage = multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    acl: 'public-read',
    key: (req, file, callback) => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const key = `uploads/${year}/${month}/${Date.now()}-${file.originalname}`;
        callback(null, key);
    }
});

// Filtro de archivos (solo imágenes)
const fileFilter = (req, file, callback) => {
    console.log("Archivo recibido:", file);
    if (!file.mimetype.startsWith("image/")) {
        return callback(new Error("No es un archivo de imagen"), false);
    }
    callback(null, true);
};

// Configuración de multer
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB límite
    }
});

export default upload;