import { Student, Subject, StudentSubjectPivot } from "../models/index.js";
import bcrypt from "bcrypt";
import { transformStudent } from "../transformationObject.js";
import sequelize from "../config.js";

export const getStudents = async (req, res) => {
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    try{
        const students = await Student.findAll({
            include: { model: Subject },
            limit: limit,
            offset: (page - 1) * limit
        });
        const transformedStudents = await Promise.all(
            students.map(async student => await transformStudent(student))
        );
        res.status(200).json({ page: page, status: 'success', data: transformedStudents });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error.message });
    }
}

export const createStudent = async (req, res) => {
    const transaction = await sequelize.transaction();
    try{
        const student = await Student.create({
            name: req.body.name,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 10),
            age: req.body.age,
            country: req.body.country ?? null,
        }, { transaction });

        const subjectsData = req.body.subjects.map(subject => ({
            studentId: student.id,
            subjectId: subject.id
        }));

        await StudentSubjectPivot.bulkCreate(subjectsData, { transaction });
        await transaction.commit();

        const studentWithSubjects = await Student.findOne({
            where: { id: student.id },
            include: { model: Subject }
        });
        res.status(201).json({ status: 'success', data: await transformStudent(studentWithSubjects) });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ status: 'fail', message: error.message });
    }
}

export const updateStudent = async (req, res) => {
    const transaction = await sequelize.transaction();
    try{
        const updatedData = {};
        const student = await Student.findByPk(req.params.id);
        if(!student) throw new Error("Student not found");

        if (req.body.name !== undefined) updatedData.name = req.body.name;
        if (req.body.email !== undefined) updatedData.email = req.body.email;
        if (req.body.password !== undefined) updatedData.password = await bcrypt.hash(req.body.password, 10);
        if (req.body.age !== undefined) updatedData.age = req.body.age;
        if (req.body.country !== undefined) updatedData.country = req.body.country;
        if (req.body.subjects !== undefined) {
            await StudentSubjectPivot.destroy({ where: { studentId: req.params.id } }, { transaction });
            const subjectsData = req.body.subjects.map(subject => ({
                studentId: req.params.id,
                subjectId: subject.id
            }));
            await StudentSubjectPivot.bulkCreate(subjectsData, { transaction });
        }

        const updatedStudent = await student.update(updatedData, { transaction });
        await transaction.commit();

        const studentWithSubjects = await Student.findOne({
            where: { id: updatedStudent.id },
            include: { model: Subject }
        });
        res.status(200).json({ status: 'success', data: await transformStudent(studentWithSubjects) });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ status: 'fail', message: error.message });
    }
}

export const deleteStudent = async (req, res) => {
    try{
        const student = await Student.findByPk(req.params.id);
        if(!student) throw new Error("Student not found.");
        await student.destroy();
        res.status(200).json({ status: 'success', data: 'Student deleted successfully' });
    } catch (error) {
        if (error.name === "SequelizeForeignKeyConstraintError"){
            return res.status(400).json({ status: 'fail', message: 'Student has subjects. Cannot delete.' });
        }
        res.status(500).json({ status: 'fail', message: error });
    }
}