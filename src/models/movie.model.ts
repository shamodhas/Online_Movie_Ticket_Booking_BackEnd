import { Schema, model, ObjectId } from "mongoose";
import * as SchemaTypes from "../types/SchemaTypes";

const movieSchema = new Schema<SchemaTypes.IMovie>({
  name: { type: String, required: true },
  director: { type: String, required: true },
  language: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date, requires: true },
  endDate: { type: Date, requires: true },
  trailerLink: { type: String, requires: true },
  status: { type: String, requires: true },
  user: { type: Schema.Types.ObjectId, requires: true },
});

const MovieModel = model("Movie", movieSchema);
export default MovieModel;
