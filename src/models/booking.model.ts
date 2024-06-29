import mongoose, { Schema, Document } from 'mongoose';

export interface Booking extends Document {
    userId: mongoose.Types.ObjectId;
    screeningId: mongoose.Types.ObjectId;
    seats: number;
}

const BookingSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    screeningId: { type: Schema.Types.ObjectId, ref: 'Screening', required: true },
    seats: { type: Number, required: true },
});

export default mongoose.model<Booking>('Booking', BookingSchema);
