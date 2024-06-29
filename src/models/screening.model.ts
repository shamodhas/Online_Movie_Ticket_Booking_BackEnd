import mongoose, { Schema, Document } from 'mongoose';

export interface Screening extends Document {
    movieId: mongoose.Types.ObjectId;
    theaterId: mongoose.Types.ObjectId;
    startTime: Date;
    endTime: Date;
}

const ScreeningSchema: Schema = new Schema({
    movieId: { type: Schema.Types.ObjectId, ref: 'Movie', required: true },
    theaterId: { type: Schema.Types.ObjectId, ref: 'Theater', required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
});

export default mongoose.model<Screening>('Screening', ScreeningSchema);
