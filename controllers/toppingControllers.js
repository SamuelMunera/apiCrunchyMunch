import Topping from "../models/topping.js";

// Crear un topping
export const createTopping = async (req, res) => {
    try {
        const topping = new Topping(req.body);
        await topping.save();
        res.status(201).json(topping);
    } catch (error) {
        res.status(400).json({ message: "Error al crear el topping", error });
    }
};

export const getAllToppings = async (req, res) => {
    try {
        const toppings = await Topping.find();
        res.status(200).json(toppings);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los toppings", error });
    }
};


// Eliminar un topping
export const deleteTopping = async (req, res) => {
    try {
        const deleted = await Topping.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Topping no encontrado" });
        res.json({ message: "Topping eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el topping", error });
    }
};
export const getToppingById = async (req, res) => {
    const { id } = req.params;

    try {
        const topping = await Topping.findById(id);

        if (!topping) {
            return res.status(404).json({ message: "Topping no encontrado" });
        }

        res.status(200).json(topping);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el topping", error });
    }
};
