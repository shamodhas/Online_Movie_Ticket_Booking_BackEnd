import dotenv from "dotenv"
import mongoose from "mongoose"
import express from "express"
import bodyParser from "body-parser"
import * as process from "process"
import UserRoutes from "./routes/user.routes"
import MovieRoutes from "./routes/movie.routes"
import TheaterRoutes from "./routes/theater.routes"
import HallRoutes from "./routes/hall.routes"
import SeatRoutes from "./routes/seat.routes"
import cors from "cors"
const { MongoClient } = require("mongodb")

dotenv.config()
const port = 8070
const app = express()

app.use(cors({ origin: "*" }))
app.use(bodyParser.json())

app.use("/user", UserRoutes)
app.use("/movie", MovieRoutes)
app.use("/theater", TheaterRoutes)
app.use("/hall", HallRoutes)
app.use("/seat", SeatRoutes)

const URI = process.env.MONGO_URL as string

mongoose.connect(URI)
const db = mongoose.connection;

db.on("error", (error) => {
  console.log("DB Connection Fail, Error : ", error);
});

db.on("open", (error) => {
  console.log("DB Connected Successfully");
});

app.listen(port, () => {
  console.log("Server started on port " + port)
})
