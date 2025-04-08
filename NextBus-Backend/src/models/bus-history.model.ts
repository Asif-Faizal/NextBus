import mongoose, { Schema, Document } from 'mongoose';
import { IBusHistory, BusStatus } from '../interfaces/bus.interface';

export interface IBusHistoryDocument extends IBusHistory, Document {}

const busHistorySchema = new Schema<IBusHistoryDocument>(
  {
    busId: {
      type: String,
      required: true,
    },
    previousData: {
      type: Schema.Types.Mixed,
      required: true,
    },
    newData: {
      type: Schema.Types.Mixed,
      required: true,
    },
    modifiedBy: {
      type: String,
      required: true,
    },
    modificationType: {
      type: String,
      enum: ['EDIT', 'DELETE'],
      required: true,
    },
    status: {
      type: Number,
      enum: [BusStatus.CREATED, BusStatus.APPROVED, BusStatus.WAITING_FOR_EDIT, BusStatus.WAITING_FOR_DELETE],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const BusHistory = mongoose.model<IBusHistoryDocument>('BusHistory', busHistorySchema); 