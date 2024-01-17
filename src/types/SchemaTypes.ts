import { Document, ObjectId } from "mongoose";

export interface IUser extends Document {
  id: string;
  name: string;
  email: string;
  mobileNumber: string;
  role: string;
}

export interface IMovie extends Document {
  id: string;
  name: string;
  director: string;
  language: string;
  description: string;
  startDate: Date;
  endDate: Date;
  trailerLink: string;
  user: ObjectId;
}
