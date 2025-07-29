import Product from "../models/product.js";

export async function getAllProduct() {
    try {
        // Agregamos populate para toppings e iceCream
        const products = await Product.find({ deletedAt: null })
            .populate('toppings')
            .populate('iceCream');
        return products;
    } catch (error) {
        throw new Error(`Error al obtener productos: ${error.message}`);
    }
}

export async function createNewProduct(data) {
    try {
        const { 
            name, 
            photo, 
            description, 
            recommendation, 
            price, 
            category,
            toppings = [], // Valor por defecto: array vacío
            iceCream = []  // Valor por defecto: array vacío
        } = data;
        
        const verifyProduct = await Product.findOne({ name });
        if (verifyProduct) {
            throw new Error("El producto ya existe");
        }
        
        const newProduct = new Product({ 
            name, 
            photo, 
            description, 
            recommendation, 
            price, 
            category,
            toppings,    // Incluir toppings
            iceCream     // Incluir iceCream
        });
        
        await newProduct.save();
        
        // Opcionalmente popular los campos para devolverlos completos
        const populatedProduct = await Product.findById(newProduct._id)
            .populate('toppings')
            .populate('iceCream')
            .populate('category');
        
        return populatedProduct || newProduct;
    } catch (error) {
        console.error(error);
        
        throw new Error(`Error al crear el producto: ${error.message}`);
    }
}
export async function updateProduct(productToUpdate, updateData) {
    try {
        console.log("Datos recibidos para actualizar:", updateData); // Agregar esto

        const { name, photo, description, recommendation, price } = updateData;

        // Validar que hay al menos un campo para actualizar
        if (!name && !photo && !description && !recommendation && !price) {
            throw new Error("Debe proporcionar al menos un campo para actualizar");
        }

        // Actualizar solo los campos enviados
        if (name) productToUpdate.name = name;
        if (photo) productToUpdate.photo = photo;
        if (description) productToUpdate.description = description;
        if (recommendation) productToUpdate.recommendation = recommendation;
        if (price) productToUpdate.price = price;

        await productToUpdate.save();
        return productToUpdate;
    } catch (error) {
        console.error(error);
        throw new Error(`Error al actualizar el producto: ${error.message}`);
    }
}

export async function deleteProduct(productId) {
    try {
        // Buscar el producto por su ID
        const product = await Product.findById(productId);

        if (!product) {
            // Si no existe el producto, lanzar error
            throw new Error("producto no existe");
        }

        // Realizar el soft delete (marcar como eliminada, sin eliminar realmente)
        product.deletedAt = new Date();
        await product.save();

        // Retorna el producto eliminado (soft delete)
        return product;
    } catch (error) {
        console.error(error);
        throw new Error(`Error al eliminar el producto: ${error.message}`);
    }
}

export async function getByIdProduct(id) {
    try {
        const product = await Product.findById(id)
            .populate('toppings')
            .populate('iceCream');
        
        if (!product) {
            throw new Error('Producto no encontrado');
        }
        
        return product;
    } catch (error) {
        throw new Error(`Error al obtener el producto: ${error.message}`);
    }
}