import { Document, Schema, model } from "mongoose";
import * as SchemaTypes from "../types/SchemaTypes";

const userSchema = new Schema<SchemaTypes.IUser>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  role: { type: String, required: true },
});

const UserModel = model("User", userSchema);
export default UserModel;
