import mongoose, { Schema, Document } from 'mongoose';

export interface Theater extends Document {
    name: string;
    location: string;
    seats: number;
    owners: mongoose.Types.ObjectId[];
}

const TheaterSchema: Schema = new Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    seats: { type: Number, required: true },
    owners: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

export default mongoose.model<Theater>('Theater', TheaterSchema);
