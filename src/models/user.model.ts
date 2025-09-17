import mongoose, { Schema, Document } from "mongoose"

export interface IUser extends Document {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  profileImage?: string
  role: "Admin" | "Customer" | "TheaterOwner"
  approvalStatus: "pending" | "approved" | "rejected"
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    profileImage: { type: String },
    role: {
      type: String,
      enum: ["Admin", "Customer", "TheaterOwner"],
      default: "Customer"
    },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved"
    }
  },
  { timestamps: true }
)

export default mongoose.model<IUser>("User", userSchema)
