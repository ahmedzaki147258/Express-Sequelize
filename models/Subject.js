import { DataTypes } from "sequelize";
import sequelize from "../config.js";

const Subject = sequelize.define('Subject', {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT('long'),
        allowNull: true
    }
});

sequelize.sync().then(() => {
    console.log('Subjects table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

export default Subject;