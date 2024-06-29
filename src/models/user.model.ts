// import { Document, Schema, model } from "mongoose";
// import * as SchemaTypes from "../types/SchemaTypes";

// const userSchema = new Schema<SchemaTypes.IUser>({
//   name: { type: String, required: true },
//   email: { type: String, required: true },
//   password: { type: String, required: true },
//   mobileNumber: { type: String, required: true },
//   status: { type: Boolean, required: true },
//   role: { type: String, required: true },
// });

// const UserModel = model("User", userSchema);
// export default UserModel;


import mongoose, { Schema, Document } from 'mongoose';

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    role: string;
}

const UserSchema: Schema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['guest', 'customer', 'theaterOwner', 'admin'], default: 'guest' }
});

export default mongoose.model<User>('User', UserSchema);
