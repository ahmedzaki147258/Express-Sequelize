import Student from './Student.js';
import Subject from './Subject.js';
import StudentSubjectPivot from './StudentSubjectPivot.js';

// Define many-to-many relationships
Student.belongsToMany(Subject, { through: StudentSubjectPivot, foreignKey: 'studentId' });
Subject.belongsToMany(Student, { through: StudentSubjectPivot, foreignKey: 'subjectId' });

// Export the models for use elsewhere
export { Student, Subject, StudentSubjectPivot };
