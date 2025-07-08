import mongoose from "mongoose";
import { getAllProduct, createNewProduct, updateProduct, deleteProduct } from '../services/productServices.js';
import upload from '../config/multer.js';
import Product from "../models/product.js";
import iceCream from "../models/iceCream.js";

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
        const { 
            name, 
            description, 
            recommendation, 
            price, 
            category,
            toppings = [], // Recibir toppings del body
            iceCream = []  // Recibir iceCream del body
        } = req.body;
        
        const photo = req.file ? req.file.location : null;


        // Validar que category sea un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(category)) {
            return res.status(400).json({ message: "ID de categoría inválido" });
        }

        // Convertir los toppings e iceCream a arrays de ObjectId si no lo son ya
        const toppingsArray = Array.isArray(toppings) 
            ? toppings.map(id => mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null).filter(id => id !== null)
            : typeof toppings === 'string' && mongoose.Types.ObjectId.isValid(toppings) 
                ? [new mongoose.Types.ObjectId(toppings)] 
                : [];
                
        const iceCreamArray = Array.isArray(iceCream) 
            ? iceCream.map(id => mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null).filter(id => id !== null)
            : typeof iceCream === 'string' && mongoose.Types.ObjectId.isValid(iceCream) 
                ? [new mongoose.Types.ObjectId(iceCream)] 
                : [];

        console.log("Creando producto con toppings:", toppingsArray);
        console.log("Creando producto con iceCream:", iceCreamArray);

        const newProduct = await createNewProduct({
            name,
            photo,
            description,
            recommendation,
            price,
            category: new mongoose.Types.ObjectId(category),
            toppings: toppingsArray,
            iceCream: iceCreamArray
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
export const getProductToppings = async (req, res) => {
    const { name } = req.params;

    try {
        const product = await Product.findOne({ name }).populate("toppings");

        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.json(product.toppings);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener toppings", error });
    }
};


export const assignToppingsToProduct = async (req, res) => {
    const { id } = req.params;
    const { toppings } = req.body;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { toppings },
            { new: true }
        ).populate("toppings");

        if (!updatedProduct) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: "Error al asignar toppings", error });
    }
};

export const assignHeladosToProduct = async (req, res) => {
    const { id } = req.params;
    const { iceCream } = req.body;
  
    try {
      // 1. Primero actualizas
      await Product.findByIdAndUpdate(id, { iceCream });
  
      // 2. Luego consultas y haces populate
      const updatedProduct = await Product.findById(id).populate("iceCream");
  
      if (!updatedProduct) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }
  
      res.status(200).json(updatedProduct);
    } catch (error) {
      res.status(500).json({ message: "Error al asignar helados", error });
    }
  };
  
export const getProductIceCream = async (req, res) => {
    const { name } = req.params;

    try {
        const product = await Product.findOne({ name }).populate("iceCream");

        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.json(product.iceCream);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener helados", error });
    }
};
