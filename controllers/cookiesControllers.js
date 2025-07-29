import Cookies from '../models/cookies.js';
import { getAllCookies, createNewCookie, updateCookies, deleteCookie } from '../services/cookieService.js';
import upload from '../config/multer.js';

export async function getCookies(req, res) {
    try {
        const cookies = await getAllCookies();
        res.status(200).json(cookies); // Aquí se devuelve el array correcto
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function createCookie(req, res) {
    try {
        const { name, description, recommendation, price    } = req.body;
        // Extraer la imagen desde req.file
        const photo = req.file ? `/uploads/${req.file.filename}` : null;

        // Validación de campos
        if (!name || !photo || !description || !recommendation || !price) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        const newCookie = await createNewCookie({ name, photo, description, recommendation, price});
        return res.status(201).json(newCookie);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

export async function editCookie(req, res) {
  try {
      const { id } = req.params;
      const updateData = req.body;

      // Buscar la cookie
      const cookieToUpdate = await Cookies.findById(id);
      if (!cookieToUpdate) {
          return res.status(404).json({ message: "La cookie no existe" });
      }

      // Llamar al servicio para actualizar la cookie
      const updatedCookie = await updateCookies(cookieToUpdate, updateData);

      return res.status(200).json(updatedCookie);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
  }
}

export async function removeCookie(req, res) {
  const { id } = req.params; // Esto es correcto

  try {
      // Pasa el ID correctamente al servicio de eliminación
      const cookieEliminada = await deleteCookie(id); 

      // Verifica que la cookie haya sido eliminada
      if (!cookieEliminada) {
          return res.status(404).json({ message: "Cookie no encontrada" });
      }

      // Responde con éxito
      return res.status(200).json({ message: "Cookie eliminada", cookie: cookieEliminada });
  } catch (error) {
      // Captura y responde con el error
      return res.status(500).json({ message: "Error al eliminar la cookie", error: error.message });
  }
}