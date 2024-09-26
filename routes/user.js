import express from "express";
import { createUser, getUsers } from "../controllers/userController.js";
import { createUserValidation } from "../middlewares/validationMiddlewaresRequest.js";
const Router = express.Router();

Router.get("/", getUsers);
Router.post("/", createUserValidation, createUser);

export default Router;