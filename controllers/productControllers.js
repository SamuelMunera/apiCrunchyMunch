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
// ✅ CONTROLADORES CORREGIDOS

export const getProductToppings = async (req, res) => {
    const { id } = req.params;
    
    try {
        // ✅ CORRECCIÓN: Usar findById en lugar de findOne({ id })
        const product = await Product.findById(id).populate("toppings");
        
        if (!product) {
            return res.status(404).json({ 
                message: "Producto no encontrado",
                productId: id 
            });
        }
        
        // ✅ Agregar logs para debugging
        console.log(`✅ Producto encontrado: ${product.name}`);
        console.log(`✅ Toppings encontrados: ${product.toppings.length}`);
        
        res.json(product.toppings);
    } catch (error) {
        console.error('❌ Error en getProductToppings:', error);
        res.status(500).json({ 
            message: "Error al obtener toppings", 
            error: error.message,
            productId: id 
        });
    }
};

export const getProductIceCream = async (req, res) => {
    const { id } = req.params;
    
    try {
        // ✅ CORRECCIÓN: Usar findById en lugar de findOne({ id })
        const product = await Product.findById(id).populate("iceCream");
        
        if (!product) {
            return res.status(404).json({ 
                message: "Producto no encontrado",
                productId: id 
            });
        }
        
        // ✅ Agregar logs para debugging
        console.log(`✅ Producto encontrado: ${product.name}`);
        console.log(`✅ Ice Creams encontrados: ${product.iceCream.length}`);
        
        res.json(product.iceCream);
    } catch (error) {
        console.error('❌ Error en getProductIceCream:', error);
        res.status(500).json({ 
            message: "Error al obtener helados", 
            error: error.message,
            productId: id 
        });
    }
};

export const assignToppingsToProduct = async (req, res) => {
    const { id } = req.params;
    const { toppings } = req.body;
    
    try {
        // ✅ Verificar que el producto existe primero
        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            return res.status(404).json({ 
                message: "Producto no encontrado",
                productId: id 
            });
        }
        
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { toppings },
            { new: true }
        ).populate("toppings");
        
        console.log(`✅ Toppings asignados al producto: ${updatedProduct.name}`);
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('❌ Error en assignToppingsToProduct:', error);
        res.status(500).json({ 
            message: "Error al asignar toppings", 
            error: error.message,
            productId: id 
        });
    }
};

export const assignHeladosToProduct = async (req, res) => {
    const { id } = req.params;
    const { iceCream } = req.body;
    
    try {
        // ✅ Verificar que el producto existe primero
        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            return res.status(404).json({ 
                message: "Producto no encontrado",
                productId: id 
            });
        }
        
        // 1. Actualizar el producto
        await Product.findByIdAndUpdate(id, { iceCream });
        
        // 2. Consultar con populate
        const updatedProduct = await Product.findById(id).populate("iceCream");
        
        console.log(`✅ Ice Creams asignados al producto: ${updatedProduct.name}`);
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('❌ Error en assignHeladosToProduct:', error);
        res.status(500).json({ 
            message: "Error al asignar helados", 
            error: error.message,
            productId: id 
        });
    }
};