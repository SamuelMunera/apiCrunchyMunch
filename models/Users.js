import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "El email del Usuario es requerido"],
    },
    name: {
      type: String,
      required: [true, "El nombre del Usuario es requerido"],
    },
    lastName: {  // Se corrige aquí
      type: String,
      required: [true, "El apellido del Usuario es requerido"],
    },
    password: {
      type: String,
      required: [true, "La Contraseña del Usuario es requerida"],
    },
    phone: {
      type: Number,
      required: [true, "El teléfono del Usuario es requerido"],
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

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  
  const passwordHash = await bcrypt.hash(this.password, 10);
  this.password = passwordHash;
  
  next();
});

const User = mongoose.model("User", userSchema);
export default User;

