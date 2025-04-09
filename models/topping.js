import mongoose from "mongoose";

const toppingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "El nombre del topping es requerido"],
  },
});

const Topping = mongoose.model("topping", toppingSchema);
export default Topping;
