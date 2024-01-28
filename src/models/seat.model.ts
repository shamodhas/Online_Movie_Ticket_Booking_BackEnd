import { Schema, model, ObjectId } from "mongoose";
import * as SchemaTypes from "../types/SchemaTypes";

const seatSchema = new Schema<SchemaTypes.ISeat>({
  seatType: { type: String, required: true },
  seatCount: { type: Number, required: true },
  price: { type: Number, required: true },
  hall: { type: Schema.Types.ObjectId, required: true },
  user: { type: Schema.Types.ObjectId, requires: true },
});

const SeatModel = model("Seat", seatSchema);
export default SeatModel;
