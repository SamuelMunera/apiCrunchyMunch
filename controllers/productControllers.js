import mongoose from "mongoose";
import { getAllProduct, createNewProduct, updateProduct, deleteProduct } from '../services/productServices.js';
import upload from '../config/multer.js';
import Product from "../models/product.js";

export async function getProducts(req, res) {
    try {
        const product = await getAllProduct();
        res.status(200).json(product); // Aquí se devuelve el array correcto
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


    export async function createProduct(req, res) {
        try {
            const { name, description, recommendation, price, category } = req.body;
            const photo = req.file ? `/uploads/${req.file.filename}` : null;
    
            // Validar que category sea un ObjectId válido
            if (!mongoose.Types.ObjectId.isValid(category)) {
                return res.status(400).json({ message: "ID de categoría inválido" });
            }
    
            const newProduct = await createNewProduct({
                name,
                photo,
                description,
                recommendation,
                price,
                category: new mongoose.Types.ObjectId(category) // Convertir a ObjectId
            });
    
            return res.status(201).json(newProduct);
        } catch (error) {
            console.error("Error al crear el producto:", error);
            res.status(500).json({ message: "Error interno del servidor", error: error.message });
        }
    }

export async function updatedProduct(req, res) {
  try {
      const { id } = req.params;
      const updateData = req.body;

      // Buscar la crookie
      const productToUpdate = await Product.findById(id);
      if (!productToUpdate) {
          return res.status(404).json({ message: "el producto no existe" });
      }

      // Llamar al servicio para actualizar la crookie
      const updatedProduct = await updateProduct(productToUpdate, updateData);

      return res.status(200).json(updatedProduct);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
  }
}

export async function removeProduct(req, res) {
  const { id } = req.params; // Esto es correcto

  try {
      // Pasa el ID correctamente al servicio de eliminación
      const productEliminado = await deleteProduct(id); 

      // Verifica que la crookie haya sido eliminada
      if (!productEliminado) {
          return res.status(404).json({ message: "Producto no encontrado" });
      }

      // Responde con éxito
      return res.status(200).json({ message: "Crookie eliminada", product: productEliminado });
  } catch (error) {
      // Captura y responde con el error
      return res.status(500).json({ message: "Error al eliminar el producto", error: error.message });
  }
}
export async function getProductById(req, res) {
    const { id } = req.params;

    try {
        const product = await getByIdProduct(id);
        return res.status(200).json(product);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}