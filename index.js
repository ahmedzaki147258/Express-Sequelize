import express from "express";
import sequelize from "./config.js";
import userRoute from "./routes/user.js";
const app = express();

app.use(express.json());
app.use('/api/users', userRoute);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(process.env.PORT || 3000, async () => {
    try {
        await sequelize.authenticate();
        console.log("listening on http://localhost:3000");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
});