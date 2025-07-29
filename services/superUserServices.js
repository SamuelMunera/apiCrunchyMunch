import SuperUser from "../models/superUser.js";

export async function getAllSuperUsers() {
    try {
        return await SuperUser.find();
    } catch (error) {
        throw new Error("Error al obtener los usuarios: " + error.message);
    }
}

export async function createNewSuperUser(data) {
    try {
        const { userName,password } = data;

        const verifyUser = await SuperUser.findOne({ userName });
        if (verifyUser) {
            throw new Error("El usuario ya existe");
        }

        const newSuperUser = new SuperUser({ userName,password });
        await newSuperUser.save();

        return newSuperUser;
    } catch (error) {
        console.error(error);
        throw new Error(`Error al crear el usuario: ${error.message}`);
    }
}




export async function deleteSuperUser(UserId) {
    try {
        // Buscar el usuario por su ID
        const superUser = await SuperUser.findById(UserId);

        if (!superUser) {
            // Si no existe el usuario, lanzar error
            throw new Error("el usuario no existe");
        }

        // Realizar el soft delete (marcar como eliminada, sin eliminar realmente)
        superUser.deletedAt = new Date();
        await superUser.save();

        // Retorna el usuario eliminado (soft delete)
        return superUser;
    } catch (error) {
        console.error(error);
        throw new Error(`Error al eliminar el usuario: ${error.message}`);
    }
}

export async function getByIdSuperUser(SuperUserId) {
    try {
        return await SuperUser.findById(SuperUserId);
    } catch (error) {
        throw new Error("Error al obtener el usuario: " + error.message);
    }
}
export async function updateSuperUser(UserId, data) {
    try {
        // Buscar el usuario por su ID
        const superUser = await SuperUser.findById(UserId);

        if (!superUser) {
            throw new Error("El usuario no existe");
        }

        // Actualizar los campos permitidos
        const { userName,password } = data;
        if (userName) superUser.userName = userName;
        if (password) superUser.password = password;
       

        // Guardar los cambios
        await superUser.save();

        return user;
    } catch (error) {
        console.error(error);
        throw new Error(`Error al actualizar el usuario: ${error.message}`);
    }
}
