import Pqrs from "../models/pqrs.js";


import { getAllPqrs, createNewPqrs, deletePqrs, getByIdPqrs } from '../services/pqrsService.js';

export async function getPqrs(req, res) {
    try {
        const pqrs = await getAllPqrs();
        res.status(200).json(pqrs);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function createPqrs(req, res) {
    try {
        const { name, email, phone, message } = req.body;

        if (!name || !email || !phone || !message) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        const newPqrs = await createNewPqrs({ name, email, phone, message });
        return res.status(201).json(newPqrs);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

export async function removePqrs(req, res) {    
    const { id } = req.params;

    try {
        const pqrsEliminada = await deletePqrs(id);
        return res.status(200).json(pqrsEliminada);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}   

export async function getPqrsById(req, res) {
    const { id } = req.params;

    try {
        const pqrs = await getByIdPqrs(id);
        return res.status(200).json(pqrs);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}