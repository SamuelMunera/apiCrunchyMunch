import IceCream from "../models/iceCream.js";

// Crear helado
export const createHelado = async (req, res) => {
    try {
        const newHelado = new IceCream(req.body);
        await newHelado.save();
        res.status(201).json(newHelado);
    } catch (error) {
        res.status(400).json({ message: "Error al crear el helado", error });
    }
};

// Eliminar helado
// Eliminar helado por nombre
export const deleteHelado = async (req, res) => {
    const { name } = req.params;

    try {
        const deleted = await IceCream.findOneAndDelete({ name }); // ✅ correcto

        if (!deleted) {
            return res.status(404).json({ message: "Helado no encontrado" });
        }

        res.json({ message: `Helado '${name}' eliminado correctamente` });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el helado", error });
    }
};


// Obtener helado por ID
export const getIceCreamById = async (req, res) => {
    const { id } = req.params;

    try {
        const foundIceCream = await IceCream.findById(id);

        if (!foundIceCream) {
            return res.status(404).json({ message: "Helado no encontrado" });
        }

        res.status(200).json(foundIceCream);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el helado", error });
    }
};
export const getAllIceCreams = async (req, res) => {
    try {
        const helados = await IceCream.find();
        res.status(200).json(helados);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los helados", error });
    }
};
