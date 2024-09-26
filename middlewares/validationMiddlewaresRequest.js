import { body, validationResult } from "express-validator";
import User from "../models/User.js";

export const createUserValidation = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be a valid email address")
    .custom(async (value) => {
      const existingUser = await User.findOne({ where: { email: value } });
      if (existingUser) throw new Error("Email already exists");
    }),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 6 })
    .withMessage("Password should be at least 6 characters long"),
  body("age")
    .notEmpty()
    .withMessage("Age is required")
    .isInt({ min: 1 })
    .withMessage("Age must be a number"),
  body("country").optional().isString().withMessage("Country must be a string"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "fail", errors: errors.array() });
    }
    next();
  },
];
