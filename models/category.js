import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "El nombre de la categoria es requerido"],
    },
    deletedAt: {
        type: Date,
        default: null,
    }
});

const Category = mongoose.model("Category", categorySchema);
export default Category;