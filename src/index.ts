import dotenv from "dotenv"
import mongoose from "mongoose"
import express from "express"
import bodyParser from "body-parser"
import * as process from "process"
import AuthRoutes from "./routes/auth.routes"
import UserRoutes from "./routes/user.routes"
import MovieRoutes from "./routes/movie.routes"
import TheaterRoutes from "./routes/theater.routes"
import ScreeningRoutes from "./routes/screening.routes"
import BookingRoutes from "./routes/booking.routes"
import cors from "cors"

dotenv.config()
const port = 8070
const app = express()

app.use(cors({ origin: "*" }))
app.use(bodyParser.json())

app.use("/api/auth", AuthRoutes)
app.use("/api/users", UserRoutes)
app.use("/api/movies", MovieRoutes)
app.use("/api/theaters", TheaterRoutes)
app.use("/api/screenings", ScreeningRoutes)
app.use("/api/bookings", BookingRoutes)

const URI = process.env.MONGO_URL as string

// mongoose.connect(URI)
// const db = mongoose.connection;

// db.on("error", (error) => {
//   console.log("DB Connection Fail, Error : ", error);
// });

// db.on("open", (error) => {
//   console.log("DB Connected Successfully");
// });
const connectDB = async () => {
  try {
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    } as any)
    console.log("MongoDB connected")
  } catch (error: any) {
    console.error("Error connecting to MongoDB:", error.message)
    process.exit(1)
  }
}

app.listen(port, () => {
  console.log("Server started on port " + port)
})
