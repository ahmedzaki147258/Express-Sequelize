import { body, check, validationResult } from "express-validator";
import User from "../models/Student.js";
import Subject from "../models/Subject.js";
import { Op } from "sequelize";

/********************************************* STUDENT *********************************************/
export const createUserValidation = [
  body("name")
    .notEmpty()
    .withMessage("name is required")
    .isString()
    .withMessage("name must be a string"),

  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("email must be a valid email address")
    .custom(async (value) => {
      const existingUser = await User.findOne({ where: { email: value } });
      if (existingUser) throw new Error("email already exists");
    }),

  body("password")
    .notEmpty()
    .withMessage("password is required")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 6 })
    .withMessage("password should be at least 6 characters long"),

  body("age")
    .notEmpty()
    .withMessage("age is required")
    .isInt({ min: 1 })
    .withMessage("age must be a number"),

  body("country")
    .optional()
    .custom(value => {
      if (value !== null && typeof value !== 'string') {
        throw new Error("country must be a string or null");
      }
      return true;
    }),
    
  /** subjects */
  check("subjects")
   .notEmpty()
   .withMessage("subjects is required")
   .isArray()
   .withMessage("subjects must be an array"),

  body("subjects.*.id")
   .notEmpty()
   .withMessage("subject ID is required")
   .isInt({ min: 1 })
   .withMessage("subject ID must be a number")
   .custom(async (subjectId) => {
     const subjectExists = await Subject.findOne({ where: { id: subjectId } });
     if (!subjectExists) {
       throw new Error("subject not found in Subject table");
     }
     return true;
   }),


  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "fail", errors: errors.array() });
    }
    next();
  },
];

export const updateUserValidation = [
  body("name")
    .optional()
    .isString()
    .withMessage("name must be a string"),

  body("email")
    .optional()
    .isEmail()
    .withMessage("email must be a valid email address")
    .custom(async (value, { req }) => {
      const studentId = req.params.id;
      const existingUser = await User.findOne({ where: { email: value, id: { [Op.ne]: studentId } } });
      if (existingUser) throw new Error("Email already exists");
    }),

  body("password")
    .optional()
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 6 })
    .withMessage("password should be at least 6 characters long"),

  body("age")
    .optional()
    .isInt({ min: 1 })
    .withMessage("age must be a number"),

  body("country")
    .optional()
    .custom(value => {
      if (value !== null && typeof value !== 'string') {
        throw new Error("country must be a string or null");
      }
      return true;
    }),

  /** subjects */
  check("subjects")
    .optional()
   .isArray()
   .withMessage("subjects must be an array"),

  body("subjects.*.id")
   .notEmpty()
   .withMessage("subject ID is required")
   .isInt({ min: 1 })
   .withMessage("subject ID must be a number")
   .custom(async (subjectId) => {
     const subjectExists = await Subject.findOne({ where: { id: subjectId } });
     if (!subjectExists) {
       throw new Error("subject not found in Subject table");
     }
     return true;
   }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "fail", errors: errors.array() });
    }
    next();
  },
]

/********************************************* SUBJECT *********************************************/
export const createSubjectValidation = [
  body("name")
    .notEmpty()
    .withMessage("name is required")
    .isString()
    .withMessage("name must be a string")
    .custom(async (value) => {
      const existingName = await Subject.findOne({ where: { name: value }});
      if (existingName) throw new Error(`${value} already exists`);
    }),

  body("description")
    .optional()
    .custom(value => {
      if (value !== null && typeof value !== 'string') {
        throw new Error("description must be a string or null");
      }
      return true;
    }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "fail", errors: errors.array() });
    }
    next();
  },
];

export const updateSubjectValidation = [
  body("name")
    .optional()
    .isString()
    .withMessage("name must be a string")
    .custom(async (value, { req }) => {
      const subjectId = req.params.id;
      const existingName = await Subject.findOne({ where: { name: value, id: { [Op.ne]: subjectId } }});
      if (existingName) throw new Error(`${value} already exists`);
    }),

  body("description")
    .optional()
    .custom(value => {
      if (value !== null && typeof value !== 'string') {
        throw new Error("description must be a string or null");
      }
      return true;
    }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "fail", errors: errors.array() });
    }
    next();
  },
];
