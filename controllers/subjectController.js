import sequelize from "../config.js";
import Subject from "../models/Subject.js";
import { transformSubject } from "../transformationObject.js";

export const getSubjects = async (req, res) => {
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    try{
        const subjects = await Subject.findAll({
            limit: limit,
            offset: (page - 1) * limit
        });
        const transformedSubjects = await Promise.all(
            subjects.map(async subject => await transformSubject(subject))
        );
        res.status(200).json({ page: page, status: 'success', data: transformedSubjects });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error.message });
    }
}

export const createSubject = async (req, res) => {
    try{
        const subject = await Subject.create({
            name: req.body.name,
            description: req.body.description ?? null
        });
        res.status(201).json({ status: 'success', data: await transformSubject(subject) });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error.message });
    }
}

export const updateSubject = async (req, res) => {
    const transaction = await sequelize.transaction();
    try{
        const updatedData = {};
        const subject = await Subject.findByPk(req.params.id);
        if(!subject) throw new Error("Subject not found.");

        if (req.body.name !== undefined) updatedData.name = req.body.name;
        if (req.body.description !== undefined) updatedData.description = req.body.description;

        const updatedSubject = await subject.update(updatedData, { transaction });
        await transaction.commit();

        res.status(200).json({ status: 'success', data: await transformSubject(updatedSubject) });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ status: 'fail', message: error.message });
    }
}


export const deleteSubject = async (req, res) => {
    try{
        const subject = await Subject.findByPk(req.params.id);
        if(!subject) throw new Error("Subject not found.");
        await subject.destroy();
        res.status(200).json({ status: 'success', data: 'Subject deleted successfully' });
    } catch (error) {
        if(error.name === 'SequelizeForeignKeyConstraintError'){
            return res.status(400).json({ status: 'fail', message: 'Subject has students. Cannot delete.' });
        }
        res.status(500).json({ status: 'fail', message: error.message });
    }
}