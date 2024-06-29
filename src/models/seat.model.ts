import mongoose, { Schema, model } from "mongoose"

export interface Seat extends Document {
  number: number
  isBooked: boolean
  theater: mongoose.Types.ObjectId
}

const SeatSchema: Schema = new Schema({
  number: { type: Number, required: true },
  isBooked: { type: Boolean, default: false },
  theater: { type: Schema.Types.ObjectId, ref: "Theater", required: true }
})

// const seatSchema = new Schema<SchemaTypes.ISeat>({
//   seatType: { type: String, required: true },
//   seatCount: { type: Number, required: true },
//   price: { type: Number, required: true },
//   hall: { type: Schema.Types.ObjectId, required: true },
//   user: { type: Schema.Types.ObjectId, requires: true },
// });

// const SeatModel = model("Seat", seatSchema)
// export default SeatModel
export default mongoose.model<Seat>("Seat", SeatSchema)
