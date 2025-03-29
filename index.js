import express from "express";
import dotenv from "dotenv";
import connectDatabase from "./config/mongoConnect.js";
import apiRouter from "./router/apiRouter.js";
import cors from "cors";

const port = process.env.PORT || 3020;
const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();
app.use(express.static("public"));

connectDatabase();
app.use("/api", apiRouter);
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`El servidor esta corriendo en el puerto ${port}`);
});

export default app;
