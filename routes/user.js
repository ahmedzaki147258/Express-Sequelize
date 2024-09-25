import express from "express";
import { createUser, getUsers } from "../controllers/userController.js";
const Router = express.Router();

Router.get("/", getUsers);
Router.post("/", createUser);

export default Router;