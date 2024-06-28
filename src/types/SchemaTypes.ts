import { Document, ObjectId } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  mobileNumber: string;
  status: boolean;
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
  imageUrl: string;
  status: string;
  user: ObjectId;
}

export interface ITheater extends Document {
  name: string;
  location: string;
  mobileNumber: string;
  user: ObjectId;
}

export interface IHall extends Document {
  hallNumber: string;
  theater: ObjectId;
  user: ObjectId;
}

export interface ISeat extends Document {
  seatType: string;
  seatCount: number;
  price: number;
  hall: ObjectId;
  user: ObjectId;
}
