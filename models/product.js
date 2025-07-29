      import mongoose from "mongoose";

      const productSchema = new mongoose.Schema({
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
          type: Number,
          required: [true, "El precio de la cookie es requerido"],
        },
        category: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Category",
          required: [true, "La categoría de la cookie es requerida"],
        },
        toppings: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "topping",
          },
        ],
        iceCream: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "iceCream",
          },
        ],
        deletedAt: {
          type: Date,
          default: null,
        },
      });

      const Product = mongoose.model("product", productSchema);
      export default Product;
