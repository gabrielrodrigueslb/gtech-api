import * as userService from '../services/userService.js';

export async function createUserController(req, res) {
    try {
        const { name, email, password } = req.body;
        const user = await userService.createUser(name, email, password);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function getUsersController(req, res) {
    try {
        const users = await userService.getUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function deleteUserController(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            throw new Error('ID do usuário é obrigatório');
        }
        const deletedUser = await userService.deleteUser(id);
        res.status(200).json(deletedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
export async function updateUserController(req, res) {
    try {
        const { id } = req.params;
        const { name, email, password } = req.body;
        if (!id) {
            throw new Error('ID do usuário é obrigatório');
        }
        const updatedUser = await userService.updateUser(id, name, email, password);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }   
}