import express from "express";
import dotenv from "dotenv";
import connectDatabase from "./Database/mongoConnect.js";
import apiRouter from "./router/apiRouter.js";

const app = express();
app.use(express.json());

dotenv.config();
const port = process.env.PORT || 3020;

connectDatabase();
app.use("/api", apiRouter);
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`El servidor esta corriendo en el puerto ${port}`);
});

export default app;
