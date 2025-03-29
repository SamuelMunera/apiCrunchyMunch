import Category from "../models/category.js";

export async function getAllCategory() {
    try {
        return await Category.find();
    } catch (error) {
        throw new Error("Error al obtener las categorias: " + error.message);
    }
}

export async function createNewCategory(data) {
    try {
        const { name } = data;

        const verifyCategory = await Category.findOne({ name });
        if (verifyCategory) {
            throw new Error("la categoria ya existe");
        }

        const newCategory = new Category({name});
        await newCategory.save();

        return newCategory; 
    } catch (error) {
        console.error(error);
        throw new Error(`Error al crear la categoria: ${error.message}`);
    }
}

export async function updateCategory(categoryToUpdate, updateData) {
    try {
        const { name } = updateData;

        // Validar que hay al menos un campo para actualizar
        if (!name ) {
            throw new Error("Debe proporcionar al menos un campo para actualizar");
        }

        // Actualizar solo los campos que se envíen en la solicitud
        if (name) categoryToUpdate.name = name;
       
        await categoryToUpdate.save();
        return categoryToUpdate;
    } catch (error) {
        console.error(error);
        throw new Error(`Error al actualizar la categoria: ${error.message}`);
    }
}

export async function deleteCategory(categoryId) {
    try {
        // Buscar el producto por su ID
        const category = await Category.findById(categoryId);

        if (!category) {
            // Si no existe el producto, lanzar error
            throw new Error("producto no existe");
        }

        // Realizar el soft delete (marcar como eliminada, sin eliminar realmente)
        category.deletedAt = new Date();
        await category.save();

        // Retorna el producto eliminado (soft delete)
        return category;
    } catch (error) {
        console.error(error);
        throw new Error(`Error al eliminar el producto: ${error.message}`);
    }
}

export async function getByIdCategory(productId) {
    try {
        return await Category.findById(productId);
    } catch (error) {
        throw new Error("Error al obtener la categoria: " + error.message);
    }
}