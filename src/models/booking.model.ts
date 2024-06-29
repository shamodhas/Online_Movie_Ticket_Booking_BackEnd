import mongoose, { Schema, Document } from "mongoose"

export interface Booking extends Document {
  userId: mongoose.Types.ObjectId
  screeningId: mongoose.Types.ObjectId
  //   seats: number
  seats: number[]
  totalPrice: number
}

const BookingSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  screeningId: {
    type: Schema.Types.ObjectId,
    ref: "Screening",
    required: true
  },
  //   seats: { type: Number, required: true }
  seats: { type: [Number], required: true },
  totalPrice: { type: Number, required: true }
})

export default mongoose.model<Booking>("Booking", BookingSchema)
