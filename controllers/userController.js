import User from "../models/User.js";

export const getUsers = async (req, res) => {
    try{
        const users = await User.findAll();
        res.status(200).json({ status: 'success', data: users });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error.message });
    }
}

export const createUser = async (req, res) => {
    try{
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            age: req.body.age,
            country: req.body.country ?? null
        });
        res.status(201).json({ status: 'success', data: user });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error.message });
    }
}