import SuperUser from "../models/superUser.js";
import { getAllSuperUsers, createNewSuperUser, deleteSuperUser, getByIdSuperUser, updateSuperUser }  from "../services/superUserServices.js";
 
export async function getSuperUser(req, res) {
  try {
    const superUser = await getAllSuperUsers();
    res.status(200).json(superUser); // Aquí se devuelve el array correcto
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function createSuperUsers(req, res) {
    try {
      const { userName, password } = req.body;
  
      if (!userName || !password ) {
        return res
          .status(400)
          .json({ message: "Todos los campos son obligatorios" });
      }
  
      const newSuperUser = await createNewSuperUser({ userName, password });
      return res.status(201).json(newSuperUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }
  

export async function editSuperUser(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Buscar el usuario
    const superUserToUpdate = await SuperUser.findById(id);
    if (!superUserToUpdate) {
      return res.status(404).json({ message: "La categoria no existe" });
    }

    // Llamar al servicio para actualizar el usuario
    const updatedSuperUser = await updateSuperUser(superUserToUpdate, updateData);

    return res.status(200).json(updatedSuperUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

export async function removeSuperUser(req, res) {
  const { id } = req.params; // Esto es correcto

  try {
    // Pasa el ID correctamente al servicio de eliminación
    const superUserEliminado = await deleteSuperUser(id);

    // Verifica que el usuario haya sido eliminado
    if (!superUserEliminado) {
      return res.status(404).json({ message: "usuario no encontrado" });
    }

    // Responde con éxito
    return res
      .status(200)
      .json({ message: "usuario eliminado", user: superUserEliminado });
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
