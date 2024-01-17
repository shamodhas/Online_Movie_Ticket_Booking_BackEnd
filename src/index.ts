import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const port = 8080;
const app = express();

// @ts-ignore
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/movie_reservation");
const db = mongoose.connection;

db.on("error", (error) => {
  console.log("DB Connection Fail, Error : ", error);
});

db.on("open", (error) => {
  console.log("DB Connected Successfully");
});

app.get("/user/all", (req: express.Request, res: express.Response) => {
  res.send();
});

app.listen(port, () => {
  console.log("Server started on port " + port);
});
