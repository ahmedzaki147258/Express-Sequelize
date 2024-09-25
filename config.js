import { Sequelize } from "sequelize";

const sequelize = new Sequelize('express-sequelize', 'root', '', {
    dialect: 'mysql',
    host: 'localhost'
});

export default sequelize;
