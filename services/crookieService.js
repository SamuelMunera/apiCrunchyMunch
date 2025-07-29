import Crookies from "../models/crookies.js";

export async function getAllCrookies() {
    try {
        return await Crookies.find();
    } catch (error) {
        throw new Error("Error al obtener las crookies: " + error.message);
    }
}

export async function createNewCrookie(data) {
    try {
        const { name, photo, description, recommendation, price } = data;

        const verifyCrookie = await Crookies.findOne({ name });
        if (verifyCrookie) {
            throw new Error("La crookie ya existe");
        }

        const newCrookie = new Crookies({ name, photo, description, recommendation, price });
        await newCrookie.save();

        return newCrookie;
    } catch (error) {
        console.error(error);
        throw new Error(`Error al crear la crookie: ${error.message}`);
    }
}
export async function updateCrookies(crookieToUpdate, updateData) {
    try {
        const { name, photo, description, recommendation, price } = updateData;

        // Validar que hay al menos un campo para actualizar
        if (!name && !photo && !description && !recommendation && !price) {
            throw new Error("Debe proporcionar al menos un campo para actualizar");
        }

        // Actualizar solo los campos que se envíen en la solicitud
        if (name) crookieToUpdate.name = name;
        if (photo) crookieToUpdate.photo = photo;
        if (description) crookieToUpdate.description = description;
        if (recommendation) crookieToUpdate.recommendation = recommendation;
        if (price) crookieToUpdate.price = price;

        await crookieToUpdate.save();
        return crookieToUpdate;
    } catch (error) {
        console.error(error);
        throw new Error(`Error al actualizar la crookie: ${error.message}`);
    }
}

export async function deleteCrookie(crookieId) {
    try {
        // Buscar la crookie por su ID
        const crookie = await Crookies.findById(crookieId);

        if (!crookie) {
            // Si no existe la crookie, lanzar error
            throw new Error("La crookie no existe");
        }

        // Realizar el soft delete (marcar como eliminada, sin eliminar realmente)
        crookie.deletedAt = new Date();
        await crookie.save();

        // Retorna la crookie eliminada (soft delete)
        return crookie;
    } catch (error) {
        console.error(error);
        throw new Error(`Error al eliminar la crookie: ${error.message}`);
    }
}
