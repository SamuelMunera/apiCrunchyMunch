import mongoose from "mongoose";
import "dotenv/config";

const mongoUri = process.env.DB_URI;

const connectDatabase = async () => {
    try {
        // Verificar que la URI existe
        if (!mongoUri) {
            throw new Error('DB_URI no está definida en las variables de entorno');
        }

        // Opciones de conexión recomendadas para producción
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Timeout después de 5s
            socketTimeoutMS: 45000, // Cerrar sockets después de 45s de inactividad
            family: 4 // Usar IPv4, saltar IPv6
        };

        await mongoose.connect(mongoUri, options);
        console.log('✅ Database connected successfully');
        
        // Manejo de eventos de conexión
        mongoose.connection.on('error', (error) => {
            console.error('❌ Database connection error:', error);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('⚠️  Database disconnected');
        });

        // Manejo de cierre graceful
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('💻 Database connection closed due to app termination');
            process.exit(0);
        });

    } catch (error) {
        console.error('❌ Error connecting to database:', error.message);
        process.exit(1); // Terminar la aplicación si no puede conectar
    }
};

export default connectDatabase;