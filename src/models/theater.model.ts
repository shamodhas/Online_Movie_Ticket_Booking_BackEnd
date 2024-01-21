import { Schema, model, ObjectId } from "mongoose";
import * as SchemaTypes from "../types/SchemaTypes";

const theaterSchema = new Schema<SchemaTypes.ITheater>({
  name: { type: String, required: true },
  location: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, requires: true },
});

const TheaterModel = model("Theater", theaterSchema);
export default TheaterModel;
