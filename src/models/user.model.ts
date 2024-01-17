import mongoose from "mongoose";

interface IUser extends mongoose.Document {
  id: string;
  name: string;
  email: string;
  mobileNumber: string;
  role: string;
}

const userSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  role: { type: String, required: true },
});

const UserModel = mongoose.model<IUser>("user", userSchema);
export default UserModel;
