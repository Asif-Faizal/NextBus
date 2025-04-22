import mongoose, { Schema, Document } from 'mongoose';
import { IStop } from '../interfaces/stop.interface';

export interface IStopDocument extends IStop, Document {}

const stopSchema = new Schema<IStopDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ['bus-stop', 'terminal', 'depot'],
      required: true,
    },
    district: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Stop = mongoose.model<IStopDocument>('Stop', stopSchema); 