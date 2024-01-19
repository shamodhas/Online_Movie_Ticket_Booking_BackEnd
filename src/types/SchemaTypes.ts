import { Document, ObjectId } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  mobileNumber: string;
  role: string;
}

export interface IMovie extends Document {
  name: string;
  director: string;
  language: string;
  description: string;
  startDate: Date;
  endDate: Date;
  trailerLink: string;
  status: string;
  user: ObjectId;
}
