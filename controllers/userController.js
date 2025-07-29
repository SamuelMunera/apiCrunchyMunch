import User from "../models/Users.js";
import {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
} from "../services/userService.js";

export async function getUser(req, res) {
  try {
    const category = await getAllUsers();
    res.status(200).json(category); // Aquí se devuelve el array correcto
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function createUsers(req, res) {
    try {
      const { email, name, lastName, password, phone } = req.body;
  
      if (!email || !name || !lastName || !password || !phone) {
        return res
          .status(400)
          .json({ message: "Todos los campos son obligatorios" });
      }
  
      const newUser = await createNewUser({ email, name, lastName, password, phone });
      return res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }
  

export async function editUser(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Buscar el usuario
    const userToUpdate = await User.findById(id);
    if (!userToUpdate) {
      return res.status(404).json({ message: "La categoria no existe" });
    }

    // Llamar al servicio para actualizar el usuario
    const updatedUser = await updateUser(userToUpdate, updateData);

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

export async function removeUser(req, res) {
  const { id } = req.params; // Esto es correcto

  try {
    // Pasa el ID correctamente al servicio de eliminación
    const usuarioEliminado = await deleteUser(id);

    // Verifica que el usuario haya sido eliminado
    if (!usuarioEliminado) {
      return res.status(404).json({ message: "usuario no encontrado" });
    }

    // Responde con éxito
    return res
      .status(200)
      .json({ message: "usuario eliminado", user: usuarioEliminado });
  } catch (error) {
    // Captura y responde con el error
    return res
      .status(500)
      .json({
        message: "Error al eliminar el usuario",
        error: error.message,
      });
  }
}
