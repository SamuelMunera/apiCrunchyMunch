import mongoose from "mongoose";

const crookieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "El nombre de la cookie es requerido"],
    },
    photo: {
        type: String,
        required: [true, "La foto de la cookie es requerida"],
    },
    description: {
        type: String,
        required: [true, "La descripción de la cookie es requerida"],
    },
    recommendation: {
        type: String,
        required: [true, "La recomendación de la cookie es requerida"],
    },
    price: {
        type: Number, // Cambio de String a Number
        required: [true, "El precio de la cookie es requerido"],
    },
    deletedAt: {
        type: Date,
        default: null,
    },
});

const Crookies = mongoose.model("Crookie", crookieSchema);
export default Crookies;
