import mongoose from "mongoose";

const iceCreamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "El nombre del helado es requerido"],
    }
});

const iceCream = mongoose.model("iceCream", iceCreamSchema);
export default iceCream;
