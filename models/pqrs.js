import mongoose from "mongoose";

const pqrsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "El nombre del usuario es requerido"],
    },
    date:{
        type: Date,
        default: Date.now,
    },
    email: {
        type: String,
        required: [true, "El correo del usuario es requerido"],
    },
    phone:{
        type: String,
        required: [true, "El teléfono del usuario es requerido"],
    },
    message: {
        type: String,
        required: [true, "El mensaje del usuario es requerido"],
    },
    deletedAt: {
        type: Date,
        default: null,
    },
});

const Pqrs = mongoose.model("Pqrs", pqrsSchema);
export default Pqrs;