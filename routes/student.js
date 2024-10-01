import express from "express";
import { createStudent, deleteStudent, getStudents, updateStudent } from "../controllers/studentController.js";
import { createSubjectValidation, createUserValidation, updateSubjectValidation, updateUserValidation } from "../middlewares/validationMiddlewaresRequest.js";
import { createSubject, deleteSubject, getSubjects, updateSubject } from "../controllers/subjectController.js";
const Router = express.Router();

Router.get("/", getStudents);
Router.post("/", createUserValidation, createStudent);
Router.patch("/:id", updateUserValidation, updateStudent);
Router.delete("/:id", deleteStudent);

Router.get("/subjects", getSubjects);
Router.post("/subjects", createSubjectValidation, createSubject);
Router.patch("/subjects/:id", updateSubjectValidation, updateSubject);
Router.delete("/subjects/:id", deleteSubject);

export default Router;