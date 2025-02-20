import Crookies from "../models/crookies.js"
import { getAllCrookies, createNewCrookie, updateCrookies, deleteCrookie } from '../services/crookieService.js';
import upload from '../config/multer.js';

export async function getCrookies(req, res) {
    try {
        const crookies = await getAllCrookies();
        res.status(200).json(crookies); // Aquí se devuelve el array correcto
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function createCrookie(req, res) {
    try {
        const { name, description, recommendation, price    } = req.body;
        // Extraer la imagen desde req.file
        const photo = req.file ? `/uploads/${req.file.filename}` : null;

        // Validación de campos
        if (!name || !photo || !description || !recommendation || !price) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        const newCrookie = await createNewCrookie({ name, photo, description, recommendation, price});
        return res.status(201).json(newCrookie);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

export async function editCrookie(req, res) {
  try {
      const { id } = req.params;
      const updateData = req.body;

      // Buscar la crookie
      const crookieToUpdate = await Crookies.findById(id);
      if (!crookieToUpdate) {
          return res.status(404).json({ message: "La crookie no existe" });
      }

      // Llamar al servicio para actualizar la crookie
      const updatedCrookie = await updateCrookies(crookieToUpdate, updateData);

      return res.status(200).json(updatedCrookie);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
  }
}

export async function removeCrookie(req, res) {
  const { id } = req.params; // Esto es correcto

  try {
      // Pasa el ID correctamente al servicio de eliminación
      const crookieEliminada = await deleteCrookie(id); 

      // Verifica que la crookie haya sido eliminada
      if (!crookieEliminada) {
          return res.status(404).json({ message: "Crookie no encontrada" });
      }

      // Responde con éxito
      return res.status(200).json({ message: "Crookie eliminada", crookie: crookieEliminada });
  } catch (error) {
      // Captura y responde con el error
      return res.status(500).json({ message: "Error al eliminar la crookie", error: error.message });
  }
}