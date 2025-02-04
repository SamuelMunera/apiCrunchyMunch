import Cookies from "../models/cookies.js";

export async function getAllCookies() {
    try {
        return await Cookies.find();
    } catch (error) {
        throw new Error("Error al obtener las cookies: " + error.message);
    }
}

export async function createNewCookie(data) {
    try {
        const { name, photo, description, recommendation, price } = data;

        const verifyCookie = await Cookies.findOne({ name });
        if (verifyCookie) {
            throw new Error("La cookie ya existe");
        }

        const newCookie = new Cookies({ name, photo, description, recommendation, price });
        await newCookie.save();

        return newCookie;
    } catch (error) {
        console.error(error);
        throw new Error(`Error al crear la cookie: ${error.message}`);
    }
}
export async function updateCookies(cookieToUpdate, updateData) {
    try {
        const { name, photo, description, recommendation, price } = updateData;

        // Validar que hay al menos un campo para actualizar
        if (!name && !photo && !description && !recommendation && !price) {
            throw new Error("Debe proporcionar al menos un campo para actualizar");
        }

        // Actualizar solo los campos que se envíen en la solicitud
        if (name) cookieToUpdate.name = name;
        if (photo) cookieToUpdate.photo = photo;
        if (description) cookieToUpdate.description = description;
        if (recommendation) cookieToUpdate.recommendation = recommendation;
        if (price) cookieToUpdate.price = price;

        await cookieToUpdate.save();
        return cookieToUpdate;
    } catch (error) {
        console.error(error);
        throw new Error(`Error al actualizar la cookie: ${error.message}`);
    }
}

export async function deleteCookie(cookieId) {
    try {
        // Buscar la cookie por su ID
        const cookie = await Cookies.findById(cookieId);

        if (!cookie) {
            // Si no existe la cookie, lanzar error
            throw new Error("La cookie no existe");
        }

        // Realizar el soft delete (marcar como eliminada, sin eliminar realmente)
        cookie.deletedAt = new Date();
        await cookie.save();

        // Retorna la cookie eliminada (soft delete)
        return cookie;
    } catch (error) {
        console.error(error);
        throw new Error(`Error al eliminar la cookie: ${error.message}`);
    }
}
