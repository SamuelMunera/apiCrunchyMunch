import User from "../models/Users.js";

export async function getAllUsers() {
    try {
        return await User.find();
    } catch (error) {
        throw new Error("Error al obtener los usuarios: " + error.message);
    }
}

export async function createNewUser(data) {
    try {
        const { email, name, lastName, password, phone } = data;

        const verifyUser = await User.findOne({ email });
        if (verifyUser) {
            throw new Error("El usuario ya existe");
        }

        const newUser = new User({ email, name, lastName, password, phone });
        await newUser.save();

        return newUser;
    } catch (error) {
        console.error(error);
        throw new Error(`Error al crear el usuario: ${error.message}`);
    }
}




export async function deleteUser(UserId) {
    try {
        // Buscar el usuario por su ID
        const user = await User.findById(UserId);

        if (!user) {
            // Si no existe el usuario, lanzar error
            throw new Error("el usuario no existe");
        }

        // Realizar el soft delete (marcar como eliminada, sin eliminar realmente)
        user.deletedAt = new Date();
        await user.save();

        // Retorna el usuario eliminado (soft delete)
        return user;
    } catch (error) {
        console.error(error);
        throw new Error(`Error al eliminar el usuario: ${error.message}`);
    }
}

export async function getByIdUser(UserId) {
    try {
        return await Category.findById(UserId);
    } catch (error) {
        throw new Error("Error al obtener el usuario: " + error.message);
    }
}
export async function updateUser(UserId, data) {
    try {
        // Buscar el usuario por su ID
        const user = await User.findById(UserId);

        if (!user) {
            throw new Error("El usuario no existe");
        }

        // Actualizar los campos permitidos
        const { email, name, lastName, password, phone } = data;
        if (email) user.email = email;
        if (name) user.name = name;
        if (lastName) user.lastName = lastName;
        if (password) user.password = password;
        if (phone) user.phone = phone;

        // Guardar los cambios
        await user.save();

        return user;
    } catch (error) {
        console.error(error);
        throw new Error(`Error al actualizar el usuario: ${error.message}`);
    }
}
