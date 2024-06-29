// import { Schema, model, ObjectId } from "mongoose";
// import * as SchemaTypes from "../types/SchemaTypes";

// const movieSchema = new Schema<SchemaTypes.IMovie>({
//   name: { type: String, required: true },
//   director: { type: String, required: true },
//   language: { type: String, required: true },
//   description: { type: String, required: true },
//   startDate: { type: Date, requires: true },
//   endDate: { type: Date, requires: true },
//   trailerLink: { type: String, requires: true },
//   imageUrl: { type: String, requires: true },
//   status: { type: String, requires: true },
//   user: { type: Schema.Types.ObjectId, requires: true },
// });

// const MovieModel = model("Movie", movieSchema);
// export default MovieModel;

import mongoose, { Schema, Document } from "mongoose"

export interface Movie extends Document {
  userId: mongoose.Types.ObjectId
  title: string
  description: string
  releaseDate: Date
  director: string
  imageUrl?: string
  status: string
}

const MovieSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  director: { type: String, required: true },
  imageUrl: { type: String },
  status: {
    type: String,
    enum: ["upcoming", "nowShowing", "past"],
    default: "upcoming"
  }
})

export default mongoose.model<Movie>("Movie", MovieSchema)
