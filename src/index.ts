import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import * as process from "process";
import UserRoutes from "./routes/user.routes";
import cors from "cors";

dotenv.config();
const port = 8080;
const app = express();

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

app.use("/user", UserRoutes);

mongoose.connect(process.env.MONGO_URL as string);
const db = mongoose.connection;

db.on("error", (error) => {
  console.log("DB Connection Fail, Error : ", error);
});

db.on("open", (error) => {
  console.log("DB Connected Successfully");
});

app.listen(port, () => {
  console.log("Server started on port " + port);
});
