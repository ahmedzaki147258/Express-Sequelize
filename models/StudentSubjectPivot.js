import { DataTypes } from "sequelize";
import sequelize from "../config.js";

const StudentSubjectPivot = sequelize.define('StudentSubjectPivot', {
    studentId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
            model: 'Student',
            key: 'id'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
    },
    subjectId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
            model: 'Subject',
            key: 'id'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
    }
});

sequelize.sync().then(() => {
    console.log('StudentSubjectPivot table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

export default StudentSubjectPivot;