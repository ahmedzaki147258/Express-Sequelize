import User from "../models/User.js";
import bcrypt from "bcrypt";
import { transformUser } from "../transformationObject.js";

export const getUsers = async (req, res) => {
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    try{
        const users = await User.findAll({
            limit: limit,
            offset: (page - 1) * limit
        });
        const transformedUsers = await Promise.all(
            users.map(async user => await transformUser(user))
        );
        res.status(200).json({ status: 'success', data: transformedUsers });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error.message });
    }
}

export const createUser = async (req, res) => {
    try{
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 10),
            age: req.body.age,
            country: req.body.country ?? null
        });
        res.status(201).json({ status: 'success', data: await transformUser(user) });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error.message });
    }
}