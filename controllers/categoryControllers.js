import Category from '../models/category.js';
import { getAllCategory, createNewCategory, updateCategory, deleteCategory } from '../services/categoryService.js';
import upload from '../config/multer.js';

export async function getCategory(req, res) {
    try {
        const category = await getAllCategory();
        res.status(200).json(category); // Aquí se devuelve el array correcto
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function createCategory(req, res) {
    try {
        const { name  } = req.body;
     

      
        if (!name ) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        const newCategory = await createNewCategory({ name });
        return res.status(201).json(newCategory);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

export async function editCategory(req, res) {
  try {
      const { id } = req.params;
      const updateData = req.body;

      // Buscar la cookie
      const categoryToUpdate = await Category.findById(id);
      if (!categoryToUpdate) {
          return res.status(404).json({ message: "La categoria no existe" });
      }

      // Llamar al servicio para actualizar la cookie
      const updatedCategory = await updateCategory(categoryToUpdate, updateData);

      return res.status(200).json(updatedCategory);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
  }
}

export async function removeCategory(req, res) {
  const { id } = req.params; // Esto es correcto

  try {
      // Pasa el ID correctamente al servicio de eliminación
      const categoriaEliminada = await deleteCategory(id); 

      // Verifica que la categoria haya sido eliminada
      if (!categoriaEliminada) {
          return res.status(404).json({ message: "Categoria no encontrada" });
      }

      // Responde con éxito
      return res.status(200).json({ message: "Categoria eliminada", category: categoriaEliminada });
  } catch (error) {
      // Captura y responde con el error
      return res.status(500).json({ message: "Error al eliminar la categoria", error: error.message });
  }
}