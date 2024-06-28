import { Document, Schema, model } from "mongoose";
import * as SchemaTypes from "../types/SchemaTypes";

const userSchema = new Schema<SchemaTypes.IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  status: { type: Boolean, required: true },
  role: { type: String, required: true },
});

const UserModel = model("User", userSchema);
export default UserModel;
