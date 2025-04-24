import mongoose, { Schema, Document } from 'mongoose';
import { IAdHistory, AdStatus } from '../interfaces/ad.interface';

export interface IAdHistoryDocument extends IAdHistory, Document {}

const adHistorySchema = new Schema<IAdHistoryDocument>(
  {
    adId: {
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
      enum: [AdStatus.CREATED, AdStatus.APPROVED, AdStatus.WAITING_FOR_EDIT, AdStatus.WAITING_FOR_DELETE],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const AdHistory = mongoose.model<IAdHistoryDocument>('AdHistory', adHistorySchema); 