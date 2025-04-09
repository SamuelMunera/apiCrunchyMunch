import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const superUserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "El email del Usuario es requerido"],
    },
    password: {
      type: String,
      required: [true, "El nombre del Usuario es requerido"],
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware para encriptar la contraseña antes de guardar
superUserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ✅ Verifica si el modelo ya existe en Mongoose antes de crearlo
const SuperUser = mongoose.models.SuperUser || mongoose.model("SuperUser", superUserSchema);

export default SuperUser;