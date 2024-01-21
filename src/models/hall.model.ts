import { Schema, model, ObjectId } from "mongoose";
import * as SchemaTypes from "../types/SchemaTypes";

const hallSchema = new Schema<SchemaTypes.IHall>({
  hallNumber: { type: String, required: true },
  theater: { type: Schema.Types.ObjectId, requires: true },
  user: { type: Schema.Types.ObjectId, requires: true },
});

const HallModel = model("Hall", hallSchema);
export default HallModel;
