import * as process from "process"
import dotenv from "dotenv"

dotenv.config()
export default {
  JWT_SECRET: process.env.SECRET
}
