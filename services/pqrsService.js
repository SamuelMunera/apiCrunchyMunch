import Pqrs from "../models/pqrs.js";

export async function getAllPqrs() {
    try {
        return await Pqrs.find();
    } catch (error) {
        throw new Error("Error al obtener las pqrs: " + error.message);
    }
}

export async function createNewPqrs(data) {
    try {
        const { name, email, phone, message } = data;

        const newPqrs = new Pqrs({ name, email, phone, message });
        await newPqrs.save();

        return newPqrs;
    } catch (error) {
        console.error(error);
        throw new Error(`Error al crear la pqrs: ${error.message}`);
    }
}

export async function deletePqrs(pqrsId) {
    try {
        // Buscar la pqrs por su ID
        const pqrs = await Pqrs.findById(pqrsId);

        if (!pqrs) {
            // Si no existe la pqrs, lanzar error
            throw new Error("La pqrs no existe");
        }

        // Eliminar la pqrs
        await pqrs.save();
        return pqrs;
    } catch (error) {
        console.error(error);
        throw new Error(`Error al eliminar la pqrs: ${error.message}`);
    }
}

export async function getByIdPqrs(pqrsId) {
    try {
        return await Pqrs.findById(pqrsId);
    } catch (error) {
        throw new Error("Error al obtener la pqrs: " + error.message);
    }
}